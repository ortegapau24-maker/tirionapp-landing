# Prompt 05: IA Arquitecta y Sistema RAG (pgvector)

**Objetivo:** Construir el motor de Recuperación Aumentada (RAG) que permite a la IA Arquitecta consultar plantillas reales de automatizaciones probadas, evitando así alucinaciones y asegurando la viabilidad técnica de los flujos generados.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 5 de 11**. Solo implementa el sistema RAG (función SQL vectorial, utilidad de embeddings, retriever, y actualización del agente Arquitecto). NO construyas UI, ni endpoints de API pública, ni integración con n8n. Esos son los Prompts 6 y 7.

---

## 1. Contexto del RAG
En el Prompt 04 construimos los nodos de LangGraph. El agente clave para la viabilidad técnica es el **Architect**. Si este agente genera arquitecturas "desde cero", cometerá errores (ej. inventar endpoints o asumir capacidades de una API que no existen).

Para solucionarlo, usaremos la tabla `rag_templates` (creada en el Prompt 02 con `pgvector`). Cuando el Consultor termine de extraer los requerimientos del usuario, el Arquitecto:
1. Tomará ese texto (ej. "Enviar WhatsApp cuando entra un lead en Facebook").
2. Generará un *embedding* de ese texto.
3. Buscará por similitud coseno en `rag_templates` las 3 automatizaciones más parecidas que la agencia ya haya validado previamente.
4. Usará esas 3 plantillas como **contexto inyectado** en su prompt para diseñar la propuesta final.

## 2. Herramientas a utilizar
- `@supabase/supabase-js` (Para llamar directamente a la BD y las funciones RCP de pgvector).
- `@langchain/openai` o equivalente (Para generar el vector embedding del texto del usuario `text-embedding-3-small`).
- `zod` para validar la salida estructurada de la propuesta.

## 3. Entregables Esperados
Deberás crear/modificar los siguientes archivos en la carpeta `src/agents/` y en la BD:

- **En Supabase (SQL):** Una función PL/pgSQL `match_rag_templates` para buscar similitudes vectoriales.
- `src/lib/embeddings.ts`: Utilidad para crear los vectores.
- `src/agents/rag/retriever.ts`: Lógica para buscar en Supabase las plantillas usando el embedding.
- `src/agents/nodes/architect.ts`: Actualizar el nodo del arquitecto (mockeado en el paso anterior) para que ahora integre el retriever antes de llamar al LLM.

## 4. Instrucciones Paso a Paso para Claude Code

Por favor, ejecuta los siguientes pasos:

1.  **Creación de la Función de Búsqueda Vectorial (DB):**
    - Crea una nueva migración en Supabase (`npx supabase migration new match_rag_templates`).
    - En ese archivo SQL, escribe la función `match_rag_templates`. Debe aceptar los parámetros exactamente con estos nombres (snake_case, para que coincidan con la llamada RPC desde el cliente Supabase):
      - `query_embedding` (vector)
      - `match_threshold` (float8)
      - `match_count` (int)
    - La función debe hacer un `SELECT id, title, description, tools_involved, flow_template, 1 - (embedding <=> query_embedding) as similarity` de la tabla `rag_templates`, filtrando por el threshold y ordenando por similitud.

2.  **Generación de Embeddings (App):**
    - Crea `src/lib/embeddings.ts`.
    - Implementa una función `generateEmbedding(text: string): Promise<number[]>` usando `OpenAIEmbeddings` de LangChain con el modelo **`'text-embedding-3-small'`** (obligatorio, ya que la columna de la BD es `vector(1536)`):
      ```ts
      const embedder = new OpenAIEmbeddings({ model: 'text-embedding-3-small' });
      ```
    - Asegúrate de que `OPENAI_API_KEY` esté disponible en el entorno.

3.  **Implementación del Retriever:**
    - Crea `src/agents/rag/retriever.ts`.
    - Implementa la función `retrieveTemplates(query: string, toolsFilter?: string[]): Promise<Template[]>`
    - Esta función generará el embedding del `query` y usará el cliente de Supabase asíncrono (`supabase.rpc('match_rag_templates', { ... })`) para recuperar los resultados.
    - **Cache de embeddings:** Antes de generar un nuevo embedding, verificar en un caché en-memoria (o Redis/Upstash si está disponible) si un query similar ya fue procesado recientemente. Queries frecuentes como "automatizar WhatsApp" no deben generar el mismo embedding 10 veces. TTL recomendado: 1 hora.
    - **Métricas de relevancia:** Loggear el similarity score de los top-3 resultados. Si consistentemente son <0.5, significa que el knowledge base necesita más plantillas.

4.  **Actualización del Agente Arquitecto (`architect.ts`):**
    - Abre `src/agents/nodes/architect.ts` (creado en el prompt 04).
    - Modifica la lógica para que el flujo sea:
      1. Extraer los datos relevantes del `state.extracted_requirements`.
      2. Llamar a `retrieveTemplates(...)` con el resumen del problema.
      3. Inyectar las plantillas JSON devueltas dentro del `system_prompt` del LLM ("Aquí tienes plantillas probadas de nuestra agencia: [JSONs]... Por favor, basa tu diseño en estas arquitecturas").
      4. **Fallback explícito:** Si `retrieveTemplates()` devuelve un array vacío (0 resultados), el system prompt DEBE incluir una nota: "No se encontraron plantillas similares en la base de conocimiento. Genera la arquitectura basándote en tu conocimiento general, pero advierte al usuario que es una propuesta sin template validado previamente." No omitir silenciosamente.
      5. Devolver la propuesta al estado (`architect_proposal`).

5.  **Verificación Final y Seed Data:**
    - Crea un archivo script `scripts/seed-rag.ts` (fuera del ciclo de Next.js, ejecutable con `tsx` o `ts-node`).
    - Este script debe insertar al menos **3 plantillas concretas y realistas** en la tabla `rag_templates` (generando sus embeddings en tiempo de ejecución). Usar datos deterministas para reproducibilidad:
      1. **Gmail → Google Sheets:** Trigger: email recibido, Acción: extraer datos, Destino: fila en Sheets.
      2. **Webhook WhatsApp → CRM (HubSpot):** Trigger: mensaje entrante, Acción: clasificar intent, Destino: crear/actualizar contacto.
      3. **Stripe → Slack:** Trigger: pago recibido, Acción: formatear mensaje, Destino: canal de notificaciones.
    - Usar `batch` para generar todos los embeddings en una sola llamada API en vez de 1-por-1.

---
**Nota para la IA:** El RAG es fundamental para la fiabilidad (reliability) del producto B2B. Asegúrate de que los errores en la llamada a Supabase o a OpenAI Embeddings estén manejados con `try/catch` para que, si el RAG falla temporalmente, el Agente Arquitecto pueda intentar generar un fallback basándose solo en su pre-entrenamiento, pero dejando un log del error.

## Testing Strategy
- Verificar que `generateEmbedding()` retorna un vector de 1536 dimensiones.
- Verificar que `retrieveTemplates('automatizar emails')` retorna resultados del seed data.
- Verificar que el fallback del Architect funciona cuando el RAG devuelve 0 resultados.
- Verificar que el caché de embeddings evita llamadas duplicadas a la API.
- Verificar que los similarity scores se loggean correctamente.
