# AGENTS.md — openrouterai

Guidance for AI coding agents working in this repo.

## What this is

`openrouterai` is the **26th site** in the ~/APPS fleet (flexappdev/openrouterai).
An OpenRouter-style AI model gateway — landing + model catalog + console (keys,
activity, logs, billing) — with a **real** chat-completions proxy that forwards
to `openrouter.ai` using a server-side `OPENROUTER_API_KEY`.

- Stack: Next.js 15 (App Router) + React 19 + Tailwind 4 + lucide-react
- Auth: Supabase single-user gate to `mat@matsiems.com` (env-guarded middleware)
- Logs: MongoDB `OPENROUTERAI.request_logs` (soft-fail — never blocks responses)
- Local port: **16013**
- Prod: `https://openrouterai*.vercel.app` (matsiems Vercel scope)
- Accent: `#006699` (siems blue)

## Commands

```bash
npm install
npm run dev        # http://localhost:16013
npm run build      # static + dynamic routes
npm run lint
npm run typecheck
```

## Routes

Public (no auth):
- `/`, `/models`, `/rankings`, `/apps`, `/enterprise`, `/pricing`,
  `/docs/quickstart`
- `/login`, `/auth/callback`
- `/api/v1/models` (cached passthrough)

Auth-gated (middleware redirects to `/login` if no session, signs out + bounces
if email ≠ `ADMIN_EMAIL`):
- `/workspaces`, `/workspaces/default/{keys,settings}`
- `/settings/{profile,credits,privacy,preferences}`
- `/activity`, `/logs`
- `/api/v1/chat/completions` (used through user keys; gate via middleware)

## Env vars

Sync with `/abc-supabase`, `/abc-vercel`, `/abc-github`. Sourced from
`~/context-2026/agents/.env`.

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (reserved for admin tasks) |
| `ADMIN_EMAIL` | Allowlisted email (default `mat@matsiems.com`) |
| `OPENROUTER_API_KEY` | Server-side key used by the chat proxy |
| `OPENROUTER_MODEL` | Default model slug if request body omits one |
| `MONGODB_URI` | Atlas connection (soft-fail) |
| `MONGODB_DB` | Defaults to `OPENROUTERAI` |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement id (leave empty until /abc-ga sync) |

## Routing rules for agents

- Edits scoped to this site (landing copy, console pages, proxy) belong here.
- Cockpit edits (apps-registry.json, /sites CMS, /health grid) belong in
  `~/APPS/appai/`.
- Always cd to `~/APPS/openrouterai` before running build / push / deploy.
- Never copy yb100's `styles.css` wholesale into this repo (per
  `feedback_yb100_css_coupling`) — keep the original prototype's CSS tokens.

## Skills to use

- `/abc-vercel` — deploy + env sync (matsiems scope, NEVER cleverfox-ai).
- `/abc-supabase` — env sync + middleware check.
- `/abc-github` — repo + Actions secrets.
- `/abc-mongo` — Atlas ping + collection counts.
- `/abc-ga` — when a real `G-XXXX` measurement id arrives.

## Do not

- Don't broaden the allowlist beyond `ADMIN_EMAIL`. Anonymous access to
  `/workspaces` is intentional 307 → `/login`.
- Don't switch `/api/v1/chat/completions` to Edge runtime — Mongo client
  needs Node.
- Don't break the env guard in `lib/supabase/middleware.ts` — empty Supabase
  envs must NEVER 500 the public surface.
- Don't add `:free` OpenRouter fallback models without a real fallback chain
  (see `~/CLAUDE.md` — `OR_FALLBACK_MODELS` rule).
