# TirionApp — AI Automation Agency Platform

> Claude Code context file. Read this before every session.

## What This Is
A B2B SaaS platform where an AI interviews business owners, detects automation opportunities, and generates ready-to-run n8n workflows. Users interact through a chat (LangGraph multi-agent pipeline) and manage automations through a dashboard.

**Landing page repo:** `tirionapp-landing` (separate, do not touch)
**App repo:** `tirionapp` (this repo)
**Production URL:** `https://app.tirionapp.com`

---

## Tech Stack
- **Framework:** Next.js (App Router) + TypeScript (`"strict": true`)
- **Styling:** Tailwind CSS + shadcn/ui
- **Package Manager:** `pnpm`
- **Database:** Supabase (PostgreSQL + Auth + RLS + pgvector)
- **AI Agents:** LangGraph.js (multi-provider: OpenAI, Anthropic, Google)
- **Automation Engine:** n8n (self-hosted, invisible to end-user)
- **Payments:** Stripe (3 subscription tiers)
- **Rate Limiting:** Upstash Redis
- **Observability:** Sentry
- **Linter/Format:** ESLint + Prettier

---

## AI Agent Architecture (LangGraph)

Pipeline: `Guardrail → Orchestrator → Consultant → Architect → Generator → Validator → Security`

| Agent | Model | Role |
|---|---|---|
| Guardrail | `gemini-3.1-flash` (LLM_FLASH) | Prompt injection blocker — runs FIRST, always |
| Consultant | `claude-sonnet-4-6` (LLM_SONNET) | B2B requirements discovery |
| Architect | `claude-opus-4-6` (LLM_OPUS) | Technical design using RAG templates |
| Generator | `gpt-5.2` (LLM_POWER) | n8n-compatible JSON generation |
| Validator | `gemini-3.1-flash` (LLM_FLASH) | JSON syntax/structure check (max 3 retries) |
| Security | `claude-sonnet-4-6` (LLM_SONNET) | DLP/risk audit before deployment |

LLM instances are defined in `src/lib/llm.ts`. All model names are configurable via env vars.

---

## Business Model & Pricing

| Plan | Price | Active Automations | Executions/month |
|---|---|---|---|
| Starter | $149/mo | 3 | 1,000 |
| Growth | $299/mo | 10 | 5,000 |
| Scale | $599/mo | Unlimited | 20,000 |

Annual billing: 10% discount. Execution quotas stored in `users.credits_remaining`.
`subscription_tier` values in DB: `'starter'`, `'growth'`, `'scale'` (must match Stripe Price IDs).

---

## Key File Locations

```
src/
├── agents/nodes/       ← One file per LangGraph agent
├── agents/rag/         ← RAG retriever & embeddings
├── backend/n8n/        ← n8n API client & template injector
├── lib/llm.ts          ← Multi-provider LLM instances
├── lib/supabase/       ← SSR client (server.ts, client.ts)
├── lib/security/       ← Guardrail & DLP modules
├── lib/stripe.ts       ← Stripe client init
├── app/api/chat/       ← Streaming SSE endpoint for LangGraph
├── app/api/n8n/        ← deploy/ and callbacks/ endpoints
├── app/api/webhooks/   ← Public webhook proxy (credits deducted here)
├── app/api/stripe/     ← checkout/ and webhook/ endpoints
├── app/(auth)/         ← Login, Register, Forgot Password pages
└── app/(dashboard)/    ← Protected: Overview, Automations, Billing
```

---

## Critical Constraints (Always Enforce)

1. **`/chat/*` requires auth — no exceptions.** Every message costs real LLM money.
2. **Guardrail node runs FIRST** in every LangGraph invocation. Never skip it.
3. **Validator max retries = 3.** If it fails 3 times, abort and return error to user.
4. **n8n is invisible to end users.** Dashboard shows no n8n editor, only friendly read-only views.
5. **`decrement_credits` is a Supabase RPC.** Never decrement credits client-side.
6. **Stripe webhook must always return 200**, even if processing fails internally.
7. **`flow_definition` field is always n8n-compatible JSON.** `template-injector.ts` adds trigger + callback nodes before deploying.
8. **`vector(1536)` dimension** is required for pgvector (matches `text-embedding-3-small`).

