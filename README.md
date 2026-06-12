# OpenRouterai

A Next.js 15 (App Router) recreation of an OpenRouter-style AI model gateway — same information architecture, original copy and design (Cleverfox editorial language: Instrument Serif / Inter / JetBrains Mono, stone palette, orange reserved for revenue-critical actions). All usage figures and pricing are illustrative mock data.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verified: 17 static routes
```

## Routes (15 requested + landing)

| Route | Notes |
|---|---|
| `/` | Landing + trending models |
| `/models` | Catalog — search, provider filter, sort |
| `/rankings` | Token leaderboard with trend deltas |
| `/apps` | Top apps grid |
| `/enterprise` | Enterprise marketing page |
| `/pricing` | Fee model + live rate table |
| `/docs/quickstart` | curl / TS / Python samples |
| `/workspaces` | Auth-gated overview (mock Google sign-in) |
| `/workspaces/default/keys` | Create / disable / delete keys, reveal-once flow |
| `/workspaces/default/settings` | Name, budget, members, danger zone |
| `/settings/profile` | Display name, org, delete account |
| `/settings/credits` | Balance, top-up with fee calc, history |
| `/settings/privacy` | Logging / training / retention toggles |
| `/settings/preferences` | Default model, routing strategy, fallbacks |
| `/activity` | 30-day spend / requests / tokens bar chart (pure CSS) |
| `/logs` | Filterable per-request table |

## Architecture

- `app/(console)/layout.tsx` — auth gate + sidebar shared by all signed-in pages
- `lib/auth.tsx` — mock Google auth (localStorage-persisted); swap for NextAuth + Google provider when going live
- `lib/data.ts` — single mock data layer; swap for real API/DB calls
- `app/globals.css` — Cleverfox token set, dark/light via `data-theme`, theme toggle in header
- Zero chart/UI libraries — only `lucide-react` beyond Next/React

## Going live checklist

1. Replace `lib/auth.tsx` with NextAuth (Google provider)
2. Replace `lib/data.ts` exports with route handlers / DB queries
3. Wire `/api/v1/chat/completions` proxy route
4. Stripe for `/settings/credits`
