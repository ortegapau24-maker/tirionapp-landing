# Prompt 02: Configuración de Base de Datos y Tipado (Supabase)

**Objetivo:** Configurar el esquema de la base de datos en Supabase, establecer las políticas de seguridad (RLS) clave y generar los tipos de TypeScript para la aplicación.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 2 de 11**. NO configures el cliente de Supabase en la app, NO implementes autenticación, NO crees agentes de IA. Solo el esquema SQL de la base de datos, las políticas RLS, y la generación de tipos de TypeScript.

---

## 1. Contexto para la BD
La aplicación guardará información sobre los usuarios, los proyectos o negocios que cada usuario registra, las entrevistas realizadas por la IA, las automatizaciones generadas (tanto internas como para Make/n8n) y los datos vectoriales para el sistema RAG de la IA Arquitecta.

El esquema debe estar optimizado para PostgreSQL usando las capacidades nativas de Supabase (Autenticación, Row Level Security y pgvector).

## 2. Definición del Esquema Avanzado (Tablas Principales y Relaciones)

Deberás crear y ejecutar los scripts SQL en Supabase para las siguientes tablas, asegurando que estén preparadas para un entorno de producción B2B:

1.  **`users`** (Extendiendo la tabla oculta `auth.users` de Supabase):
    - `id` (UUID, PK, referencia CASCADE a `auth.users.id`)
    - `email` (Text, Unique)
    - `full_name` (Text)
    - `company_name` (Text, Nullable)
    - `subscription_tier` (Text: `'starter'`, `'growth'`, `'scale'`, default: `'starter'`) — deben coincidir exactamente con los planes de Stripe de la landing.
    - `credits_remaining` (Integer, ejecuciones disponibles según el plan, default: 1000)
    - `stripe_customer_id` (Text, Nullable — se rellena tras el primer Checkout en el Prompt 11. Imprescindible para crear futuras sesiones de Stripe para el mismo customer).
    - `created_at` (Timestamptz, default now())

2.  **`projects`** (Negocios o departamentos que el usuario quiere automatizar):
    - `id` (UUID, PK)
    - `user_id` (UUID, FK a `users` en CASCADE)
    - `name` (Text, ej: "Atención al Cliente Whatsapp")
    - `industry` (Text)
    - `description` (Text, contexto que leerá la IA para entender este negocio)
    - `tools_used` (Text[], array de herramientas que el usuario declara usar)
    - `status` (Text: 'active', 'archived')
    - `created_at` (Timestamptz)
    - `updated_at` (Timestamptz)

3.  **`integrations`** (Credenciales y tokens OAuth de herramientas externas por proyecto):
    - `id` (UUID, PK)
    - `project_id` (UUID, FK a `projects` en CASCADE)
    - `provider` (Text, ej: 'google', 'slack', 'twilio', 'hubspot')
    - `status` (Text: 'connected', 'disconnected', 'error')
    - `credentials` (JSONB, **OBLIGATORIO encriptar mediante pgsodium**. Las credenciales OAuth en texto plano son un riesgo crítico S1 en un producto B2B. Nunca almacenar tokens en claro.)
    - `created_at` (Timestamptz)
    - `updated_at` (Timestamptz)
    - *Constraint:* `UNIQUE(project_id, provider)`

4.  **`interviews`** (Estado completo de LangGraph para la captura de requisitos):
    - `id` (UUID, PK)
    - `project_id` (UUID, FK a `projects` en CASCADE)
    - `status` (Text: 'in_progress', 'needs_user_input', 'consultation_done', 'architect_done', 'approved', 'rejected')
    - `langgraph_thread_id` (Text, para retomar el estado exacto del grafo en el backend)
    - `conversation_history` (JSONB, array de mensajes usuario/IA)
    - `extracted_requirements` (JSONB, necesidades destiladas y validadas por la IA Consultora)
    - `architect_proposal` (JSONB, la propuesta técnica de la IA Arquitecta que el usuario debe aprobar)
    - `created_at` (Timestamptz)
    - `updated_at` (Timestamptz)

5.  **`automations`** (Flujos ejecutables generados):
    - `id` (UUID, PK)
    - `project_id` (UUID, FK a `projects` en CASCADE)
    - `interview_id` (UUID, FK a `interviews` Nullable)
    - `name` (Text)
    - `description` (Text, resumen amigable para el usuario)
    - `status` (Text: 'draft', 'active', 'paused', 'failed_validation')
    - `engine` (Text: 'n8n', default: 'n8n')
    - `trigger_config` (JSONB, ej: `{ "type": "webhook", "path": "/wh/123", "method": "POST" }`)
    - `flow_definition` (JSONB, el AST o definición exacta de los pasos a ejecutar en formato n8n)
    - `n8n_workflow_id` (Text, ID del workflow desplegado en la instancia de n8n)
    - `created_at` (Timestamptz)
    - `updated_at` (Timestamptz)

6.  **`automation_runs`** (Logs detallados de facturación y debugging):
    - `id` (UUID, PK)
    - `automation_id` (UUID, FK a `automations` en CASCADE)
    - `status` (Text: 'success', 'failed', 'running', 'timeout')
    - `started_at` (Timestamptz)
    - `completed_at` (Timestamptz)
    - `execution_ms` (Integer, duración)
    - `credits_consumed` (Integer, para el modelo de negocio)
    - `logs` (JSONB, traza detallada de cada paso)
    - `error_message` (Text, null si success)

