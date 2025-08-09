import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${language === 'ro' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('ro')}
        title="Română"
      >
        🇷🇴 RO
      </button>
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en')}
        title="English"
      >
        🇬🇧 EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
