import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const TimelinePage = () => {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const events = [
    { date: "March 15", title: t('timelineEvent1Title'), desc: t('timelineEvent1Desc') },
    { date: "April 10", title: t('timelineEvent2Title'), desc: t('timelineEvent2Desc') },
    { date: "May 5", title: t('timelineEvent3Title'), desc: t('timelineEvent3Desc') },
    { date: "May 8", title: t('timelineEvent4Title'), desc: t('timelineEvent4Desc') },
    { date: "May 10", title: t('timelineEvent5Title'), desc: t('timelineEvent5Desc') },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 relative">
      <h1 className="text-3xl font-bold text-center text-slate-900 mb-16">{t('timeline')}</h1>

      {/* Progress Line */}
      <div className="absolute left-[39px] md:left-1/2 top-32 bottom-16 w-0.5 bg-slate-200 hidden md:block">
        <motion.div className="w-full bg-primary-500 origin-top h-full" style={{ scaleY }} />
      </div>

      <div className="space-y-12">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={index} className="relative flex items-center md:justify-between flex-col md:flex-row gap-8 md:gap-0 font-sans">
              
              {/* Timeline Dot */}
              <div className="md:absolute md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-primary-100 border-4 border-white shadow flex items-center justify-center z-10 hidden md:flex">
                <div className="w-3 h-3 bg-primary-600 rounded-full" />
              </div>

              {/* Card Space */}
              <motion.div 
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto'}`}
              >
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative tooltip-caret">
                  <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm font-bold rounded-full mb-3">
                    {event.date}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                  <p className="text-slate-600">{event.desc}</p>
                </div>
              </motion.div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelinePage;
