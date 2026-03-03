# Prompt 07: Integración Avanzada con n8n (API y Webhooks)

**Objetivo:** Desarrollar el módulo de comunicación bidireccional entre nuestra plataforma y la instancia de n8n, permitiendo el despliegue automático de los JSON generados por la IA y la monitorización de su ejecución.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 7 de 11**. Solo implementa el módulo de integración con n8n (`src/backend/n8n/`). Los endpoints de API ya se crearon en el Prompt 06. Actualiza/reutiliza esos endpoints pero NO construyas UI ni lógica de pagos.

---

## 1. Contexto de la Integración n8n
La plataforma utiliza n8n de forma invisible para el usuario final. Cuando la IA Generadora crea el JSON del workflow, nuestro backend debe inyectarlo en n8n mediante su API REST oficial.

Para asegurar la escalabilidad y el modelo de negocio (cobro de créditos por ejecución), el flujo será:
1. **Despliegue:** Se importa el JSON a n8n y se activa el workflow.
2. **Ejecución Inicial (Proxy):** Los eventos externos (ej. Webhook de Stripe) apuntan a nuestra API (`/api/webhooks/[id]`). Nosotros registramos el inicio, descontamos el crédito, y hacemos un POST al Webhook real de n8n.
3. **Ejecución Final (Callback):** El último nodo del workflow en n8n debe ser un nodo HTTP Request que llame a nuestro endpoint `/api/n8n/callbacks` informando del éxito o fracaso, para actualizar la tabla `automation_runs`.

## 2. Herramientas a utilizar
- `fetch` nativo de Node.js / Next.js.
- API REST de n8n (Endpoints: `POST /workflows`, `PUT /workflows/{id}/activate`, etc.).
- `@supabase/ssr` (Service Role) para actualizaciones de logs asíncronas.
- Zod para validación de callbacks.

## 3. Entregables Esperados
Deberás crear los siguientes archivos en `src/backend/n8n/` y `src/app/api/`:

- `src/backend/n8n/client.ts`: Funciones de utilidad tipadas (`createWorkflow`, `activateWorkflow`, `deleteWorkflow`).
- `src/backend/n8n/template-injector.ts`: Utilidad para añadir automáticamente el nodo de Webhook de inicio y el nodo HTTP de Feedback al final del JSON generado por la IA antes de enviarlo a n8n.
- `src/app/api/n8n/deploy/route.ts`: Endpoint POST llamado desde el Dashboard cuando el usuario aprueba una automatización.
- `src/app/api/webhooks/[automationId]/route.ts`: API Proxy que recibe el evento, descuenta créditos y redirige a n8n.
- `src/app/api/n8n/callbacks/route.ts`: API que recibe el resultado de n8n.

## 4. Instrucciones Paso a Paso para Claude Code

Por favor, ejecuta los siguientes pasos:

1.  **Módulo Cliente de n8n:**
    - Crea `src/backend/n8n/client.ts`.
    - Implementa `createWorkflow(name: string, nodes: any[], connections: any[])`. Usa `fetch` apuntando a `${process.env.N8N_HOST}/api/v1/workflows` con el header `X-N8N-API-KEY`.
    - Implementa `activateWorkflow(workflowId: string)` apuntando a la URL exacta: `PATCH ${process.env.N8N_HOST}/api/v1/workflows/${workflowId}/activate`.
    - **Logging obligatorio:** Cada llamada `fetch` a n8n debe loggear: método, URL, status code, latencia. Sin esto, debuggear fallos de integración es imposible.
    - **Circuit Breaker:** Si n8n devuelve 3 errores consecutivos (timeout, 5xx), abrir el circuito durante 60 segundos. Durante ese periodo, todas las llamadas a n8n deben fallar inmediatamente con un error claro: "El motor de ejecución está temporalmente no disponible. Intenta de nuevo en unos minutos." Esto evita saturar un servicio ya degradado.

2.  **Inyector de Nodos Base (Crucial):**
    - Crea `src/backend/n8n/template-injector.ts`.
    - La IA generará la lógica de negocio (ej. Gmail -> OpenAI -> Sheets). Esta función de utilidad debe pre-pender un nodo de tipo **`'n8n-nodes-base.webhook'`** (como trigger inicial) si el flujo no tiene uno definido explícitamente, y **siempre** debe encadenar al final del flujo un nodo de tipo `'n8n-nodes-base.httpRequest'` que haga un POST a `https://[nuestro-dominio]/api/n8n/callbacks` enviando el `run_id` y el estado final.
    - Asegura que este nodo HTTP inyecte en las cabeceras un secreto (`process.env.N8N_CALLBACK_SECRET`) para que sepamos que la llamada es legítima.
    - **Validación del JSON final:** Antes de enviar el workflow a n8n, validar con un schema Zod que el JSON resultante tiene la estructura esperada por la API de n8n (nodos con `type`, `name`, `parameters`; conexiones válidas). Un JSON malformado causará un error opaco en n8n.

3.  **Endpoint de Proxy (Entrada de Datos):**
    - En `src/app/api/webhooks/[automationId]/route.ts`, lee el body de la petición externa.
    - Verifica si el usuario tiene créditos (`supabase.rpc('decrement_credits', { user_id })`). Si no tiene, retorna 402 Payment Required.
    - Crea un registro en `automation_runs` con status `running`.
    - Busca la URL del webhook de n8n (puede estar en `trigger_config`).
    - Haz un `fetch` a n8n pasando el body y el `run_id` recién creado en los headers o query params.

4.  **Endpoint de Callback (Salida de Datos):**
    - En `src/app/api/n8n/callbacks/route.ts`, recibe la petición de n8n.
    - Valida que el header `x-callback-secret` coincida con tu env var.
    - Lee el `run_id` y el `status` (success/failed) del body.
    - **Validación estricta con Zod:** Los campos de texto de los callbacks deben tener longitud máxima (ej. `errorMessage: z.string().max(5000)`) para prevenir inyección de datos masivos.
    - Actualiza la tabla `automation_runs` en Supabase con este estado final usando el `service_role` de Supabase.

4b. **Soft Delete para Workflows:**
    - En vez de borrar permanentemente con `deleteWorkflow()`, implementar un soft delete: cambiar el status a `'archived'` en Supabase y desactivar en n8n, sin borrar. Los clientes B2B pueden necesitar recuperar workflows.

5.  **Verificación Final:**
    - Documenta claramente en el `README.md` que para que esto funcione en local, el desarrollador necesita levantar una instancia de n8n (vía Docker) y configurar un API Key en el panel de n8n, añadiéndola al `.env.local`.
    - **Rotación de `N8N_CALLBACK_SECRET`:** Documentar un mecanismo para aceptar tanto el secreto actual como el anterior durante un periodo de gracia (24h). Si no, rotar el secreto rompe todos los workflows activos que aún envían el secreto antiguo.

## Testing Strategy
- Verificar que `createWorkflow()` envía el header `X-N8N-API-KEY` correctamente.
- Verificar que `template-injector` añade nodo webhook al inicio y nodo HTTP callback al final.
- Verificar que el JSON resultante pasa validación Zod antes de enviarse a n8n.
- Verificar que el circuit breaker se abre tras 3 fallos y se cierra tras 60s.
- Verificar que los callbacks con `x-callback-secret` inválido retornan 401.
- Verificar que el soft delete archiva en Supabase y desactiva en n8n sin borrar.
