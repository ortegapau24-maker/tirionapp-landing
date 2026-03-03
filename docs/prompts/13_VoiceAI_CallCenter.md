# Prompt 13: Voice AI Call Center (Vapi + n8n Backend)

**Objetivo:** Implementar la capacidad de crear "Agentes Telefónicos de Voz" (Voice AI) de baja latencia. Dado que n8n no es apto para manejar el stream de voz en tiempo real por su latencia, usaremos una arquitectura híbrida: Un proveedor de Voice AI (Vapi.ai o Retell) maneja la conversación, y n8n actúa como el backend asíncrono (*Tool Caller*).

---

## 1. Arquitectura de Voice AI

El sistema debe funcionar bajo el siguiente flujo:
1. **Llamada entrante/saliente:** El usuario habla por teléfono.
2. **Edge Voice AI (Vapi.ai):** Captura el audio (STT), mantiene el contexto con un LLM rápido, y responde con voz (TTS) en <500ms. Maneja las interrupciones (barge-in) nativamente.
3. **Tool Calling (n8n Webhook):** Si el LLM de voz necesita hacer algo (ej. "Revisando tu agenda..."), hace una petición HTTP POST a un Webhook de n8n.
4. **Ejecución n8n:** n8n recibe el payload, busca en base de datos o APIs externas, y devuelve una respuesta HTTP `200 OK` con un JSON (`{"status": "success", "slot_available": true}`).
5. **Respuesta de Voz:** Vapi.ai lee el JSON de n8n y le dice al usuario: *"Sí, tengo espacio a las 5pm"*.

## 2. Instrucciones para Claude Code

Tu tarea es preparar el terreno en la plataforma para soportar esta arquitectura, y enseñarle al Agente Arquitecto (Prompt 04) a proponerla.

### Paso 2.1: Actualizar el System Prompt del Agente Arquitecto
Edita el generador de system prompts o la lógica del `Architect Agent` para que incluya las siguientes directrices sobre requerimientos de VOZ:

*System Prompt Update:*
> "Si el usuario solicita un 'Call Center', 'Hacer llamadas', o 'Asistente de Voz Telefónico', DEBES informarle que n8n no maneja la voz en tiempo real.
> Propón la siguiente arquitectura: 'Usaremos Vapi.ai (o similar) para la llamada en tiempo real. Yo (el agente) generaré los flujos de n8n que actuarán como los *Custom Tools* o *Serverless Functions* a los que Vapi llamará vía Webhook cuando necesite consultar datos externos durante la llamada'."

### Paso 2.2: Crear el Controller de Voice AI (Opcional - Capa API)
Crea un endpoint en el backend de Next.js (`src/app/api/voice/provision/route.ts`) que actúe como una envoltura (wrapper) para crear asistentes en la API de Vapi.ai si el cliente proporciona su API Key en la configuración.
- Validar `Authorization`.
- Enviar payload a `api.vapi.ai/assistant`.
- Devolver el `assistant_id` y el `phone_number_id` al frontend de TirionApp.

### Paso 2.3: Template RAG para "Voice AI Tool Backend"
Debes crear un JSON template en el script de originación RAG (`scripts/seed-rag.ts` o `05b_RAG_Seed_Data.md`) que represente un "Backend Helper" para IA de voz.

**Estructura del Template `["webhook", "postgres", "respondToWebhook"]`:**
1. Nodo `Webhook` (POST, URL `/webhook/vapi-tool-check-inventory`, Method POST, Respond: `Using Respond to Webhook Node`).
2. Nodo `Postgres` o `Supabase` (Buscar inventario o agendar cita).
3. Nodo `Respond to Webhook` (Devuelve un JSON limpio `{ success: true, data: result }` sin headers raros, apto para ser parseado por Vapi).

Este template asegura que el Agente Generador sepa cómo hacer flujos asíncronos limpios que sirvan a integraciones de voz externas.

## 3. Testing Strategy
- El testing dependerá de tener una cuenta de Vapi.ai simulada. 
- En CI/CD (Test Unitario): Mockear la llamada de Vapi hacia el webhook de n8n, verificando que n8n devuelva el JSON en menos de 2 segundos.
- Verificar que el Agente Arquitecto responda con la mención de "Vapi + n8n Tool Calling" cuando se le pregunte en el chat: "Quiero un bot que haga llamadas de ventas".
