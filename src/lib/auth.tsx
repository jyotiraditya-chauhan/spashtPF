"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export const DEMO_UAN = "100234567890";
export const DEMO_OTP = "123456";

const STORAGE_KEY = "spashtpf_session_uan";

interface AuthContextValue {
  uan: string | null;
  checked: boolean;
  login: (uan: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [uan, setUan] = React.useState<string | null>(null);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe read from localStorage on mount
      setUan(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      // localStorage unavailable — treat as logged out
    }
    setChecked(true);
  }, []);

  const login = React.useCallback((nextUan: string) => {
    setUan(nextUan);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextUan);
    } catch {
      // localStorage unavailable — session just won't persist across reloads
    }
  }, []);

  const logout = React.useCallback(() => {
    setUan(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable — nothing to clear
    }
  }, []);

  return (
    <AuthContext.Provider value={{ uan, checked, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/** Wrap a protected page's content; redirects to /login once we've confirmed there's no session. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { uan, checked } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (checked && !uan) router.replace("/login");
  }, [checked, uan, router]);

  if (!checked || !uan) return null;
  return <>{children}</>;
}
