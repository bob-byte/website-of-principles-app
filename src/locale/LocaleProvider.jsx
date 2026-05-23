import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations";

const LocaleContext = createContext(null);

const LOCALE_STORAGE_KEY = "principles-locale";
const THEME_STORAGE_KEY = "principles-theme";
const SUPPORTED_THEMES = ["dark-orange", "dark-blue", "light-orange", "light-blue"];

function readStoredLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "en" || saved === "uk") return saved;
  } catch {
    /* ignore */
  }
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("uk")) {
    return "uk";
  }
  return "en";
}

function readStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (SUPPORTED_THEMES.includes(saved)) return saved;
  } catch {
    /* ignore */
  }
  return "dark-orange";
}

function getTranslationByKey(object, key) {
  return key.split(".").reduce((acc, part) => (acc == null ? acc : acc[part]), object);
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(readStoredLocale);
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.lang = locale === "uk" ? "uk" : "en";
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setLocale = (next) => {
    if (next === "en" || next === "uk") setLocaleState(next);
  };

  const setTheme = (next) => {
    if (SUPPORTED_THEMES.includes(next)) setThemeState(next);
  };

  const value = useMemo(() => {
    const dictionary = translations[locale];
    return {
      locale,
      theme,
      setLocale,
      setTheme,
      translate: (key) => {
        const value = getTranslationByKey(dictionary, key);
        return typeof value === "string" ? value : key;
      },
      benefitsItems: dictionary.benefits.items,
      stepsItems: dictionary.steps.items,
      reviewsItems: dictionary.reviews.items,
    };
  }, [locale, theme]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useTranslation must be used within LocaleProvider");
  }
  return context;
}
