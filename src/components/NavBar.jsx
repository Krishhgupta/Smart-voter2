import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Languages } from 'lucide-react';

const NavBar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { path: '/', label: t('home') },
    { path: '/guide', label: t('guide') },
    { path: '/assistant', label: t('assistant') },
    { path: '/timeline', label: t('timeline') },
    { path: '/mock-vote', label: t('mockVote') },
    { path: '/myth-fact', label: t('mythFact') },
  ];

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('appTitle')}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary-600 ${
                    isActive ? 'text-primary-600' : 'text-slate-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium text-slate-700"
            >
              <Languages className="w-4 h-4" />
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={handleToggle} className="text-slate-600 hover:text-primary-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600"
            >
              <Languages className="w-5 h-5" />
              {t('switchTo')} {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
