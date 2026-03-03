# Prompt 08: Frontend - Chat de Onboarding y Micro-Validaciones

**Objetivo:** Crear la interfaz de usuario conversacional (Chat) donde el usuario será entrevistado por la IA Consultora y donde ocurrirán las "Micro-Validaciones" de seguridad y arquitectura antes de generar la automatización.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 8 de 11**. Solo implementa el frontend del chat de onboarding y las tarjetas de "Generative UI". NO implementes el Dashboard de usuario, los flujos de Stripe, ni el sistema de gestión de automatizaciones. Esos se tratan en los Prompts 09-11.

---

## 1. Contexto de la Interfaz (Frontend App)
El núcleo de la experiencia del usuario (UX) es este chat. A diferencia de ChatGPT, esto no es un chat de texto abierto sin fin. Es un **flujo guiado** donde nosotros pintamos UI personalizada dependiendo del estado de la IA.

Por ejemplo:
- Si el *Consultant* necesita saber qué CRM usa el cliente, podemos pintar texto, pero también unos botones rápidos (HubSpot, Salesforce, Otro).
- Si el *Architect* termina su propuesta de arquitectura, la interfaz MUESTRA visualmente el flujo propuesto (quizá como una lista de pasos limpia a la izquierda) y un gran botón de "Aprobar y Generar" o "Modificar" a la derecha.
- Si el *Security Agent* detecta un riesgo medio/alto (ej. borrado de datos), el chat detiene la ejecución del LangGraph y muestra un **Modal o Tarjeta de Peligro** exigiendo al usuario que teclee "CONFIRMO" o pulse un interruptor explícito antes de continuar.

## 2. Herramientas a utilizar
- **Next.js (App Router)**: Client Components (`"use client"`) para la reactividad del chat.
- **shadcn/ui**: Para las tarjetas (Cards), Botones, Modals (Dialog) y Badges (para destacar herramientas).
- `ai/react` (Vercel AI SDK): El hook `useChat` u `useAssistant` para gestionar fácilmente el streaming y los tool calls desde la API hacia la UI.
- **Lucide Icons**: Para soporte visual (iconos de advertencia, check, engranajes).

## 2b. Convención de Respuesta de la API de Chat (Generative UI)
El endpoint `/api/chat` (Prompt 04) debe retornar un objeto con un campo `type` que el frontend utilizará para decidir qué componente renderizar. Implementa esta convención estrictamente:
```ts
type ChatResponse =
  | { type: 'text'; content: string }
  | { type: 'poll'; question: string; options: string[] }
  | { type: 'architect_proposal'; steps: { tool: string; action: string }[] }
  | { type: 'security_warning'; risk_level: 'medium'|'high'; issues: string[] };
```
El `ChatWindow` debe leer el `type` de cada mensaje y renderizar el componente React correspondiente.

## 3. Entregables Esperados
Deberás crear/modificar los siguientes archivos en `src/app/(dashboard)/` y `src/components/chat/`:

- `src/app/(dashboard)/chat/page.tsx`: La página contenedora principal del onboarding. Layout de dos columnas recomendado (Chat + Contexto/Propuesta).
- `src/components/chat/ChatWindow.tsx`: Área principal de mensajes.
- `src/components/chat/MessageBubble.tsx`: El componente visual de cada mensaje. Debe soportar renderizado de Markdown u opciones accionables (botones) si la IA las envía.
- `src/components/chat/cards/ArchitectProposalCard.tsx`: Una tarjeta UI específica que se renderiza cuando la IA devuelve el JSON de la propuesta arquitectónica, mostrando el diagrama o lista de herramientas.
- `src/components/chat/cards/SecurityWarningCard.tsx`: Tarjeta roja o amarilla para micro-validaciones de seguridad.
- `src/components/chat/cards/PollCard.tsx`: Tarjeta interactiva para encuestas o preguntas de opción múltiple enviadas por la IA Consultora.

## 4. Instrucciones Paso a Paso para Claude Code

Por favor, ejecuta los siguientes pasos en orden:

1.  **Instalación del SDK AI:**
    - Instala el SDK de Vercel: `pnpm add ai`. **Es obligatorio** para consumir el stream SSE del endpoint `/api/chat` (creado en Prompt 04) de forma correcta en el cliente. El hook `useChat` maneja automáticamente la reconexion y el buffer del stream.

2.  **Maquetación del ChatWindow Central:**
    - Crea `src/components/chat/ChatWindow.tsx` como un Client Component (`"use client"`).
    - Implementa una interfaz limpia estilo iMessage o Intercom: un área scrolleable de mensajes y un input fijo abajo. Oculta el scrollbar (`scrollbar-hide`).
    - **OBLIGATORIO:** Envolver el `ChatWindow` completo en un `<ErrorBoundary>` (creado en Prompt 01). Si el stream SSE falla o el componente crashea, debe mostrar un UI amigable con botón de retry, NO una pantalla en blanco.
    - **Virtualización de mensajes:** Una entrevista puede generar 50+ mensajes. Usar `react-window` o `@tanstack/virtual` para virtualizar la lista y mantener el rendimiento del scroll.

