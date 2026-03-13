'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    // Here you would implement actual language switching logic
    // For now, we'll just store it in localStorage
    localStorage.setItem('preferred-language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label="Toggle language"
    >
      <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {language === 'en' ? 'हिं' : 'EN'}
      </span>
    </button>
  );
}