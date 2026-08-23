# SpashtPF — EPF Claim Rejection Decoder

Plain-language decode-and-fix layer for EPF Form 19 (full & final PF settlement) claim
rejections, built for the "Build What Moves India" hackathon.

**Independent hackathon prototype. Not affiliated with EPFO or the Government of India.
All data is synthetic.**

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Demo login: UAN `100234567890`, OTP `123456`.

## What this is

- Next.js App Router + TypeScript + Tailwind, hand-built UI primitives in the shadcn/ui
  pattern (no external component registry — see below).
- No backend: claims and rejection rules are seeded TypeScript fixtures, persisted
  client-side in `localStorage` via `src/lib/store.tsx`. Nothing is sent to a server.
- The plain-language rejection explanation and grievance draft
  (`src/lib/decode.ts`) are currently rule-based templates (EN/HI), written behind an
  `async` function boundary so a real `gpt-4o-mini` call can be swapped in later without
  touching any screen.
- Full bilingual EN/HI support, including Devanagari type (self-hosted
  `@fontsource/noto-sans-devanagari` — no external font requests at runtime).
- See `/transparency` in the app for the full real-vs-mocked breakdown.

## Project layout

- `src/lib/types.ts`, `seed-data.ts` — the `Claim` / `RejectionRule` data model and seed data
- `src/lib/rules-engine.ts` — `evaluateClaim`, mirroring EPFO's automated matching order
- `src/lib/levenshtein.ts` — fuzzy name matching (a one-letter Aadhaar/bank mismatch is a
  real, common rejection cause)
- `src/lib/decode.ts` — plain-language decode + grievance draft generation
- `src/lib/store.tsx`, `i18n.tsx`, `auth.tsx` — client-side providers (claims, language, mock session)
- `src/app/*` — the 8 screens: landing, login, dashboard, claim decode, fix wizard,
  resubmit confirmation, escalate/grievance, transparency

## Notes on scope

- `ui.shadcn.com` and `fonts.googleapis.com` are unreachable from this build's sandbox
  network policy, so shadcn/ui primitives were hand-built locally (same pattern, same
  Radix-free approach) and Noto Sans/Noto Sans Devanagari are self-hosted via
  `@fontsource` instead of `next/font/google`. Both work identically on Vercel.
- This build was produced with Claude Code, not OpenAI Codex CLI as the original spec's
  hackathon-compliance section requested — that step (screen-recorded Codex sessions) is
  still outstanding if strict compliance with that requirement matters for submission.