3.  **Renderizado "Generative UI" (Micro-Validaciones y Encuestas):**
    - Crea `src/components/chat/cards/PollCard.tsx`. Una tarjeta que muestre una pregunta (ej. "¿Qué CRM usas?") y un array de opciones (botones). Al pulsar una opción, el componente debe renderizar un estado de "Seleccionado" y enviar automática y silenciosamente la respuesta de vuelta al agente (simulando que el usuario la escribió).
    - Crea `src/components/chat/cards/SecurityWarningCard.tsx`. Debe recibir un `riskLevel` y un `issues[]`. Pintará un borde rojo claro o ámbar, un listado de los riesgos y dos botones: "Entendido, Proceder" y "Cancelar Flujo". Al pulsar el de proceder, emitirá un mensaje simulado del usuario ("Acepto los riesgos") que el orquestador backend interpretará para reanudar. **Usar z-index `z-modal` (30) del Prompt 01b para el overlay.**
    - Crea `src/components/chat/cards/ArchitectProposalCard.tsx`. Pintará los pasos de la integración sugerida (ej. "Trigger: Typeform -> Acción: Enviar Gmail") basándose en el state del backend de LangGraph.
    - **Accesibilidad en PollCard:** Los botones de las encuestas deben ser navegables con Tab y activables con Enter/Space. Añadir `role="radiogroup"` al contenedor y `role="radio"` + `aria-checked` a cada opción.

4.  **Integración con el Controlador de Next.js (El Page):**
    - Diseña `src/app/(dashboard)/chat/page.tsx`. Si la pantalla es grande (Desktop), pon el chat en una columna ancha en el centro, y deja un panel lateral derecho donde se irá dibujando el "Project Info" en tiempo real (las tools de la industria que el usuario va mencionando).
    - **Responsive mobile-first:** En móvil (< 768px), el panel lateral derecho se oculta y se accede mediante un drawer deslizable o un tab inferior. El chat ocupa el 100% del ancho.
    - Conecta el envío del formulario del `ChatWindow` al endpoint que creaste en el **Prompt 04** (`/api/chat`), obteniendo el stream de datos y actualizando el `UI_STATE`.
    - **Debounce del input:** Si el usuario pulsa Enter rápidamente, puede enviar 2-3 mensajes antes de que el LLM responda. Añadir debounce de 300ms + deshabilitar input mientras hay una request activa.
    - **Preservar borrador en `sessionStorage`:** Si el usuario cierra la pestaña accidentalmente con texto escrito, no debe perderse. Guardar el draft del textarea en sessionStorage.

5.  **Verificación Final:**
    - Asegúrate de que el input de texto del usuario se inhabilita (`disabled={true}`) mientras el motor de la IA está "Pensando...".
    - Añade un estado de **timeout visible**: si el servidor no responde en 30 segundos, muestra un mensaje: "La IA está tardando. Intenta de nuevo." y reactiva el input.
    - **Indicador de reconexión SSE:** Si la conexión se pierde (red inestable, móvil), mostrar un banner sutil animado: "Reconectando..." con auto-retry exponencial. No fallar silenciosamente.
    - Comprueba que la UI es robusta frente a recargas de página (usando un `thread_id` de la URL o Context para recuperar los mensajes anteriores de la BD via `interviews.conversation_history`).

---
**Nota para la IA:** La clave arquitectónica de este frontend es la **UI Dinámica**. El chat de Vercel/LangChain permite que la IA devuelva *Tool Calls* o etiquetas especiales en su respuesta de texto que le indiquen al Frontend que no debe pintar un simple párrafo de texto, sino renderizar un Componente de React (ej. `<SecurityWarningCard />`). Implementa esta separación (Mensaje de texto vs. Tarjeta UI) de forma clara.

## Testing Strategy
- Verificar que el ErrorBoundary captura un crash del stream SSE y muestra el fallback con botón retry.
- Verificar que el debounce impide enviar 2 mensajes rápidos (segundo intento es ignorado).
- Verificar que PollCard es navegable por teclado (Tab entre opciones, Enter selecciona).
- Verificar que SecurityWarningCard usa z-index correcto y no queda detrás de otros elementos.
- Verificar que en móvil (<768px) el panel lateral se oculta y el chat ocupa el 100%.
- Verificar que el borrador del input se preserva en sessionStorage tras recargar.
- Verificar que la reconexión SSE muestra banner y se auto-recupera.
