"use client";

import * as React from "react";

export type Lang = "en" | "hi";

const STORAGE_KEY = "spashtpf_lang";

const LanguageContext = React.createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en");

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe read from localStorage on mount
      if (stored === "en" || stored === "hi") setLangState(stored);
    } catch {
      // localStorage unavailable — stay on default language
    }
  }, []);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — language choice just won't persist
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

/** Pick the copy for the active language from a { en, hi } pair. */
export function pick<T>(lang: Lang, copy: { en: T; hi: T }): T {
  return copy[lang];
}
