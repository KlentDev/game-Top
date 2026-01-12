import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'fil';
type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'PHP';

interface LanguageCurrencyContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
}

const LanguageCurrencyContext = createContext<LanguageCurrencyContextType | undefined>(undefined);

export function LanguageCurrencyProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <LanguageCurrencyContext.Provider value={{ language, currency, setLanguage, setCurrency }}>
      {children}
    </LanguageCurrencyContext.Provider>
  );
}

export function useLanguageCurrency() {
  const context = useContext(LanguageCurrencyContext);
  if (!context) throw new Error('useLanguageCurrency must be used within LanguageCurrencyProvider');
  return context;
}
