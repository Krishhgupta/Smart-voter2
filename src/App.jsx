import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

// Pages placeholders (will be implemented next)
import HomePage from './pages/HomePage';
import VotingGuidePage from './pages/VotingGuidePage';
import AIAssistantPage from './pages/AIAssistantPage';
import TimelinePage from './pages/TimelinePage';
import MockVotingPage from './pages/MockVotingPage';
import MythFactPage from './pages/MythFactPage';
import LearningPage from './pages/LearningPage';
import FindBoothPage from './pages/FindBoothPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
          <NavBar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/guide" element={<VotingGuidePage />} />
              <Route path="/assistant" element={<AIAssistantPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/mock-vote" element={<MockVotingPage />} />
              <Route path="/myth-fact" element={<MythFactPage />} />
              <Route path="/learn" element={<LearningPage />} />
              <Route path="/find-booth" element={<FindBoothPage />} />
            </Routes>
          </main>
          <Footer />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
