# Prompt 11: Sistema de Pagos y Suscripciones (Stripe)

**Objetivo:** Implementar la pasarela de pagos con Stripe para gestionar los planes de suscripción SaaS (con créditos incluidos), la compra de paquetes de créditos adicionales, y un estimador de costes en el dashboard. Garantizar que la base de datos de usuarios se mantiene sincronizada vía webhooks.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 11 de 11** y el último de la serie. Solo implementa la integración con Stripe (Checkout, Webhook, y vista de Billing). No modifiques la lógica de agentes ni los endpoints de n8n.

---

## 1. Contexto del Sistema de Cobro
El modelo de negocio se basa en: **(Suscripción + créditos incluidos) + (pago de créditos extra) + (estimación de coste)**.

### Planes de Suscripción
Cada plan incluye una cantidad de créditos mensuales. Los créditos se consumen con cada ejecución de IA/agente.
0. **Free Trial:** $0 por 14 días. (1 Automatización Activa | **200 créditos** incluidos una sola vez | Sin tarjeta de crédito necesaria). Implementación: usar flag `subscription_tier: 'trial'` en DB. Auto-degradar tras 14 días desde `created_at` — bloquear nuevas ejecuciones y solicitar upgrade. Los créditos del trial NO se renuevan.
1. **Starter:** $149/mes. (3 Automatizaciones Activas | **1,000 créditos** incluidos | Créditos extra a **$0.05** c/u).
2. **Growth:** $299/mes. (10 Automatizaciones Activas | **5,000 créditos** incluidos | Créditos extra a **$0.03** c/u).
3. **Scale:** $599/mes. (Automatizaciones Ilimitadas | **20,000 créditos** incluidos | Créditos extra a **$0.02** c/u).

*Nota técnica:* Ofrecemos opción de pago anual con 10% de descuento. Los créditos no usados al final del mes NO se acumulan (use-it-or-lose-it).

### Créditos Extra (Top-ups)
Cuando un usuario consume todos sus créditos incluidos, puede comprar packs adicionales:
- Los créditos extra se cobran al precio por unidad de su plan (mayor plan = menor coste unitario).
- Los packs de créditos extra se compran en bloques predefinidos (ej: 500, 1000, 5000 créditos).
- Los créditos extra comprados NO expiran al final del mes — se consumen después de los incluidos.

### Estimador de Costes
- Disponible dentro del dashboard de la app (no en la landing).
- Permite al usuario estimar su coste mensual basándose en número estimado de ejecuciones.
- Muestra: coste de suscripción + coste estimado de créditos extra (si aplica).

Necesitamos que el usuario pueda:
1. **Suscribirse a uno de estos 3 planes** a través de Stripe Checkout.
2. **Comprar packs de créditos extra** cuando necesite más ejecuciones.
3. **Ver su estimación de coste** antes de desplegar automatizaciones.
4. **Sistema de control (Rate Limiting y Quotas):** Al desplegar o ejecutar una automatización (Prompt 07), se debe verificar que el usuario no ha excedido su límite de "Automatizaciones Activas" ni sus créditos restantes.

## 2. Herramientas a utilizar
- **Stripe Node.js SDK**: Para interactuar con la API backend.
- **Stripe Checkout**: Para alojar la página de pagos y evitar manejar tarjetas de crédito directamente (`hosted checkout pages`).
- **Stripe Webhooks**: Para enterarnos de forma segura cuando un pago tiene éxito o falla.
- **Next.js Route Handlers**: Para generar las sesiones de checkout y recibir los callbacks.

## 3. Entregables Esperados
Deberás crear/modificar los siguientes archivos en `src/app/api/` y `src/backend/`:

- `src/lib/stripe.ts`: Inicialización segura del cliente de Stripe.
- `src/app/api/stripe/checkout/route.ts`: Endpoint POST para crear una sesión de pago (Checkout Session) basada en el producto que el usuario eligió.
- `src/app/api/stripe/webhook/route.ts`: Endpoint crítico que escucha eventos de Stripe (`invoice.paid`, `checkout.session.completed`) y actualiza la tabla `users` en Supabase.
- `src/app/(dashboard)/billing/page.tsx`: Vista del panel de control donde el usuario ve su plan actual, créditos restantes, y botones para hacer un Upgrade o comprar Top-ups.

## 4. Instrucciones Paso a Paso para Claude Code

Por favor, ejecuta los siguientes pasos en orden:

1.  **Configuración Base:**
    - Instala el SDK: `pnpm add stripe`.
    - Crea `src/lib/stripe.ts` exportando una instancia de `Stripe` inicializada con `process.env.STRIPE_SECRET_KEY`.

2.  **Generación de Checkout Sessions (`api/stripe/checkout/route.ts`):**
     - Crea este endpoint. Debe leer qué `priceId` quiere comprar el usuario. Los Price IDs deben estar en variables de entorno con nombres exactos:
       - `STRIPE_PRICE_STARTER` → Plan Starter ($149/mes)
       - `STRIPE_PRICE_GROWTH` → Plan Growth ($299/mes)
       - `STRIPE_PRICE_SCALE` → Plan Scale ($599/mes)
       - `STRIPE_PRICE_CREDITS_STARTER` → Créditos extra Starter ($0.05/crédito)
       - `STRIPE_PRICE_CREDITS_GROWTH` → Créditos extra Growth ($0.03/crédito)
       - `STRIPE_PRICE_CREDITS_SCALE` → Créditos extra Scale ($0.02/crédito)
     - Asegúrate de pasar el `user.id` de Supabase al campo `metadata.userId` de la sesión de Stripe. Esto es *crucial* para identificar al usuario en el webhook.
     - Para compras de créditos extra, usar `mode: 'payment'` (pago único) en vez de `mode: 'subscription'`.
     - Pasa también `customer_email: user.email` para que Stripe muestre el email correcto en la página de pago.
     - Para prevenir sesiones de checkout duplicadas, pasa un **idempotency key** `{ idempotencyKey: user.id + '_' + priceId }` como tercer argumento de `stripe.checkout.sessions.create()`.
     - Devuelve la URL de la sesión de Stripe para redirigir al navegador del usuario.

