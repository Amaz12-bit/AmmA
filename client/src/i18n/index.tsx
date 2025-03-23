import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import en from "./locales/en";
import sw from "./locales/sw";

export type Language = "en" | "sw";

export interface Translations {
  [key: string]: string | Translations;
}

interface I18nContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}

export const I18nContext = createContext<I18nContextType>({
  language: "en",
  t: (key: string) => key,
  changeLanguage: () => {},
});

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

export const I18nProvider = ({ children, initialLanguage = "en" }: I18nProviderProps) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const translations = { en, sw };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "sw")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        let fallbackValue = translations.en;
        for (const fallbackKey of keys) {
          if (fallbackValue && typeof fallbackValue === "object" && fallbackKey in fallbackValue) {
            fallbackValue = fallbackValue[fallbackKey];
          } else {
            return key; // Key not found even in fallback
          }
        }
        return typeof fallbackValue === "string" ? fallbackValue : key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
};