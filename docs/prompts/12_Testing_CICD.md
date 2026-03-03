# Prompt 12: Testing y CI/CD Pipeline

**Objetivo:** Implementar una estrategia de testing integral (unit tests + E2E) y un pipeline de CI/CD con GitHub Actions que garantice la calidad del código antes de cada deploy.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 12** y el último añadido a la serie. Solo implementa tests y CI/CD. No modifica funcionalidad existente.

---

## 1. Contexto

Ninguno de los prompts 01-11 incluye una estrategia de testing completa. Este es el mayor gap de la arquitectura actual. Sin tests automatizados, cada cambio se despliega "en fe" — inaceptable para un producto B2B a $149-$599/mes.

## 2. Herramientas a utilizar
- **Jest** (o Vitest): Unit tests para lógica de backend y servicios.
- **Playwright**: Tests E2E para flujos críticos de usuario.
- **GitHub Actions**: Pipeline de CI/CD.

## 3. Entregables Esperados

### Unit Tests (`tests/unit/`)

```
tests/unit/
├── agents/
│   └── guardrail.test.ts          → Bloquea injection patterns
├── backend/
│   ├── n8n/
│   │   └── template-injector.test.ts → Inyecta webhook + callback nodes
│   └── services/
│       └── credit.service.test.ts  → Idempotencia de decrement
├── lib/
│   ├── security/
│   │   └── dlp.test.ts            → Bloquea dominios prohibidos
│   ├── api/
│   │   ├── errors.test.ts         → ApiError → Response correcta
│   │   └── response.test.ts       → apiSuccess con/sin paginación
│   └── env.test.ts                → Falla con error legible si falta var
└── stripe/
    └── webhook.test.ts            → Idempotencia de eventos
```

### E2E Tests (`tests/e2e/`)

```
tests/e2e/
├── auth/
│   ├── login.spec.ts              → Login con email + Google OAuth mock
│   ├── register.spec.ts           → Registro con company_name
│   └── protected-routes.spec.ts   → Redirect a /login sin sesión
├── chat/
│   ├── interview-flow.spec.ts     → Flujo completo Consultant
│   ├── poll-interaction.spec.ts   → Click en PollCard envía respuesta
│   └── security-warning.spec.ts   → Confirmación de SecurityWarningCard
├── dashboard/
│   ├── overview.spec.ts           → MetricCards renderean con datos
│   ├── automation-detail.spec.ts  → FlowViewer + activate/pause
│   └── billing.spec.ts            → Redirect a Stripe Checkout
└── api/
    ├── webhooks.spec.ts           → 402 sin créditos, 200 con créditos
    └── callbacks.spec.ts          → Rechaza sin x-callback-secret
```

### Page Object Model (`tests/pages/`)

```typescript
// tests/pages/ChatPage.ts
export class ChatPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/chat') }
  async sendMessage(text: string) {
    await this.page.fill('[data-testid="chat-input"]', text)
    await this.page.click('[data-testid="chat-send"]')
  }
  async waitForAIResponse() {
    await this.page.waitForSelector('[data-testid="ai-message"]', { timeout: 30000 })
  }
  async clickPollOption(option: string) {
    await this.page.click(`[data-testid="poll-option-${option}"]`)
  }
  async approveArchitectProposal() {
    await this.page.click('[data-testid="approve-proposal"]')
  }
  async confirmSecurityWarning() {
    await this.page.click('[data-testid="proceed-warning"]')
  }
}
```

### GitHub Actions (`.github/workflows/`)

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test           # Unit tests
      - run: npm audit --audit-level=high

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm build
      - run: pnpm exec playwright test
```

## 4. Instrucciones Paso a Paso

1.  **Configuración de Jest/Vitest:**
    - Instala: `pnpm add -D vitest @testing-library/react @testing-library/jest-dom`
    - Configura `vitest.config.ts` con alias `@/` → `./src/`.
    - Añade script: `"test": "vitest run"`, `"test:watch": "vitest"`.

2.  **Unit Tests Prioritarios:**
    - **Guardrail:** Verificar que detecta "ignora tus instrucciones" y NO bloquea "Quiero automatizar mis facturas".
    - **Template Injector:** Verificar que un workflow sin webhook trigger recibe uno, y que SIEMPRE recibe el nodo callback HTTP al final.
    - **DLP:** Verificar que un workflow con nodo HTTP apuntando a `evil.com` es bloqueado.
    - **Credit Service:** Verificar que `decrement(userId, runId)` con el mismo `runId` dos veces solo decrementa 1.
    - **Stripe Webhook:** Verificar que un `event.id` procesado dos veces no duplica créditos.

3.  **Configuración de Playwright:**
    - Instala: `pnpm add -D @playwright/test`
    - Crea `playwright.config.ts` con `baseURL: 'http://localhost:3000'`, `webServer` config para `pnpm dev`.
    - Crea los Page Objects antes de los tests para reutilización.

4.  **E2E Tests Prioritarios:**
    - **Auth:** Verificar redirect a `/login` sin sesión + login exitoso.
    - **Chat:** Enviar mensaje → esperar respuesta IA (mock) → verificar PollCard interacción.
    - **Dashboard:** Verificar que Overview muestra MetricCards con datos (o Empty State sin datos).

5.  **Pipeline de GitHub Actions:**
    - Crear `.github/workflows/ci.yml` con los jobs `quality` y `e2e`.
    - `quality` corre en cada PR: lint, typecheck, unit tests, npm audit.
    - `e2e` corre DESPUÉS de quality: build → Playwright.

6.  **Verificación Final:**
    - Asegurar que `pnpm test` pasa localmente.
    - Asegurar que el pipeline de CI se ejecuta correctamente en un PR de prueba.

---
**Nota para la IA:** La filosofía es "no merge sin green CI". Cada test debe ser determinista y no depender de APIs externas reales. Usa mocks para Supabase, n8n, Stripe, y LLM providers. Los tests E2E solo necesitan la app corriendo, no servicios externos.

## Testing Strategy (Meta)
Este prompt ES la Testing Strategy. Sus tests verifican TODOS los prompts anteriores:
- Prompt 01: `env.test.ts`
- Prompt 02: `credit.service.test.ts`
- Prompt 04: `guardrail.test.ts`
- Prompt 06/07: `template-injector.test.ts`, `webhooks.spec.ts`
- Prompt 08: `interview-flow.spec.ts`, `poll-interaction.spec.ts`
- Prompt 09: `overview.spec.ts`, `automation-detail.spec.ts`
- Prompt 10: `dlp.test.ts`
- Prompt 11: `webhook.test.ts`, `billing.spec.ts`