3.  **El Motor de Sincronización (`api/stripe/webhook/route.ts`):**
    - Crea el webhook endpoint. DEBE usar la librería de Stripe para verificar la firma del payload con `process.env.STRIPE_WEBHOOK_SECRET` (para evitar falsificadores).
    - Escucha los siguientes eventos:
      - `checkout.session.completed` — nueva suscripción.
      - `invoice.payment_failed` — renovación fallida. Implementar: marcar al usuario con `payment_status: 'past_due'`, NO bloquear inmediatamente las automatizaciones. Dar un **grace period de 3 días** antes de degradar.
      - `customer.subscription.deleted` — cancelación desde Stripe Customer Portal. Reset a `subscription_tier='starter'` y `credits_remaining=1000`.
    - Cuando ocurra el evento `checkout.session.completed`, extrae el `userId` de los metadatos (`session.metadata.userId`) y el `priceId` comprado.
    - **Guardar `stripe_customer_id`:** Si `session.customer` existe, guardarlo en la tabla `users.stripe_customer_id`. Sin esto, no puedes crear futuras sesiones de Stripe para el mismo customer (top-ups, cambios de plan).
     - Crea un mapa de Price ID a tier/créditos:
       ```ts
       const PLAN_MAP: Record<string, { tier: string; credits: number; extraCreditPrice: number }> = {
         [process.env.STRIPE_PRICE_STARTER!]: { tier: 'starter', credits: 1000, extraCreditPrice: 0.05 },
         [process.env.STRIPE_PRICE_GROWTH!]: { tier: 'growth', credits: 5000, extraCreditPrice: 0.03 },
         [process.env.STRIPE_PRICE_SCALE!]: { tier: 'scale', credits: 20000, extraCreditPrice: 0.02 },
       };
       ```
     - Para eventos de compra de créditos extra (`checkout.session.completed` con `mode === 'payment'`), sumar los créditos comprados al `credits_remaining` del usuario (NO resetear).
    - Utiliza el cliente administrativo de Supabase (`service_role`) para hacer un UPDATE a la tabla `users`: setea `subscription_tier` y `credits_remaining` según el plan.
    - **Idempotencia OBLIGATORIA:** Stripe puede enviar el mismo evento 2+ veces. Guardar el `event.id` en una tabla `processed_stripe_events` (o Set en Redis). Si el evento ya se procesó, skip silenciosamente y devolver 200. Esto NO es opcional.
    - **Logging estructurado:** Registrar cada evento procesado: `{ event_type, event_id, user_id, tier, credits, processed_at }`. Sin esto, debuggear "¿por qué el usuario X no tiene su plan?" es imposible.

4.  **Frontend de Facturación (`(dashboard)/billing/page.tsx`):**
     - En la vista del dashboard de facturación, muestra grandes los créditos actuales (incluidos + extra).
     - Pinta tarjetas (Pricing Cards) para los planes disponibles.
     - Añade un botón "Comprar Créditos Extra" que muestre los packs disponibles según el plan del usuario.
     - **Estimador de Costes:** Implementar un componente con un slider o input donde el usuario pueda estimar sus ejecuciones mensuales. Mostrar: `Coste suscripción ($X) + Créditos extra estimados ($Y) = Total estimado ($Z)`.
     - Opcional: Integra el "Stripe Customer Portal" permitiendo al usuario cancelar su suscripción fácilmente (creando un endpoint `/api/stripe/portal` que devuelva la URL del portal de gestión de Stripe).

5.  **Verificación Final:**
    - Documenta en `README.md` cómo usar el CLI de Stripe para probar los webhooks en local:
      ```bash
      stripe listen --forward-to localhost:3000/api/stripe/webhook
      ```
    - Verifica que la variable `STRIPE_WEBHOOK_SECRET` se actualice con el «whsec_...\u00bb que genera el CLI anterior (diferente al del Dashboard de producción).
    - Añade una nota en el README: el webhook debe responder 200 siempre, incluso si el procesamiento falla internamente, para evitar que Stripe reintente indefinidamente.

---
**Nota para la IA:** El webhook de Stripe puede ser llamado por duplicado de vez en cuando (regla de oro de los sistemas distribuidos). La idempotencia del webhook es OBLIGATORIA, no "nice to have". Un evento procesado dos veces puede duplicar créditos. Maneja cualquier error usando un Try/Catch que registre el fallo pero devuelva 200 a Stripe.

## Testing Strategy
- Verificar que `checkout.session.completed` actualiza `subscription_tier` y `credits_remaining`.
- Verificar que un mismo `event.id` procesado dos veces NO duplica créditos (idempotencia).
- Verificar que `invoice.payment_failed` marca al usuario como `past_due` sin bloquear automatizaciones.
- Verificar que `customer.subscription.deleted` resetea el plan a `starter`.
- Verificar que el `stripe_customer_id` se guarda tras el primer checkout.
- Verificar que el webhook siempre retorna 200, incluso ante errores internos.
- Verificar que el Stripe Customer Portal redirect funciona (si se implementa).