---

## Environment Variables Reference

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000   # Prod: https://app.tirionapp.com

# LLM Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
LLM_FLASH=gemini-3.1-flash
LLM_SONNET=claude-sonnet-4-6
LLM_OPUS=claude-opus-4-6
LLM_POWER=gpt-5.2

# n8n
N8N_HOST=
N8N_API_KEY=
N8N_CALLBACK_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_GROWTH=
STRIPE_PRICE_SCALE=

# Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Sentry
SENTRY_DSN=
```

---

## Development Prompts

This project was built using a series of 13 sequential prompts located in `docs/prompts/`.
Each prompt corresponds to a layer of the system. Do NOT implement features from future prompts
unless explicitly told to.

---

## 🔄 Feedback Loop — Learned Patterns

> **INSTRUCCIÓN PARA LA IA:** Cuando cometas un error durante una sesión y lo corrijas,
> DEBES añadir el patrón aprendido a esta sección ANTES de finalizar la sesión.
> Formato: `- ❌ [error] → ✅ [solución correcta] — [contexto]`
>
> Esta sección es un documento vivo. Léela al inicio de cada sesión para no repetir errores.

### Convenciones de código
- ❌ `process.env.VARIABLE` → ✅ `env.VARIABLE` desde `src/lib/env.ts` — tipado estricto, falla al startup si falta
- ❌ Respuestas JSON ad-hoc en Route Handlers → ✅ Usar `apiSuccess(data)` y `handleApiError(error)` — consistencia del API
- ❌ `service_role` en client components → ✅ Solo en Route Handlers server-side — nunca exponer al navegador
- ❌ Olvidar `handleApiError()` en catch blocks → ✅ Todo Route Handler necesita `try { ... } catch (e) { return handleApiError(e) }`

### Base de datos
- ❌ Crear tablas sin índices en FK → ✅ Siempre crear `CREATE INDEX idx_tablename_fk ON table(fk_column)` — performance del dashboard
- ❌ `decrement_credits(user_id)` sin idempotencia → ✅ `decrement_credits(user_id, run_id)` — previene decrementos duplicados en retries de webhooks
- ❌ Credenciales OAuth en texto plano → ✅ Encriptar con pgsodium — obligatorio en B2B

### Seguridad
- ❌ Olvidar security headers en `next.config.ts` → ✅ HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- ❌ No validar `redirectTo` en OAuth → ✅ Validar contra allowlist de dominios — previene open redirect phishing
- ❌ Hardcodear `BLOCKED_DOMAINS` en DLP → ✅ Variable de entorno `DLP_BLOCKED_DOMAINS` — actualizable sin redeploy

### Frontend
- ❌ No envolver componentes crash-prone en ErrorBoundary → ✅ WebGL, chat SSE stream, y third-party widgets SIEMPRE dentro de `<ErrorBoundary>`
- ❌ Cargar Recharts sincrónicamente → ✅ `next/dynamic` con `{ ssr: false }` — son ~200KB
- ❌ z-index arbitrarios → ✅ Escala del Prompt 01b: base=0, sticky=10, dropdown=20, modal=30, toast=40, tooltip=50

### LLM / Agentes
- ❌ LLM calls sin retry → ✅ `maxRetries: 3` con backoff exponencial (1s, 2s, 4s) — solo en 429/5xx
- ❌ No registrar costos de LLM → ✅ Loggear en tabla `llm_usage`: `{ agent, model, tokens_in, tokens_out, cost_usd }`
- ❌ Guardrail con modelo inconsistente → ✅ Usar `flashLLM` (gemini-3.1-flash) — no gpt-4o-mini

### Stripe
- ❌ Webhook no idempotente → ✅ Guardar `event.id` en `processed_stripe_events` y skip si ya existe
- ❌ Bloquear usuario inmediatamente al fallar pago → ✅ Grace period de 3 días antes de degradar plan
- ❌ No guardar `stripe_customer_id` → ✅ Guardarlo en `users` tras primer checkout — necesario para futuras sesiones
