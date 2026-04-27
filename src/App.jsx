import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// Pages placeholders (will be implemented next)
import HomePage from './pages/HomePage';
import VotingGuidePage from './pages/VotingGuidePage';
import AIAssistantPage from './pages/AIAssistantPage';
import TimelinePage from './pages/TimelinePage';
import MockVotingPage from './pages/MockVotingPage';
import MythFactPage from './pages/MythFactPage';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
          <NavBar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/guide" element={<VotingGuidePage />} />
              <Route path="/assistant" element={<AIAssistantPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/mock-vote" element={<MockVotingPage />} />
              <Route path="/myth-fact" element={<MythFactPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
