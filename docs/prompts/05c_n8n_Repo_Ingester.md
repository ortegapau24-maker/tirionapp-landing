# Prompt 05c: Ingestor de Repositorios n8n (RAG Expandido)

**Objetivo:** Crear un script que extraiga, resuma e ingiera de forma masiva repositorios open-source de flujos de n8n hacia nuestra base de datos vectorial (`rag_templates`). Esto le dará al Agente Arquitecto un conocimiento masivo de flujos probados.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es una extensión del Prompt 05. Solo debe crear un script de utilidad (node script). NO debe modificar LangGraph, la UI, ni la API del backend.

---

## 1. El Problema a Resolver

Para que TirionApp sea útil, la IA no puede inventarse las integraciones. Existen repositorios como:
- [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates)
- [n8n-workflows](https://github.com/Zie619/n8n-workflows)
- Repositorio oficial de n8n.io

Si le inyectamos los JSONs en crudo al LLM en el prompt del sistema, perderá el contexto por exceso de tokens y alucinará configuraciones.

## 2. La Solución a Implementar

Crearemos un script `scripts/ingest-n8n-repos.ts` que procesará carpetas locales (o clonará repos en un directorio `.tmp`) y hará lo siguiente por cada archivo `.json`:
1. Extraer los nodos utilizados.
2. Usar un LLM barato (`flashLLM`) para generar una descripción corta analizando el JSON.
3. Crear un embedding **solo del título + descripción + nodos**, NO del JSON completo.
4. Guardarlo en `rag_templates`.

## 3. Instrucciones para Claude Code

Crea el archivo `scripts/ingest-n8n-repos.ts` (ejecutable con `tsx` o `ts-node`) que implemente el siguiente pipeline:

1.  **Configuración:**
    - Recibir un argumento por línea de comandos con el path del directorio a procesar (ej. `pnpm ingest ./tmp/awesome-n8n-templates`).
    - Recorrer recursivamente todos los archivos `.json` en ese directorio.

2.  **Parseo del JSON de n8n:**
    - Leer y parsear el archivo.
    - Extraer el array de `nodes` e iterar sobre él para obtener los tipos de integración.
      *(Ej: Extraer `"n8n-nodes-base.googleSheets"`, `"n8n-nodes-base.slack"`).*
    - Eliminar prefijos comunes, por ejemplo limpiar a `["googleSheets", "slack"]`.
    - Eliminar duplicados (`Set`).
    - Guardar el nombre original del flujo (del archivo JSON o del campo `name` si existe).

3.  **Generación de Descripción Asistida por IA:**
    - IMPORTANTE: Muchos de estos JSON no tienen descripción humana. Usa `gemini-3.1-flash` (o `gpt-4o-mini`) pasándole el array de nodos y el nombre del archivo.
    - System prompt del generador: *"Eres un experto en n8n. Analiza estos nodos y dime en 1 sola frase corta y en español qué hace esta automatización. No expliques cómo funciona, solo qué logra."*

4.  **Generación de Embedding (El Truco Anti-Alucinación):**
    - Crea el `embeddingText` concatenando el Nombre, la Descripción generada por la IA, y los Nodos extraídos.
    - **CRÍTICO:** NO incluyas el cuerpo del JSON en este `embeddingText`. Si lo haces, confundirás al modelo de recuperación vectorial.
    - Usa `OpenAIEmbeddings` (`text-embedding-3-small`) en la cadena concatenada.

5.  **Upsert Masivo en Supabase:**
    - Inserta/Actualiza en la tabla `rag_templates`:
      ```typescript
      {
        title: jsonName,
        description: aiConditionedDescription,
        tools_involved: extractedNodesArray,
        flow_template: rawJsonBody, // ¡Se guarda el JSON nativo completo sin hacerle embedding!
        embedding: generatedEmbedding
      }
      ```
    - Usa lotes (`batch`) de 10 en 10 para no superar rate limits de OpenAI o Gemini durante la ingesta masiva.

## Testing Strategy
- Ejecutar el script apuntando a una carpeta con 3 archivos JSON válidos descargados de GitHub.
- Verificar en Supabase (`rag_templates`) que se hayan creado los 3 registros.
- Comprobar que el campo `description` contenga una oración coherente en español generada vía LLM.
- Verificar que el campo `tools_involved` contenga el array de nombres limpios, como `["gmailTrigger", "googleSheets"]`.
- Validar mediante el portal de Supabase que el campo `flow_template` sigue siendo un objeto JSON válido y que la columna de vector (`embedding`) tiene datos.
