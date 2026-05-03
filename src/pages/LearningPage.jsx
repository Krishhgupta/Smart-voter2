import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, FileQuestion, BookOpen, CheckCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useElectionStore from '../store/useElectionStore';

const LearningPage = () => {
  const { t } = useLanguage();
  const { quizScore: globalScore, setQuizScore } = useElectionStore();
  const [activeTab, setActiveTab] = useState('flashcards');

  // Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(globalScore || 0);
  const [showScore, setShowScore] = useState(globalScore !== null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const flashcards = [
    { id: 1, q: t('fc1Q'), a: t('fc1A') },
    { id: 2, q: t('fc2Q'), a: t('fc2A') },
    { id: 3, q: t('fc3Q'), a: t('fc3A') },
    { id: 4, q: t('fc4Q'), a: t('fc4A') },
  ];

  const quizQuestions = [
    { q: t('q1'), options: [t('q1O1'), t('q1O2'), t('q1O3'), t('q1O4')], answer: t('q1O2') },
    { q: t('q2'), options: [t('q2O1'), t('q2O2'), t('q2O3'), t('q2O4')], answer: t('q2O1') },
    { q: t('q3'), options: [t('q3O1'), t('q3O2'), t('q3O3'), t('q3O4')], answer: t('q3O1') },
    { q: t('q4'), options: [t('q4O1'), t('q4O2'), t('q4O3'), t('q4O4')], answer: t('q4O2') },
    { q: t('q5'), options: [t('q5O1'), t('q5O2'), t('q5O3'), t('q5O4')], answer: t('q5O1') },
  ];

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQIndex].answer) {
      setScore(score + 1);
    }

    const nextQ = currentQIndex + 1;
    if (nextQ < quizQuestions.length) {
      setCurrentQIndex(nextQ);
      setSelectedAnswer(null);
    } else {
      const finalScore = selectedAnswer === quizQuestions[currentQIndex].answer ? score + 1 : score;
      if (globalScore === null || finalScore > globalScore) {
        setQuizScore(finalScore);
      }
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQIndex(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 transition-colors duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3 transition-colors duration-300">
          <BookOpen className="text-primary-600 dark:text-primary-400 transition-colors duration-300" size={36} />
          {t('learn')}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg transition-colors duration-300">{activeTab === 'flashcards' ? t('flashcardSubtitle') : t('quizSubtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-2 w-full max-w-md shadow-sm transition-colors duration-300">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'flashcards' 
                ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-md' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Brain size={20} />
            {t('flashcards')}
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'quiz' 
                ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-md' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <FileQuestion size={20} />
            {t('quiz')}
          </button>
        </div>
      </div>

      {/* Flashcards Section */}
      {activeTab === 'flashcards' && (
        <div className="grid md:grid-cols-2 gap-8">
          {flashcards.map((card) => (
            <Flashcard key={card.id} q={card.q} a={card.a} />
          ))}
        </div>
      )}

      {/* Quiz Section */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showScore ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300"
              >
                <div className="flex justify-between items-center mb-6 text-sm font-bold text-slate-400">
                  <span>Question {currentQIndex + 1} of {quizQuestions.length}</span>
                  <span>Score: {score}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-8 leading-relaxed transition-colors duration-300">
                  {quizQuestions[currentQIndex].q}
                </h3>

                <div className="space-y-4">
                  {quizQuestions[currentQIndex].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(option)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-medium text-lg ${
                        selectedAnswer === option
                          ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100'
                          : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    className="flex items-center gap-2 px-8 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {currentQIndex === quizQuestions.length - 1 ? t('submitBtn') : t('nextBtn')}
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="score"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-lg border-2 border-primary-100 dark:border-primary-900 text-center transition-colors duration-300"
              >
                <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">{t('scoreTitle')}</h2>
                <div className="text-6xl font-black text-primary-600 dark:text-primary-400 mb-6 transition-colors duration-300">
                  {score} <span className="text-2xl text-slate-400">/ {quizQuestions.length}</span>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 transition-colors duration-300">
                  {score === quizQuestions.length ? t('scoreMsgGreat') : score >= 3 ? t('scoreMsgGood') : t('scoreMsgPoor')}
                </p>
                
                <button
                  onClick={restartQuiz}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-all hover:-translate-y-1"
                >
                  <RotateCcw size={20} />
                  {t('retakeBtn')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

// Flashcard Component
const Flashcard = ({ q, a }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-64 w-full perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 border-2 border-primary-100 dark:border-primary-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/50 rounded-full flex items-center justify-center mb-6 text-primary-500 dark:text-primary-400 transition-colors duration-300">
            <Brain size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-relaxed transition-colors duration-300">{q}</h3>
          <p className="absolute bottom-6 text-sm font-bold text-primary-400 uppercase tracking-widest">Tap to flip</p>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden bg-primary-600 dark:bg-primary-700 text-white rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-lg transition-colors duration-300"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="text-xl font-medium leading-relaxed">{a}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LearningPage;
