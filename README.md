# OpenRouterai

An OpenRouter-style AI model gateway — landing, model catalog, leaderboard,
console (keys, activity, logs, billing). The chat-completions endpoint is a
**real proxy** that forwards to `openrouter.ai` using a server-side
`OPENROUTER_API_KEY`, so the `/docs/quickstart` examples work out of the box.

- **Live**: https://openrouterai.vercel.app
- **Repo**: https://github.com/flexappdev/openrouterai
- **Local port**: `16013`
- **Stack**: Next.js 15 (App Router) · React 19 · Tailwind 4 · lucide-react
- **Auth**: Supabase single-user gate to `ADMIN_EMAIL` (default `mat@matsiems.com`)
- **Logs**: MongoDB `OPENROUTERAI.request_logs` (soft-fail — never blocks)
- **Accent**: `#006699` (siems blue)

Part of the flexappdev fleet — see `~/APPS/REPOS.md` for sibling sites.

---

## Run locally

```bash
cp .env.local.example .env.local   # fill in env vars (see table below)
npm install
npm run dev                         # → http://localhost:16013
npm run build
npm run typecheck
```

## Routes

| Surface | Route | Auth |
|---|---|---|
| Landing | `/` | public |
| Model catalog | `/models` | public |
| Token leaderboard | `/rankings` | public |
| Top apps | `/apps` | public |
| Enterprise | `/enterprise` | public |
| Pricing | `/pricing` | public |
| Quickstart docs | `/docs/quickstart` | public |
| Sign-in | `/login` | public |
| Auth callback | `/auth/callback` | public |
| Models passthrough | `GET /api/v1/models` | public |
| **Chat proxy** | `POST /api/v1/chat/completions` | public (proxied) |
| Workspaces | `/workspaces` | gated |
| API keys | `/workspaces/default/keys` | gated |
| Workspace settings | `/workspaces/default/settings` | gated |
| Profile / Credits / Privacy / Preferences | `/settings/*` | gated |
| Activity | `/activity` | gated |
| Logs | `/logs` | gated |
| Recent logs (Mongo) | `GET /api/logs` | gated |

Gated paths redirect signed-out users to `/login?next=<path>`. Sessions with
an email other than `ADMIN_EMAIL` are signed out and bounced back to `/login`
with `?error=not_allowlisted`.

### Sign-in flows

Two paths, both gated by the `ADMIN_EMAIL` allowlist at `/auth/callback`:

1. **Magic link (primary)** — enter `mat@matsiems.com` on `/login`, click
   *Send magic link*. Supabase emails a one-hour OTP link →
   `/auth/callback?token_hash=…&type=magiclink` → `verifyOtp` →
   allowlist check → redirect to `next`.
2. **Google OAuth (secondary)** — *Continue with Google* button →
   Supabase OAuth → `/auth/callback?code=…` → `exchangeCodeForSession` →
   allowlist check → redirect to `next`.

`shouldCreateUser: false` on the OTP call — never auto-creates accounts.

## API — chat completions

OpenAI-compatible. Point any OpenAI SDK at `https://openrouterai.vercel.app/api/v1`:

```bash
curl https://openrouterai.vercel.app/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{ "role": "user", "content": "Hello!" }]
  }'
```

Streaming (`"stream": true`) is forwarded as SSE.
Browse `GET /api/v1/models` for the live model list (337 entries at last sync,
cached 5 minutes).

If the request body omits `model`, the proxy falls back to `OPENROUTER_MODEL`.
OpenRouter attribution headers (`HTTP-Referer`, `X-Title`) are added server-side.

## Env vars

Source values from `~/context-2026/agents/.env` (the central agents env file).

| Var | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | console | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | console | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | reserved | Service role (admin-only tasks) |
| `ADMIN_EMAIL` | console | Allowlisted email (default `mat@matsiems.com`) |
| `OPENROUTER_API_KEY` | proxy | Server-side OpenRouter key |
| `OPENROUTER_MODEL` | proxy | Default model slug |
| `MONGODB_URI` | logs + keys | Atlas connection string |
| `MONGODB_DB` | logs + keys | Defaults to `OPENROUTERAI` |
| `NEXT_PUBLIC_GA_ID` | optional | GA4 measurement id (e.g. `G-GTVT9WMTZW`) |
| `STRIPE_SECRET_KEY` | billing | `sk_live_...` or `sk_test_...` — enables `/api/billing/checkout` |
| `STRIPE_WEBHOOK_SECRET` | billing | `whsec_...` — verifies signed events on `/api/billing/webhook` |
| `NEXT_PUBLIC_APP_URL` | optional | Used as origin for OpenRouter attribution + Stripe redirects |

Sync to Vercel: `vercel env add <KEY> production` (or `/abc-vercel`).

## Architecture

- `middleware.ts` — single-user gate, env-guarded. Empty Supabase envs never
  500 the public surface; protected paths redirect to `/login?error=unconfigured`.
- `lib/supabase/{client,server,middleware}.ts` — SSR cookie-based wrapper.
- `lib/auth.tsx` — `useAuth()` hook backed by real Supabase session.
- `app/api/v1/chat/completions/route.ts` — Node runtime, streams SSE,
  logs `{ key_hash, model, status, latency_ms, tokens }` to Mongo (soft-fail).
- `app/api/v1/models/route.ts` — 5-min cached passthrough.
- `lib/mongo.ts` — singleton client with 3s server-selection timeout and
  try/catch around every write/read.
- `lib/analytics.ts` + `components/Analytics.tsx` — GA4 (gated on `NEXT_PUBLIC_GA_ID`).

## Deploy

Bound to Vercel team `matsiems` (`team_xW8X8CreHT9RkB9uuyZD5GcR`) — never to
`cleverfox-ai`. Project id `prj_xs9R7edAiBkRhYrXnd9f7kGDiKrW`.

```bash
vercel --prod              # promote
vercel env ls production   # inspect env
```

## API surface (additions in v1.1)

- `GET /api/v1/keys` — list keys for the signed-in user
- `POST /api/v1/keys` — `{ name, limit_usd? }` → returns full key once, persists
  SHA-256 hash + prefix/suffix to MongoDB `api_keys`
- `PATCH /api/v1/keys/:id` — `{ disabled?, name?, limit_usd? }`
- `DELETE /api/v1/keys/:id`
- `POST /api/billing/checkout` — `{ amount_usd }` → Stripe Checkout session URL
  (returns 503 if `STRIPE_SECRET_KEY` is missing)
- `POST /api/billing/webhook` — Stripe webhook (HMAC-verified, logs
  `checkout.session.completed` events to MongoDB `credit_history`)

## Active in v1.1

- ✅ **GA4** active — measurement id `G-GTVT9WMTZW` synced to Vercel.
- ✅ **Mongo-backed API keys** — `api_keys` collection; full key shown once on
  creation, SHA-256 hash stored.
- ✅ **Stripe checkout scaffold** — code path live; flips on the moment you set
  `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`. Webhook endpoint:
  `https://openrouterai.vercel.app/api/billing/webhook`.

## Still owed

- **Stripe activation** — add `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` in
  Vercel and register the webhook URL above in the Stripe dashboard.
- **Per-key spend tracking** — `spend_mtd_usd` increments are a v2 PBI (currently
  fixed at 0 on every new key; chat-proxy doesn't yet attribute usage by key).
- **Custom domain** — stays on `*.vercel.app` until you pick a domain. To wire
  one: `vercel domains add <name>` then update `NEXT_PUBLIC_APP_URL`.

## License

Private — flexappdev fleet.