7.  **`rag_templates`** (Knowledge Base para la IA Arquitecta usando pgvector):
    - `id` (UUID, PK)
    - `title` (Text)
    - `description` (Text, lo que buscará semánticamente el RAG)
    - `tools_involved` (Text[])
    - `difficulty` (Text: 'beginner', 'intermediate', 'advanced')
    - `flow_template` (JSONB, la plantilla técnica base)
    - `embedding` (`vector(1536)`, **dimensión exacta requerida por `text-embedding-3-small` de OpenAI**. Si se usa otro modelo, este valor DEBE actualizarse.)

8.  **`llm_usage`** (Tracking inmutable de costos de LLM por petición):
    - `id` (UUID, PK)
    - `user_id` (UUID, FK a `users` en CASCADE)
    - `interview_id` (UUID, FK a `interviews`, Nullable)
    - `agent` (Text: 'guardrail', 'consultant', 'architect', 'generator', 'validator', 'security')
    - `model` (Text, ej: 'gemini-3.1-flash', 'claude-sonnet-4-6')
    - `tokens_in` (Integer)
    - `tokens_out` (Integer)
    - `cost_usd` (Numeric(10,6), costo estimado en USD)
    - `latency_ms` (Integer)
    - `created_at` (Timestamptz, default now())
    - *Esta tabla NO tiene RLS activo — solo accesible vía `service_role` desde el backend.*

## 3. Instrucciones Paso a Paso para Claude Code

Por favor, ejecuta los siguientes pasos:

1.  **Configuración de Supabase CLI y pgvector:**
    - Inicializa el proyecto local con Supabase CLI (`npx supabase init`).
    - Crea la primera migración (`npx supabase migration new 00000_initial_schema`).
    - En el archivo SQL, añade `CREATE EXTENSION IF NOT EXISTS vector;` al inicio.

2.  **Redacción del SQL (Esquema, Funciones y Triggers):**
    - Escribe el SQL para crear todas las tablas descritas arriba con sus Foreign Keys explícitas y `ON DELETE CASCADE` donde corresponda.
    - Crea un trigger automático en PostgreSQL que, al insertar una nueva fila en `auth.users` (gestionado por Supabase Auth), inserte automáticamente un registro en la tabla pública `users` con el mismo ID y email.
    - Crea un trigger para actualizar automáticamente el campo `updated_at` en las tablas que lo requieran.
    - Crea la función `decrement_credits(p_user_id UUID, p_run_id UUID)` como función RPC de PostgreSQL. Debe verificar primero que el `p_run_id` no haya sido procesado previamente (idempotencia), luego decrementar `credits_remaining` en 1 atómicamente y retornar el número restante. Si `credits_remaining <= 0`, debe levantar una excepción (`RAISE EXCEPTION`) para que la app pueda manejar el error devolviendo HTTP 402. La idempotencia previene decrementos duplicados en caso de reintentos de webhooks.

3.  **Creación de Índices Explícitos (Performance):**
    - **OBLIGATORIO.** Sin índices explícitos, las queries del Dashboard (Prompt 09) serán lentas con volumen. Crear:
      ```sql
      CREATE INDEX idx_projects_user_id ON projects(user_id);
      CREATE INDEX idx_automations_project_id ON automations(project_id);
      CREATE INDEX idx_automation_runs_automation_id ON automation_runs(automation_id);
      CREATE INDEX idx_automation_runs_status ON automation_runs(status);
      CREATE INDEX idx_interviews_project_id ON interviews(project_id);
      CREATE INDEX idx_integrations_project_id ON integrations(project_id);
      CREATE INDEX idx_llm_usage_user_id ON llm_usage(user_id);
      ```

3.  **Configuración Estricta de RLS (Row Level Security):**
    - Habilita RLS en TODAS las tablas (`ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;`).
    - `users`: El usuario validado (`auth.uid() = id`) puede ver y actualizar su propia fila.
    - `projects`: El usuario puede ver/editar/borrar donde `user_id = auth.uid()`.
    - `integrations`, `interviews`, `automations`: El usuario puede ver/editar donde `project_id` pertenezca a sus proyectos (requerirá subconsultas tipo `EXISTS (SELECT 1 FROM projects WHERE id = project_id AND user_id = auth.uid())`).
    - `automation_runs`: Igual que el anterior, accesible a través de su `automation_id`.
    - `rag_templates`: Acceso público de lectura (o autenticado pero read-only para los usuarios), inserción solo reservada al rol `service_role`.

4.  **Generación de Tipos (TypeScript):**
    - Añade un script en el `package.json` (`"supabase:types": "supabase gen types typescript --local > src/types/database.types.ts"`).
    - Ejecuta el script para generar el archivo `database.types.ts`.

5.  **Verificación Final:**
    - Verifica que el archivo generado no tenga errores de TypeScript.
    - Comprueba que la migración se aplica correctamente localmente ejecutando `npx supabase db reset`.

---
**Nota para la IA:** En este paso tu objetivo principal es dejar la base de datos completamente modelada, segura (RLS), con índices optimizados, y con un tipado estricto (TypeScript) listo para que las APIs y los Agentes de IA puedan interactuar con ella en los siguientes pasos. La tabla `llm_usage` es crucial para la visibilidad de costos del negocio.

## Testing Strategy
- Verificar que la migración se aplica sin errores: `npx supabase db reset`.
- Verificar que `decrement_credits` es idempotente (llamar 2 veces con el mismo `run_id` solo decrementa 1 vez).
- Verificar que las políticas RLS impiden que un usuario vea datos de otro.
- Verificar que `database.types.ts` se genera sin errores de TypeScript.
- Verificar que los índices existen: `SELECT indexname FROM pg_indexes WHERE tablename = 'automations'`.
