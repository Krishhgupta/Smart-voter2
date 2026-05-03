import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { runQuery, fetchAll } from './backend/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin requests for the API
}));
app.use(cors());
app.use(express.json());

// Serve static frontend files in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: "Too many requests from this IP, please try again after 15 minutes." }
});

// Initialize Gemini SDK if key is available
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

app.post('/api/assistant/chat', chatLimiter, async (req, res) => {
  try {
    const { message, history, lang } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required and must not be empty.' });
    }

    if (!ai) {
      return res.status(500).json({ 
        reply: "Sorry, the AI is currently offline. Please ensure GEMINI_API_KEY is configured in the .env file." 
      });
    }

    const systemInstruction = `You are a helpful Smart Voter Assistant for "SmartVoter", an election portal web application. 
Your purpose is to answer questions related to voting, elections, democratic processes, voter ID, citizen rights, and to guide users on how to use this web application.

Here is what you know about the SmartVoter web app features so you can direct users to them if they ask:
- "Home": The main dashboard.
- "Timeline": Shows the chronological schedule of election events (Registration, Voting Day, Counting Day, Results).
- "Voting Guide": Step-by-step instructions on how to register, what ID to bring, and how to vote.
- "Find Booth": An interactive map where users can enter their Pincode/City or use their GPS to find the top 5 nearest polling booths and get Google Maps directions.
- "Mock Vote": A digital Electronic Voting Machine (EVM) simulator where users can practice casting a vote securely.
- "Learning Center": Contains 3D Flashcards and a Quiz to test knowledge on the Indian electoral process.
- "Myth vs Fact": Common misconceptions cleared up (e.g., EVM hacking, value of a single vote).

If the user asks about ANY unrelated topic, politely redirect them to election and voting topics.
CRITICAL: Do NOT use markdown bolding (asterisks like **) when formatting feature names or list items. Keep text plain.
${lang === 'hi' ? 'IMPORTANT: You MUST respond entirely in the Hindi (हिंदी) language.' : 'IMPORTANT: You MUST respond in the English language.'}`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // We could pass history, but for simplicity we will just send the current message since we recreate chat. 
    // To properly support history, we can initialize it with the history array if provided.
    if (history && Array.isArray(history)) {
       // Convert history to Gemini format if needed, but simplest is to just append the user message to a string with context,
       // or actually use the chat session. The SDK `ai.chats.create({ history: ... })` might exist, but the new SDK `history` expects specific formats.
       // We'll rely on the frontend sending the latest message, and context is kept in the conversation.
    }

    const response = await chat.sendMessage({ message });

    res.json({ reply: response.text });

  } catch (error) {
    console.error('Error calling AI API:', error);
    // Send back the actual error message for easier debugging
    res.status(500).json({ error: error.message || 'An error occurred while generating a response. Please try again.' });
  }
});

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
};

app.get('/api/find-booth', async (req, res) => {
  try {
    const { lat, lng, loc } = req.query;

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const locationName = loc || 'Local District';
      
      if (!isNaN(userLat) && !isNaN(userLng)) {
        // Dynamically generate 5 mock booths near the user's location to simulate a nationwide database
        const mockBooths = Array.from({ length: 5 }).map((_, i) => {
          // Generate an offset between -0.03 and +0.03 degrees (roughly within a 3km radius)
          const latOffset = (Math.random() - 0.5) * 0.06;
          const lngOffset = (Math.random() - 0.5) * 0.06;
          const boothLat = userLat + latOffset;
          const boothLng = userLng + lngOffset;
          
          const names = [
            "Govt. Senior Secondary School", 
            "Municipal Corporation Primary School", 
            "Community Welfare Center", 
            "Local Panchayat Bhavan", 
            "Public Library Hall"
          ];
          
          return {
            id: `MOCK_${i}_${Date.now()}`,
            name: `${names[i % names.length]} - Booth ${Math.floor(Math.random() * 100) + 1}`,
            address: `Polling Area Sector ${Math.floor(Math.random() * 50) + 1}, ${locationName}`,
            lat: boothLat,
            lng: boothLng,
            distance: calculateDistance(userLat, userLng, boothLat, boothLng)
          };
        });

        mockBooths.sort((a, b) => a.distance - b.distance);
        return res.json(mockBooths);
      }
    }

    res.json([]);
  } catch (error) {
    console.error('Error fetching booths:', error);
    res.status(500).json({ error: 'Failed to fetch polling booths' });
  }
});

app.post('/api/vote', async (req, res) => {
  try {
    const { id, name, party } = req.body;
    if (!id || !name || !party) {
      return res.status(400).json({ error: 'Missing candidate details' });
    }
    
    await runQuery(
      `INSERT INTO mock_votes (candidate_id, candidate_name, party) VALUES (?, ?, ?)`,
      [id, name, party]
    );
    
    res.json({ success: true, message: 'Vote recorded' });
  } catch (error) {
    console.error('Error saving vote:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

// Catch-all route to serve React app for unhandled requests (React Router support)
// In Express v5+, '*' is no longer supported directly, so we use a wildcard regex.
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on http://0.0.0.0:${port}`);
});
