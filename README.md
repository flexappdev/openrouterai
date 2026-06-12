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
| `MONGODB_URI` | logs | Atlas connection string |
| `MONGODB_DB` | logs | Defaults to `OPENROUTERAI` |
| `NEXT_PUBLIC_GA_ID` | optional | GA4 measurement id (leave empty until ready) |

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

## Not yet wired

- **GA4** is code-ready but `NEXT_PUBLIC_GA_ID` is blank — activate with
  `/abc-ga sync openrouterai G-XXXX` when a measurement id exists.
- **Stripe** for `/settings/credits` — page stays mock until billing is in scope.
- **Per-key spend tracking** — keys live in client state until Mongo-backed
  CRUD ships (v2 PBI).
- **Custom domain** — stays on `*.vercel.app` until requested.

## License

Private — flexappdev fleet.
