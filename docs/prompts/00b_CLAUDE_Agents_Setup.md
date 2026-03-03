# Prompt 00b: Configuración de CLAUDE.md y Agents/Skills

**Objetivo:** Antes de escribir una sola línea de código de producto, configurar el archivo `CLAUDE.md`, definir los agents y skills que la IA de desarrollo usará durante TODOS los prompts siguientes. Esto multiplica la calidad y consistencia del output.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es un **paso previo** a los prompts 01-11. Solo configura la infraestructura de desarrollo con IA. NO implementa código de producto, base de datos, ni UI.

---

## 1. Contexto

El repositorio `everything-claude-code` demuestra que invertir tiempo en configurar las reglas, agents y skills ANTES de desarrollar produce código más consistente, seguro y testeable. Este prompt establece esa base.

## 2. Entregables Esperados

### `CLAUDE.md` (Raíz del proyecto)
Archivo de reglas que la IA leerá al inicio de cada sesión:

```markdown
# TirionApp — Core Application

## Tech Stack
- Next.js 15 App Router (TypeScript)
- Supabase (PostgreSQL + Auth + RLS + pgvector)
- LangGraph.js (Multi-agent pipeline)
- n8n (Workflow engine, invisible al usuario)
- Stripe (Pagos y suscripciones)
- Tailwind CSS + shadcn/ui
- Geist Sans (tipografía)

## Key Conventions
- Use `env.VARIABLE` (from `src/lib/env.ts`) instead of `process.env.VARIABLE`
- All API success responses: `apiSuccess(data)` from `src/lib/api/response.ts`
- All API error handling: `handleApiError(error)` from `src/lib/api/errors.ts`
- Throw `ApiError(statusCode, code, message)` for domain errors
- Use `service_role` ONLY in Route Handlers, NEVER in client components
- All interactive components need keyboard navigation + ARIA attributes

## File Locations
- Agents: `src/agents/nodes/*.ts`
- Agent prompts: `src/agents/prompts/*.md`
- API routes: `src/app/api/**/*.ts`
- Backend services: `src/backend/services/*.ts`
- n8n Integration: `src/backend/n8n/*.ts`
- Security: `src/lib/security/*.ts`
- Frontend components: `src/components/**/*.tsx`
- Dashboard pages: `src/app/(dashboard)/**/*.tsx`

## Database
- Always create indices for FK columns
- RLS enabled on ALL tables
- `decrement_credits()` is idempotent (takes run_id)

## Security
- Guardrail agent runs BEFORE any other agent
- DLP scans flow_definition before sending to n8n
- Rate limiting: 100 msg/day chat, 300 req/min webhooks
- N8N_CALLBACK_SECRET validated on all callbacks
```

### `.agents/planner.md`

```markdown
---
description: Creates detailed implementation plans for TirionApp features
---

## Role
You are a senior software architect planning features for a B2B SaaS platform.

## Rules
1. Always check which prompt (01-11) the feature relates to
2. Reference existing utilities: `ApiError`, `apiSuccess`, `env`
3. Consider security implications (Guardrail, DLP, RLS)
4. Include testing strategy in every plan
5. Respect z-index scale from Prompt 01b
```

### `.agents/reviewer.md`

```markdown
---
description: Reviews code for TirionApp quality, security, and consistency
---

## Checklist
- [ ] Uses `env.VARIABLE` instead of `process.env.VARIABLE`
- [ ] API routes use `apiSuccess()` and `handleApiError()`
- [ ] No `service_role` in client components
- [ ] All tables have RLS enabled
- [ ] Zod validation on all endpoint inputs
- [ ] Error Boundary around crash-prone components
- [ ] Keyboard navigation on interactive elements
- [ ] Rate limiting on public endpoints
```

### `skills/supabase-rls.md`

```markdown
---
description: Patterns for Supabase Row Level Security policies
---

## Standard RLS Pattern
All SELECT/UPDATE/DELETE policies MUST use:
\`\`\`sql
CREATE POLICY "Users can only access own data" ON table_name
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = table_name.project_id
      AND projects.user_id = auth.uid()
    )
  );
\`\`\`
```

## 3. Instrucciones Paso a Paso

1. **Crear `CLAUDE.md`** en la raíz del proyecto con la configuración mostrada arriba.
2. **Crear directorio `.agents/`** con `planner.md` y `reviewer.md`.
3. **Crear directorio `skills/`** con `supabase-rls.md`.
4. **Verificar** que `CLAUDE.md` es leído al inicio de la sesión.

## Testing Strategy
- Verificar que `CLAUDE.md` existe y contiene las convenciones clave.
- Verificar que `.agents/` contiene al menos `planner.md` y `reviewer.md`.
- Verificar que `skills/supabase-rls.md` documenta el patrón RLS estándar.
