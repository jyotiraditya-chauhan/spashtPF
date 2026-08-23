"use client";

import * as React from "react";
import type { Claim } from "./types";
import { seedClaims } from "./seed-data";
import { evaluateClaim } from "./rules-engine";

const STORAGE_KEY = "spashtpf_claims";

interface ClaimsContextValue {
  claims: Claim[];
  loaded: boolean;
  getClaim: (id: string) => Claim | undefined;
  resubmitClaim: (id: string, correction: Partial<Claim>) => Claim | undefined;
  resetDemoData: () => void;
}

const ClaimsContext = React.createContext<ClaimsContextValue | null>(null);

function loadClaims(): Claim[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Claim[];
  } catch {
    // fall through to reseed
  }
  const seeded = structuredClone(seedClaims);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch {
    // localStorage unavailable — claims just won't persist across reloads
  }
  return seeded;
}

export function ClaimsProvider({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = React.useState<Claim[]>(seedClaims);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe read from localStorage on mount
    setClaims(loadClaims());
    setLoaded(true);
  }, []);

  const persist = React.useCallback((next: Claim[]) => {
    setClaims(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable — claims just won't persist across reloads
    }
  }, []);

  const getClaim = React.useCallback((id: string) => claims.find((c) => c.id === id), [claims]);

  const resubmitClaim = React.useCallback(
    (id: string, correction: Partial<Claim>) => {
      let updated: Claim | undefined;
      const next = claims.map((c) => {
        if (c.id !== id) return c;
        const merged = { ...c, ...correction };
        const rejectionCode = evaluateClaim(merged);
        updated = {
          ...merged,
          rejectionCode,
          status: rejectionCode ? "Rejected" : "Under Process",
          filedOn: new Date().toISOString().slice(0, 10),
        };
        return updated;
      });
      persist(next);
      return updated;
    },
    [claims, persist],
  );

  const resetDemoData = React.useCallback(() => {
    persist(structuredClone(seedClaims));
  }, [persist]);

  return (
    <ClaimsContext.Provider value={{ claims, loaded, getClaim, resubmitClaim, resetDemoData }}>
      {children}
    </ClaimsContext.Provider>
  );
}

export function useClaims() {
  const ctx = React.useContext(ClaimsContext);
  if (!ctx) throw new Error("useClaims must be used within a ClaimsProvider");
  return ctx;
}
