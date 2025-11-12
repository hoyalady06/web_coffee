'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'ru' | 'kk';

type TranslationKeys = keyof typeof translations['ru'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}
const translations = {
  ru: {
    menu: 'Меню',
    about: 'О нас',
    contacts: 'Контакты',
    franchise: 'Франчайзинг',
    chooseCity: 'Выберите город',
    footerInfo: 'Все права защищены © 2025',

    // ↓ добавили
    career: 'Карьера',
    certificate: 'Сертификат',
    userAgreement: 'Пользовательское соглашение',
    legalInfo: 'Правовая информация',
  },
  kk: {
    menu: 'Мәзір',
    about: 'Біз туралы',
    contacts: 'Байланыс',
    franchise: 'Франчайзинг',
    chooseCity: 'Қаланы таңдаңыз',
    footerInfo: 'Барлық құқықтар қорғалған © 2025',

    // ↓ добавили
    career: 'Мансап',
    certificate: 'Сертификат',
    userAgreement: 'Пайдаланушы келісімі',
    legalInfo: 'Құқықтық ақпарат',
  },
} as const; // ← важно!

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: TranslationKeys): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
