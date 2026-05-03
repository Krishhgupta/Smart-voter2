import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import useElectionStore from '../store/useElectionStore';
import toast from 'react-hot-toast';
import apiClient from '../api/client';

const MockVotingPage = () => {
  const { t } = useLanguage();
  const { hasVoted, selectedCandidate, castVote, resetVote } = useElectionStore();
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const candidates = [
    { id: 1, name: t('cand1Name'), party: t('cand1Party'), symbol: "🌟" },
    { id: 2, name: t('cand2Name'), party: t('cand2Party'), symbol: "🦅" },
    { id: 3, name: t('cand3Name'), party: t('cand3Party'), symbol: "🌳" },
    { id: 4, name: t('cand4Name'), party: t('cand4Party'), symbol: "❌" },
  ];

  const handleVote = async () => {
    if (selected) {
      const candidate = candidates.find(c => c.id === selected);
      try {
        await apiClient.post('/vote', {
          id: candidate.id,
          name: candidate.name,
          party: candidate.party
        });
        castVote(candidate);
        setShowModal(true);
      } catch (err) {
        toast.error("Failed to connect to the secure voting server.");
      }
    }
  };

  const reset = () => {
    setShowModal(false);
    setSelected(null);
  };

  const handleResetMachine = () => {
    resetVote();
    setSelected(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 transition-colors duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">{t('mockVote')}</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors duration-300">{t('mockSubtitle')}</p>
      </div>

      {hasVoted && !showModal ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-10 text-center max-w-lg mx-auto transition-colors duration-300"
        >
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('voteCastTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            You have already cast your mock vote for <strong>{selectedCandidate?.name}</strong> ({selectedCandidate?.party}).
          </p>
          <button 
            onClick={handleResetMachine}
            className="px-8 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Reset Machine
          </button>
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <div className="bg-slate-100 dark:bg-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600 transition-colors duration-300">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200">{t('digitalEVM')}</h2>
        </div>
        <div className="p-6 divide-y divide-slate-100 dark:divide-slate-700 transition-colors duration-300">
          {candidates.map((cand) => (
            <div 
              key={cand.id} 
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${selected === cand.id ? 'bg-primary-50 dark:bg-primary-900/30 ring-2 ring-primary-500' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              onClick={() => setSelected(cand.id)}
            >
              <div className="flex items-center gap-4 cursor-pointer">
                <span className="text-3xl bg-slate-100 dark:bg-slate-600 w-14 h-14 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300">{cand.symbol}</span>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg transition-colors duration-300">{cand.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">{cand.party}</p>
                </div>
              </div>
              <button 
                className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors ${selected === cand.id ? 'border-primary-600 bg-primary-600' : 'border-slate-300 dark:border-slate-600'}`}
              >
                {selected === cand.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-700 p-6 flex justify-end gap-4 border-t border-slate-200 dark:border-slate-600 transition-colors duration-300">
          <button 
            onClick={() => setSelected(null)}
            className="px-6 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {t('clearBtn')}
          </button>
          <button 
            disabled={!selected}
            onClick={handleVote}
            className="px-8 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-md shadow-primary-200 dark:shadow-none hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {t('confirmVoteBtn')}
          </button>
        </div>
      </div>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center transition-colors duration-300"
            >
              <button onClick={reset} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X />
              </button>
              
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                <CheckCircle size={40} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 transition-colors duration-300">{t('voteCastTitle')}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 transition-colors duration-300">{t('voteCastDesc')}</p>
              
              <button 
                onClick={reset}
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {t('returnBtn')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MockVotingPage;
