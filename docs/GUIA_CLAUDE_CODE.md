# 🗣️ Guía de Conversación con Claude Code para TirionApp

> Cómo ejecutar los 14 prompts correctamente, en qué orden, y qué decir en cada sesión.

---

## Antes de Empezar — Requisitos

### 1. Configurar el proyecto
```bash
git clone [repo-tirionapp]
cd tirionapp
pnpm install
```

### 2. Verificar que `CLAUDE.md` existe en la raíz
Claude Code lo lee automáticamente al inicio de cada sesión. Si no existe, el Prompt 00b lo creará.

### 3. Configurar `.env.local`
Tener las API keys listas (pueden estar vacías para prompts de frontend, pero Supabase y LLM keys son necesarias desde el Prompt 02).

---

## Reglas de Oro

| Regla | Por qué |
|---|---|
| **1 prompt = 1 sesión de Claude Code** | Evita que la IA se desvíe. Cada prompt tiene restricción de alcance. |
| **Siempre empieza con:** "Lee el CLAUDE.md y el prompt X" | Asegura que la IA tiene contexto completo. |
| **Verifica ANTES de pasar al siguiente** | Cada prompt tiene Testing Strategy. Úsala. |
| **Si Claude comete un error, pídele que lo añada a Learned Patterns** | Activa el feedback loop. |
| **No saltes prompts** | Son secuenciales. El 07 depende del 06, el 06 del 02, etc. |

---

## Flujo Completo — Prompt por Prompt

### Sesión 0: Setup de infraestructura IA

**Prompt:** `00b_CLAUDE_Agents_Setup.md`

**Qué decir a Claude Code:**
```
Lee docs/prompts/00b_CLAUDE_Agents_Setup.md y ejecútalo completamente.
Crea CLAUDE.md en la raíz, el directorio .agents/ con planner.md y 
reviewer.md, y el directorio skills/ con supabase-rls.md.
```

**Verificar antes de continuar:**
- [ ] `CLAUDE.md` existe y tiene las convenciones
- [ ] `.agents/planner.md` y `.agents/reviewer.md` existen
- [ ] `skills/supabase-rls.md` existe

---

### Sesión 1: Inicializar proyecto

**Prompt:** `01_Setup_Inicial.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/01_Setup_Inicial.md.
Inicializa el proyecto Next.js con la estructura de carpetas definida.
Incluye la validación de env vars con Zod (src/lib/env.ts), las 
utilidades de API (ApiError, apiSuccess), y los scripts typecheck/validate.
```

**Verificar:**
- [ ] `pnpm dev` arranca sin errores
- [ ] `pnpm typecheck` pasa
- [ ] Importar `env` falla si faltan variables

---

### Sesión 1b: Sistema de diseño

**Prompt:** `01b_Sistema_Diseño.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/01b_Sistema_Diseño.md.
Implementa el sistema de diseño completo: paleta de colores (dark/light), 
Geist font, ThemeProvider, ThemeToggle, y las utility classes 
(sr-only, transition-*, escala z-index).
```

**Verificar:**
- [ ] `body` fondo `#0a0a0a` en dark, `#ffffff` en light
- [ ] `ThemeToggle` funciona sin recarga
- [ ] Focus ring visible en ambos modos

---

### Sesión 2: Base de datos

**Prompt:** `02_Base_de_Datos.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/02_Base_de_Datos.md.
Crea la migración SQL con las 8 tablas (incluida llm_usage), los índices, 
RLS, triggers, y la función idempotente decrement_credits.
Genera los tipos TypeScript después.
```

**⚠️ Necesitas:** Supabase project creado + `SUPABASE_URL` y keys en `.env.local`

**Verificar:**
- [ ] `npx supabase db reset` sin errores
- [ ] RLS impide ver datos de otro usuario
- [ ] `decrement_credits` es idempotente con mismo `run_id`

---

### Sesión 3: Autenticación

**Prompt:** `03_Autenticacion.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/03_Autenticacion.md.
Implementa el auth completo: login, register (con política de contraseña 
fuerte), OAuth Google, middleware de protección, rate limiting del login 
(5 intentos/15min), y el manejo de email no confirmado.
```

**Verificar:**
- [ ] `/dashboard` redirige a `/login` sin sesión
- [ ] 6º intento de login devuelve 429
- [ ] Registro exige mayúscula + número + especial

---

### Sesión 4: Agentes LangGraph

**Prompt:** `04_Agentes_LangGraph.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/04_Agentes_LangGraph.md.
Implementa el pipeline LangGraph con los 6 agentes. Usa flashLLM 
para Guardrail (NO gpt-4o-mini). Configura retry con backoff en 
todas las instancias LLM. El system prompt del Guardrail debe estar 
en src/agents/prompts/guardrail.md (externalizable).
Implementa el cost tracker en src/lib/llm-tracker.ts.
```

