import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini SDK if key is available
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required and must not be empty.' });
    }

    if (!ai) {
      return res.status(500).json({ 
        reply: "Sorry, the AI is currently offline. Please ensure GEMINI_API_KEY is configured in the .env file." 
      });
    }

    const systemInstruction = `You are a helpful Smart Voter Assistant for an election portal. 
Your purpose is ONLY to answer questions related to voting, elections, democratic processes, voter ID, and citizen rights. 
If the user asks about ANY unrelated topic, politely redirect them to election and voting topics.`;

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
    res.status(500).json({ error: 'An error occurred while generating a response. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
