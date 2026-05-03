import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle, Info, MessagesSquare, MapPin, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('timeline'),
      desc: t('featTimelineDesc'),
      icon: <Calendar className="w-8 h-8 text-primary-500" />,
      link: '/timeline',
    },
    {
      title: t('guide'),
      desc: t('featGuideDesc'),
      icon: <Info className="w-8 h-8 text-primary-500" />,
      link: '/guide',
    },
    {
      title: t('findBooth'),
      desc: t('featBoothDesc'),
      icon: <MapPin className="w-8 h-8 text-primary-500" />,
      link: '/find-booth',
    },
    {
      title: t('mockVote'),
      desc: t('featMockDesc'),
      icon: <CheckCircle className="w-8 h-8 text-primary-500" />,
      link: '/mock-vote',
    },
    {
      title: t('learn'),
      desc: t('featLearnDesc'),
      icon: <BookOpen className="w-8 h-8 text-primary-500" />,
      link: '/learn',
    },
    {
      title: t('mythFact'),
      desc: t('featMythFactDesc'),
      icon: <HelpCircle className="w-8 h-8 text-primary-500" />,
      link: '/myth-fact',
    },
    {
      title: t('assistant'),
      desc: t('featAssistantDesc'),
      icon: <MessagesSquare className="w-8 h-8 text-primary-500" />,
      link: '/assistant',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px-73px)]">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary-50 dark:from-slate-900 to-secondary-50 dark:to-slate-800 transition-colors duration-300">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/40 dark:bg-primary-900/20 rounded-full filter blur-2xl opacity-60 will-change-transform translate-z-0"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-200/40 dark:bg-secondary-900/20 rounded-full filter blur-2xl opacity-60 will-change-transform translate-z-0"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/20 rounded-full filter blur-2xl opacity-60 will-change-transform translate-z-0"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 transition-colors duration-300"
          >
            {t('heroTitle')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto transition-colors duration-300"
          >
            {t('heroSubtitle')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/guide" className="px-8 py-3.5 bg-primary-600 text-white rounded-full font-semibold shadow-lg shadow-primary-200 dark:shadow-none hover:bg-primary-700 hover:shadow-xl transition-all hover:-translate-y-0.5">
              {t('getStarted')}
            </Link>
            <Link to="/myth-fact" className="px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full font-semibold border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5">
              {t('learnMore')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {features.map((feature, idx) => (
            <Link key={idx} to={feature.link}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all h-full cursor-pointer"
              >
                <div className="w-14 h-14 bg-primary-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 transition-colors duration-300">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed transition-colors duration-300">{feature.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
