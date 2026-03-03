# Prompt 06: API Backend y Webhooks (Integración n8n)

**Objetivo:** Desarrollar la capa de API de la aplicación que actuará como intermediario entre los eventos externos, la instancia de n8n y el frontend del usuario, asegurando la trazabilidad y el cobro de créditos.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 6 de 11**. Solo implementa los Route Handlers/endpoints de la API de Next.js: el proxy de webhooks entrantes y el endpoint de callbacks. **No implementes el cliente completo de n8n (`client.ts`)** — eso se creará en el Prompt 07. No construyas ninguna UI.

---

## 1. Contexto del Backend
Dado que hemos decidido usar **únicamente n8n** como nuestro motor de ejecución, nuestra API (construida en Next.js Route Handlers) tiene tres responsabilidades fundamentales:

1. **Gestión de Workflows en n8n:** Crear, activar, pausar y borrar workflows dinámicamente en nuestra instancia de n8n usando su API REST oficial, basándonos en el JSON generado por el Agente Generador.
2. **Proxy de Webhooks (Opcional pero Recomendado):** Para mantener el control total sobre los eventos (y poder cobrar créditos antes de que n8n trabaje), los webhooks de terceros (ej. Stripe, Shopify) pueden llegar a `/api/webhooks/[automationId]` en nuestro servidor, registrar el intento, descontar el crédito y luego hacer un POST al webhook real de n8n.
3. **Recepción de Logs de n8n:** Recibir llamadas desde los workflows de n8n (usando un nodo HTTP Request al final del workflow) para registrar en `automation_runs` si la ejecución fue exitosa o fallida.

## 2. Herramientas a utilizar
- **Next.js Route Handlers (`app/api/...`)**: Para exponer endpoints RESTful ligeros.
- **Zod**: Para validar payloads entrantes.
- **Supabase SSR Client**: Para acceder a la base de datos de forma segura (con `service_role` para endpoints públicos).
- **`ApiError` + `apiSuccess()`**: Utilidades creadas en el Prompt 01 para respuestas estandarizadas.

### Formato de respuesta (OBLIGATORIO para todos los endpoints)
Todos los endpoints de este prompt y los siguientes DEBEN usar el formato estandarizado:
- **Éxito:** `{ data: T }` — usar `apiSuccess()` del Prompt 01.
- **Error:** `{ error: { code: string, message: string } }` — usar `handleApiError()` del Prompt 01.

### HTTP Status Codes
| Código | Significado | Uso |
|---|---|---|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado (deploy de workflow) |
| 400 | Bad Request | Payload inválido (falla Zod) |
| 401 | Unauthorized | Sin sesión activa |
| 402 | Payment Required | Sin créditos disponibles |
| 404 | Not Found | Automatización no encontrada |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Error | Error inesperado del servidor |

## 3. Entregables Esperados
Deberás crear/modificar los siguientes archivos en la carpeta `src/app/api/` y `src/backend/`:

- `src/app/api/n8n/deploy/route.ts`: Endpoint privado (requiere auth del usuario) que llama a la API de n8n para activar un workflow. Reutilizará el `client.ts` que se creará en el Prompt 07.
- `src/app/api/webhooks/[automationId]/route.ts`: Endpoint público que recibe eventos de terceros, valida el payload con Zod, registra el inicio en `automation_runs` y redirige el payload al webhook de n8n.
- `src/app/api/n8n/callbacks/route.ts`: Endpoint donde n8n reporta el resultado. Valida la cabecera `x-callback-secret` antes de procesar.

## 4. Instrucciones Paso a Paso para Claude Code

Por favor, ejecuta los siguientes pasos en orden:

1.  **Integración con la API de n8n:**
    - Crea `src/backend/n8n/client.ts`.
    - Implementa funciones utilizando nativo `fetch` para: `createWorkflow(name, nodes, connections)`, `activateWorkflow(id)`, y `deleteWorkflow(id)`.
    - Asegúrate de leer la variable de entorno `N8N_API_KEY` y `N8N_HOST` desde `env` (Prompt 01).

1b. **Service Layer (Capa de Servicio):**
    - Crea `src/backend/services/automation.service.ts` con métodos: `deploy(automationId)`, `activate(workflowId)`, `pause(workflowId)`, `delete(automationId)`.
    - Crea `src/backend/services/credit.service.ts` que encapsule: `check(userId)`, `decrement(userId, runId)` (llamando al RPC de Supabase).
    - Estos servicios abstraen la lógica de negocio de los Route Handlers, permitiendo unit testing sin HTTP.

2.  **Endpoint de Despliegue (Deploy):**
    - Crea `src/app/api/n8n/deploy/route.ts` (POST).
    - Este endpoint debe ser llamado después de que el usuario apruebe una automatización. Debe leer el JSON de la BD usando Supabase auth, llamar a `createWorkflow` en n8n, guardar el `n8n_workflow_id` retornado en la tabla `automations`, y luego llamar a `activateWorkflow`.

3.  **Endpoint Proxy de Webhooks (Entrada):**
    - Crea el archivo `src/app/api/webhooks/[automationId]/route.ts` (Soporta GET y POST).
    - **Zod Schema obligatorio:**
      ```ts
      const WebhookPayloadSchema = z.object({
        // Definir campos esperados según el tipo de webhook
      }).passthrough() // Permitir campos extra de terceros
      ```
    - En el método `POST`, lee el body, busca la automatización en Supabase.
    - Crea un registro en `automation_runs` con estado `running` (y descuenta 1 crédito de `users.credits_remaining`).
    - **IMPORTANTE:** Responder `200 OK` al servicio origen ANTES de llamar a n8n. Si n8n tarda 30s, el servicio externo (Stripe, Shopify) hará timeout y reintentará. Patrón correcto: responder 200, luego procesar asincrónicamente.
    - Haz un `fetch (POST)` hacia la URL del webhook de n8n asociada a este workflow pasando el mismo body.
    - Envolver en try/catch: si el forward a n8n falla, registrar el error pero NO devolver error al servicio origen (ya respondimos 200).

4.  **Endpoint de Callback de n8n (Salida):**
    - Crea `src/app/api/n8n/callbacks/route.ts` (POST).
    - Espera recibir `{ runId, status, logs, errorMessage }` enviado por el último nodo del workflow en n8n.
    - Actualiza el registro correspondiente en `automation_runs` a `success` o `failed`.
    - *(La seguridad aquí es importante: requiere que n8n envíe un token secreto predefinido en las cabeceras para validar que la llamada viene internamente de nuestro n8n).*

5.  **Verificación Final:**
    - Configura un mock test en `src/backend/n8n/test.ts` que intente conectar con la API de n8n (o un endpoint ficticio) para garantizar que las cabeceras `'X-N8N-API-KEY'` se envían correctamente.
    - Asegura que `pnpm lint` pase sin errores de tipado en los Route Handlers.

## Testing Strategy
- Verificar que `/api/n8n/deploy` retorna 401 si no hay sesión.
- Verificar que `/api/webhooks/[id]` retorna 402 si el usuario no tiene créditos.
- Verificar que `/api/webhooks/[id]` responde 200 antes de hacer forward a n8n.
- Verificar que `/api/n8n/callbacks` rechaza requests sin `x-callback-secret` válido.
- Verificar que todos los endpoints usan `apiSuccess()` y `handleApiError()`.
- Verificar que los Zod schemas rechazan payloads malformados con 400.