**⚠️ Necesitas:** API keys de OpenAI, Anthropic y Google

**Verificar:**
- [ ] Guardrail bloquea "ignora tus instrucciones"
- [ ] Guardrail NO bloquea "quiero automatizar mis facturas"
- [ ] Script `src/agents/test.ts` completa sin errores
- [ ] `llm_usage` registra costos

---

### Sesión 5: Sistema RAG

**Prompt:** `05_Sistema_RAG.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/05_Sistema_RAG.md.
Implementa el RAG con pgvector: función SQL match_rag_templates, 
generador de embeddings con caché, retriever con métricas de relevancia, 
y actualiza el Architect con fallback explícito cuando RAG devuelve 0.
Ejecuta el seed script con las 3 plantillas concretas.
```

**Verificar:**
- [ ] `retrieveTemplates('automatizar emails')` retorna resultados
- [ ] Fallback funciona con 0 resultados (mensaje de advertencia)
- [ ] Seed script insertó 3 templates

---

### Sesión 5b: Definir templates n8n

**Prompt:** `05b_RAG_Seed_Data.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/05b_RAG_Seed_Data.md.
Actualiza tu base de conocimiento sobre cómo es la estructura JSON 
de un flujo de n8n válido (nodos, conexiones, type, position).
Revisa el script scripts/seed-rag.ts y asegúrate de que inserta 
exactamente los 3 JSON proporcionados en el campo flow_template.
```

**Verificar:**
- [ ] Los 3 registros en `rag_templates` contienen el JSON correcto de n8n.
- [ ] El script `seed-rag.ts` compila y se ejecuta sin errores.

---

### Sesión 6: Backend API

**Prompt:** `06_Backend_API.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/06_Backend_API.md.
Crea los 3 endpoints (deploy, webhook proxy, callbacks) usando el 
formato de respuesta estandarizado (apiSuccess/handleApiError).
Implementa el Service Layer (automation.service.ts, credit.service.ts).
El webhook proxy DEBE responder 200 antes de hacer forward a n8n.
```

**Verificar:**
- [ ] `/api/n8n/deploy` retorna 401 sin sesión
- [ ] `/api/webhooks/[id]` retorna 402 sin créditos
- [ ] Todos los endpoints usan `apiSuccess()` / `handleApiError()`

---

### Sesión 7: Integración n8n

**Prompt:** `07_Integracion_n8n.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/07_Integracion_n8n.md.
Implementa el cliente de n8n con circuit breaker (3 fallos → 60s abierto), 
el template-injector con validación Zod del JSON final, y el soft delete. 
Configura logging de todas las llamadas a la API de n8n.
```

**⚠️ Necesitas:** n8n corriendo en Docker (`docker compose up`)

**Verificar:**
- [ ] `template-injector` añade webhook al inicio y callback al final
- [ ] Circuit breaker se abre tras 3 fallos
- [ ] JSON pasa validación Zod antes de enviarse

---

### Sesión 8: Chat de onboarding

**Prompt:** `08_Frontend_Entrevista.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/08_Frontend_Entrevista.md.
Crea el ChatWindow con ErrorBoundary, virtualización de mensajes, 
debounce del input, y las 3 cards (Poll, ArchitectProposal, SecurityWarning).
PollCard debe ser accesible por teclado (role=radiogroup).
Responsive mobile-first: panel lateral oculto en <768px.
```

**Verificar:**
- [ ] ErrorBoundary muestra fallback con botón retry
- [ ] PollCard navegable con Tab + Enter
- [ ] En móvil el chat ocupa el 100%
- [ ] Borrador se preserva en sessionStorage

---

### Sesión 9: Dashboard

**Prompt:** `09_Frontend_Dashboard.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/09_Frontend_Dashboard.md.
Crea el Dashboard con Sidebar extraído como componente, MetricCards 
memoizados, Recharts lazy con next/dynamic, empty states con CTA, 
y optimistic updates en el Switch de activar/pausar.
```

**Verificar:**
- [ ] Empty state se muestra con 0 datos
- [ ] Switch hace optimistic update y revierte en error
- [ ] Recharts no aparece en el bundle si no se visita Overview
- [ ] Sidebar resalta el item activo

---

### Sesión 10: Seguridad y DevOps

**Prompt:** `10_Seguridad_DevOps.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/10_Seguridad_DevOps.md.
PRIMER PASO: security headers en next.config.ts.
Luego: rate limiting (Upstash), DLP con BLOCKED_DOMAINS configurable,
defensa anti-injection, docker-compose con health checks, y Sentry.
Rate limit también en /api/stripe/webhook.
```

