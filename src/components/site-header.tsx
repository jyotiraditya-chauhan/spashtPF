"use client";

import Link from "next/link";
import { useLanguage, pick } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const copy = {
  en: { dashboard: "Dashboard", transparency: "Transparency", logout: "Log out" },
  hi: { dashboard: "डैशबोर्ड", transparency: "पारदर्शिता", logout: "लॉग आउट" },
};

export function SiteHeader() {
  const { lang, setLang } = useLanguage();
  const { uan, logout } = useAuth();
  const t = pick(lang, copy);

  return (
    <header className="w-full border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">SpashtPF</span>
          <span className="hidden text-xs text-muted sm:inline">स्पष्ट</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          {uan && (
            <Link href="/dashboard" className="min-h-11 flex items-center text-foreground hover:text-primary">
              {t.dashboard}
            </Link>
          )}
          <Link href="/transparency" className="min-h-11 flex items-center text-foreground hover:text-primary">
            {t.transparency}
          </Link>

          <div className="flex overflow-hidden rounded-md border border-border" role="group" aria-label="Language">
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`min-h-11 px-3 text-sm font-semibold ${
                lang === "en" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              aria-pressed={lang === "hi"}
              className={`min-h-11 px-3 text-sm font-semibold ${
                lang === "hi" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              हिं
            </button>
          </div>

          {uan && (
            <button type="button" onClick={logout} className="min-h-11 px-1 text-sm text-muted hover:text-error">
              {t.logout}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
