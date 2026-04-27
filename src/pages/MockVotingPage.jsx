import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MockVotingPage = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const candidates = [
    { id: 1, name: t('cand1Name'), party: t('cand1Party'), symbol: "🌟" },
    { id: 2, name: t('cand2Name'), party: t('cand2Party'), symbol: "🦅" },
    { id: 3, name: t('cand3Name'), party: t('cand3Party'), symbol: "🌳" },
    { id: 4, name: t('cand4Name'), party: t('cand4Party'), symbol: "❌" },
  ];

  const handleVote = () => {
    if (selected) setShowModal(true);
  };

  const reset = () => {
    setShowModal(false);
    setSelected(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('mockVote')}</h1>
        <p className="text-slate-500">{t('mockSubtitle')}</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-700">{t('digitalEVM')}</h2>
        </div>
        <div className="p-6 divide-y divide-slate-100">
          {candidates.map((cand) => (
            <div 
              key={cand.id} 
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${selected === cand.id ? 'bg-primary-50 ring-2 ring-primary-500' : 'hover:bg-slate-50'}`}
              onClick={() => setSelected(cand.id)}
            >
              <div className="flex items-center gap-4 cursor-pointer">
                <span className="text-3xl bg-slate-100 w-14 h-14 rounded-full flex items-center justify-center shadow-inner">{cand.symbol}</span>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{cand.name}</h3>
                  <p className="text-sm text-slate-500">{cand.party}</p>
                </div>
              </div>
              <button 
                className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors ${selected === cand.id ? 'border-primary-600 bg-primary-600' : 'border-slate-300'}`}
              >
                {selected === cand.id && <div className="w-2 h-2 bg-white rounded-full" />}
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-50 p-6 flex justify-end gap-4 border-t border-slate-200">
          <button 
            onClick={() => setSelected(null)}
            className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {t('clearBtn')}
          </button>
          <button 
            disabled={!selected}
            onClick={handleVote}
            className="px-8 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-md shadow-primary-200 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {t('confirmVoteBtn')}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center"
            >
              <button onClick={reset} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X />
              </button>
              
              <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('voteCastTitle')}</h3>
              <p className="text-slate-600 mb-6">{t('voteCastDesc')}</p>
              
              <button 
                onClick={reset}
                className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
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