**⚠️ Necesitas:** Upstash Redis URL + Token, Sentry DSN

**Verificar:**
- [ ] Security headers presentes en respuestas HTTP
- [ ] Rate limit 429 después de 100 msg/día en chat
- [ ] DLP bloquea dominios prohibidos
- [ ] Sentry captura error sintético
- [ ] Docker health check de n8n funciona

---

### Sesión 11: Pagos y suscripciones

**Prompt:** `11_Pagos_Suscripciones.md`

**Qué decir:**
```
Lee CLAUDE.md y docs/prompts/11_Pagos_Suscripciones.md.
Implementa Stripe con checkout, webhook IDEMPOTENTE (tabla 
processed_stripe_events), grace period de 3 días para payment_failed,
manejo de subscription.deleted, y guardar stripe_customer_id.
```

**⚠️ Necesitas:** Stripe API keys + `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**Verificar:**
- [ ] Checkout redirige a Stripe
- [ ] Mismo event.id procesado 2 veces NO duplica créditos
- [ ] `payment_failed` → `past_due` (no bloqueo inmediato)
- [ ] `subscription.deleted` → reset a starter

---

### Sesión### 14. Testing y Pipeline CI/CD (Paso Final)

Aplica el `12_Testing_CICD.md` para blindar el código antes del pase a producción.

```bash
/prompt implementa estrictamente las directrices del archivo docs/prompts/12_Testing_CICD.md. Configura el entorno de Vitest y Playwright, y crea los workflows de GitHub Actions necesarios para el despliegue a producción. Recuerda actualizar CLAUDE.md con los comandos de test.
```

✅ **Verificación 14:**
1. Ejecuta `pnpm mt` y asegúrate de que pasen.
2. Comprueba que las carpetas `.github/workflows/` están completas.

### 15. Voice AI Call Center (Avanzado)

Aplica el `13_VoiceAI_CallCenter.md` para configurar la arquitectura que soporta llamadas de voz de baja latencia integrando n8n como backend asíncrono.

```bash
/prompt implementa las directrices de arquitectura de docs/prompts/13_VoiceAI_CallCenter.md. Actualiza el system prompt del Architect Agent (LangGraph) para que esté instruido sobre cómo ofrecer y generar templates híbridos de Voice AI. Crea el endpoint backend sugerido y actualiza la Seed Data del RAG con el nuevo "Voice AI Tool Backend" template.
```

✅ **Verificación 15:**
1. Revisa que el prompt del Agente Arquitecto mencione explícitamente la integración de Vapi.ai + n8n Webhooks.
2. Revisa que el RAG Seed Data ahora contenga el esquema JSON de un nodo Webhook de n8n diseñado para Tool Calling asíncrono.

---

## Manejo de Errores Durante la Sesión

Cuando Claude cometa un error:

```
Ese error que acabas de corregir, añádelo a la sección "Learned Patterns" 
de CLAUDE.md con el formato: ❌ [error] → ✅ [solución] — [contexto]
```

## Cómo Retomar un Prompt Incompleto

Si una sesión se cortó a mitad:

```
Lee CLAUDE.md y docs/prompts/XX_nombre.md.
En la sesión anterior implementamos hasta el paso 3. 
Continúa desde el paso 4. No toques lo ya implementado.
Verifica que lo anterior sigue funcionando antes de continuar.
```

## Cómo Pedir Cambios a un Prompt Ya Aplicado

```
Lee CLAUDE.md. Necesito modificar la implementación del Prompt 07 
(n8n integration). El cambio es: [descripción].
Lee docs/prompts/07_Integracion_n8n.md para contexto.
No toques ningún otro prompt.
```

---

## Diagrama de Dependencias

```
00b ─→ 01 ─→ 01b ─→ 02 ─→ 03 ─→ 04 ─→ 05 ─→ 05b
                                            ↓
                                      06 ─→ 07
                                            ↓
                                      08    09
                                       ↘   ↙
                                        10 ─→ 11 ─→ 12
```

- **00b** inicializa las reglas (debe ser el primero absoluto)
- **01-01b** son independientes de BD (puro setup)
- **02-03** son la capa de datos + auth
- **04-05-05b** son la capa de IA y Knowledge Base (RAG)
- **06-07** son la capa de integración n8n
- **08-09** son frontend (pueden hacerse en paralelo)
- **10** endurece todo lo anterior
- **11** necesita 10 (rate limiting del webhook stripe)
- **12** verifica todo y configura CI/CD
