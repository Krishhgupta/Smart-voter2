import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Fingerprint, MapPin, Vote, BarChart3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const VotingGuidePage = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: UserPlus, title: t('register'), desc: t('step1Desc') },
    { icon: Fingerprint, title: t('verify'), desc: t('step2Desc') },
    { icon: MapPin, title: t('findBooth'), desc: t('step3Desc') },
    { icon: Vote, title: t('vote'), desc: t('step4Desc') },
    { icon: BarChart3, title: t('results'), desc: t('step5Desc') },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">{t('guide')}</h1>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            variants={item}
            className="flex flex-col sm:flex-row items-start sm:items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow gap-6"
          >
            <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl relative">
              <step.icon className="w-8 h-8 opacity-20 absolute" />
              <span className="relative z-10">{index + 1}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-lg leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default VotingGuidePage;
