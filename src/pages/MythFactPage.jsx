import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MythFactPage = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    { mythKey: "myth1", factKey: "fact1" },
    { mythKey: "myth2", factKey: "fact2" },
    { mythKey: "myth3", factKey: "fact3" },
    { mythKey: "myth4", factKey: "fact4" },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-slate-900 mb-10">{t('mythFact')}</h1>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <button 
              onClick={() => handleToggle(idx)}
              className="w-full flex items-center justify-between p-5 text-left bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <span className="font-bold text-red-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {t('mythLabel')}: {t(item.mythKey)}
              </span>
              <motion.div animate={{ rotate: openIndex === idx ? 180 : 0 }}>
                <ChevronDown className="text-slate-500" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 border-t border-slate-100 bg-white">
                    <span className="font-bold text-primary-600 flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                      {t('factLabel')}:
                    </span>
                    <p className="text-slate-700 leading-relaxed pl-4 border-l-2 border-primary-200">
                      {t(item.factKey)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MythFactPage;
