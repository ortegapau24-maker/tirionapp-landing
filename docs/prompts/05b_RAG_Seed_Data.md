# Prompt 05b: Seed Data & n8n RAG Templates

**Objetivo:** Definir la estructura exacta de los objetos JSON de n8n que se insertarán como seed data en el sistema RAG. Si la base de conocimiento contiene JSONs malformados, el Agente Arquitecto aprenderá a generar flujos rotos.

---

> ⚠️ **IMPORTANTE:**
> Este prompt actúa como anexo al Prompt 05. Define **QUÉ** se guarda en la tabla `rag_templates`, para que el RAG tenga datos útiles de los que aprender.

---

## 1. El Problema (Contexto)

El Agente Arquitecto (Prompt 04) usará RAG (Prompt 05) para buscar plantillas probadas.
Si en el seed data ponemos descripciones de texto plano (ej. "Usa el nodo de Gmail y luego el de Sheets"), el LLM (gpt-5.2) intentará adivinar la sintaxis JSON interna de n8n, y probablemente fallará.

Para que el Generator (Prompt 04) produzca un JSON válido listo para el deploy (Prompt 06), el seed data debe contener **el JSON real de n8n** en el campo `flow_template`.

## 2. Estructura de un Template n8n (Lo que el LLM debe aprender)

El sistema RAG debe enseñar al LLM esta estructura base:

```json
{
  "name": "Nombre descriptivo",
  "nodes": [
    {
      "parameters": { ... },
      "name": "Nombre único del nodo",
      "type": "n8n-nodes-base.nombre_de_la_integracion",
      "typeVersion": 1,
      "position": [250, 300]
    }
  ],
  "connections": {
    "Nodo Origen": {
      "main": [
        [
          {
            "node": "Nodo Destino",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 3. Seed Data OBLIGATORIO (Para el script `scripts/seed-rag.ts`)

El script `scripts/seed-rag.ts` (mencionado en el Prompt 05) DEBE insertar exactamente estos 3 registros en la tabla `rag_templates`.

### Template 1: Procesamiento de Datos en Google Sheets

- **Title:** Google Sheets Data Processing Template
- **Description:** Verifica si hay datos en una hoja, los procesa mapeando columnas, los escribe en otra hoja, y genera un resumen del proceso finalizando con un log de completion.
- **Tools involved:** `["googleSheets", "if", "code", "set", "noOp"]`
- **Flow Template:**
```json
{
  "name": "Google Sheets Data Processing",
  "nodes": [
    {
      "parameters": {
        "operation": "getAll",
        "documentId": { "__rl": true, "value": "YOUR_GOOGLE_SHEET_ID", "mode": "id" },
        "sheetName": { "__rl": true, "value": "Sheet1", "mode": "list" }
      },
      "id": "get-sheet-data",
      "name": "Get Sheet Data",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.4,
      "position": [240, 300]
    },
    {
      "parameters": {
        "conditions": { "string": [{ "value1": "={{ $json.length }}", "operation": "isNotEmpty" }] }
      },
      "id": "check-data-exists",
      "name": "Check Data Exists",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "const data = $input.all(); const processedData = []; for (const item of data) { const row = item.json; const processedRow = { id: row[0] || '', name: row[1] ? row[1].toString().trim() : '', status: row[3] || 'pending' }; processedData.push(processedRow); } return processedData.map(item => ({ json: item }));"
      },
      "id": "process-data",
      "name": "Process Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 200]
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": { "__rl": true, "value": "YOUR_GOOGLE_SHEET_ID", "mode": "id" },
        "sheetName": { "__rl": true, "value": "Processed", "mode": "list" },
        "columns": {
          "mappingMode": "defineBelow",
          "value": { "id": "={{ $json.id }}", "name": "={{ $json.name }}", "status": "={{ $json.status }}" }
        },
        "options": { "useAppend": true }
      },
      "id": "write-processed-data",
      "name": "Write Processed Data",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.4,
      "position": [900, 200]
    }
  ],
  "connections": {
    "Get Sheet Data": { "main": [ [ { "node": "Check Data Exists", "type": "main", "index": 0 } ] ] },
    "Check Data Exists": { "main": [ [ { "node": "Process Data", "type": "main", "index": 0 } ] ] },
    "Process Data": { "main": [ [ { "node": "Write Processed Data", "type": "main", "index": 0 } ] ] }
  }
}
```

### Template 2: Asana Webhook Automation

- **Title:** Webhook para creación de tareas en Asana
- **Description:** Workflow listo para producción que recibe payloads por Webhook POST, crea tareas en Asana utilizando un nodo parametrizado, setea variables y finaliza con un Error Handler.
- **Tools involved:** `["webhook", "asana", "set", "stopAndError"]`
- **Flow Template:**
```json
{
  "name": "Production Webhook to Asana",
  "nodes": [
    {
      "parameters": {
        "path": "asana",
        "options": { "responsePropertyName": "response" },
        "responseMode": "lastNode"
      },
      "id": "node-webhook",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 500]
    },
    {
      "parameters": {
        "name": "={{$json[\"query\"][\"parameter\"]}}",
        "workspace": "",
        "otherProperties": {}
      },
      "id": "node-asana",
      "name": "Asana",
      "type": "n8n-nodes-base.asana",
      "typeVersion": 1,
      "position": [450, 500]
    },
    {
      "parameters": {
        "values": {
          "string": [ { "name": "response", "value": "=Created Asana Task: {{$json[\"permalink_url\"]}}" } ]
        },
        "options": {}
      },
      "id": "node-set",
      "name": "Set",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [650, 500]
    },
    {
      "parameters": {
        "message": "Workflow execution error",
        "options": {}
      },
      "id": "node-error",
      "name": "Error Handler",
      "type": "n8n-nodes-base.stopAndError",
      "typeVersion": 1,
      "position": [1000, 400]
    }
  ],
  "connections": {
    "Webhook": { "main": [ [ { "node": "Asana", "type": "main", "index": 0 } ] ] },
    "Asana": { "main": [ [ { "node": "Set", "type": "main", "index": 0 } ] ] }
  },
  "settings": { "executionTimeout": 3600, "retryOnFail": true, "retryCount": 3 }
}
```

### Template 3: Pago de Stripe a Notificación en Slack

- **Title:** Alerta de nuevo pago de Stripe en Slack
- **Description:** Se activa cuando Stripe envía un evento de pago exitoso (webhook interno) y usa un nodo If para validar montos antes de enviar a Slack.
- **Tools involved:** `["stripe", "if", "slack"]`
- **Flow Template:**
```json
{
  "name": "Stripe to Slack",
  "nodes": [
    {
      "parameters": { "events": ["charge.succeeded"] },
      "id": "node-stripe",
      "name": "Stripe Trigger",
      "type": "n8n-nodes-base.stripeTrigger",
      "typeVersion": 1,
      "position": [200, 300]
    },
    {
      "parameters": {
        "conditions": { "number": [{ "value1": "={{$json.amount}}", "operation": "larger", "value2": 1000 }] }
      },
      "id": "node-if",
      "name": "If > $10",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [400, 300]
    },
    {
      "parameters": {
        "channel": "#sales",
        "text": "=Nuevo pago Premium recibido por {{$json.amount / 100}} {{$json.currency}} de {{$json.billing_details.email}}!"
      },
      "id": "node-slack",
      "name": "Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2,
      "position": [600, 200]
    }
  ],
  "connections": {
    "Stripe Trigger": { "main": [ [ { "node": "If > $10", "type": "main", "index": 0 } ] ] },
    "If > $10": { "main": [ [ { "node": "Slack", "type": "main", "index": 0 } ] ] }
  }
}
```

## 4. Instrucciones para Claude Code

1.  Asegúrate de que la tabla `rag_templates` (Prompt 02) tenga un campo `flow_template` de tipo `JSONB`.
2.  En el archivo `scripts/seed-rag.ts` (Prompt 05), inserta EXACTAMENTE los 3 objetos JSON descritos arriba en el campo `flow_template`.
3.  Genera el embedding usando el `title` + `description` + `tools_involved` (convertido a string). No es necesario generar embedding del JSON interno, ya que el RAG buscará por intención humana, no por sintaxis JSON.

## Testing Strategy
- Verificar que el script `seed-rag.ts` no lanza errores de sintaxis JSON.
- Ir a la base de datos Supabase, tabla `rag_templates` y verificar que la columna `flow_template` contiene JSON válido (no strings escapados).
- Verificar que el nodo Generator (Prompt 04) es capaz de replicar esta misma estructura de `nodes` y `connections` al inyectársele uno de estos templates como contexto.
