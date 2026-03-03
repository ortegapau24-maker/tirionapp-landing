# Prompt 01: Inicialización del Proyecto (Setup Base de la App)

**Objetivo:** Crear la estructura base del repositorio exclusivo para la aplicación principal (Dashboard de usuario, Chat de Onboarding y lógica core de IA), separada de la landing page.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 1 de 11** de una serie de prompts sucesivos. Implementa Únicamente lo que se especifica en este documento. NO crees base de datos, NO implementes agentes de IA, NO configures autenticación. Solo el scaffold del proyecto Next.js y la estructura de carpetas. El resto se tratará en los prompts siguientes.

---

## 1. Contexto del Proyecto
Vamos a construir una plataforma SaaS donde los usuarios son entrevistados por una IA, la cual detecta oportunidades de automatización en sus negocios y genera flujos de trabajo funcionales. 

La landing page ya existe en un repositorio independiente. Este nuevo repositorio estará dedicado al 100% a la aplicación interactiva que el usuario utiliza tras registrarse o hacer clic en "Empezar" en la landing.

## 2. Tecnologías y Herramientas a utilizar
- **Framework Principal:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes UI:** shadcn/ui
- **Gestor de Paquetes:** pnpm (recomendado)
- **Linter/Formatter:** ESLint + Prettier

## 3. Arquitectura Inicial del Repositorio
Crea la siguiente estructura base dentro de la carpeta raíz del nuevo proyecto Next.js:

```text
/
├── src/
│   ├── app/                (Rutas de Next.js: /dashboard, /chat, /api)
│   ├── components/         (Componentes de la interfaz)
│   │   ├── ui/             (Componentes base de shadcn/ui)
│   │   └── shared/         (Componentes reutilizables propios)
│   ├── lib/                (Utilidades compartidas, clientes DB, utils)
│   │   ├── supabase/       (Clientes SSR - se crearán en Prompt 03)
│   │   └── security/       (Módulos DLP y Guardrail - se crearán en Prompt 10)
│   ├── agents/             (Definición de agentes de IA y LangGraph - Prompt 04)
│   │   ├── nodes/
│   │   └── rag/
│   └── backend/            (Lógica pesada separada de /app/api)
│       └── n8n/            (Conectores a n8n - se crearán en Prompt 07)
├── scripts/              (Scripts de seeding, CLI tools - Prompt 05)
├── public/
├── .env.local            (Variables de entorno - NO commitear)
├── .env.example          (Plantilla de variables de entorno - sí commitear)
├── .nvmrc                (Versión de Node.js fijada, ej: `22`)
├── package.json
└── README.md
```

## 4. Instrucciones Paso a Paso para Claude Code

Por favor, ejecuta los siguientes pasos en orden para inicializar el proyecto de la aplicación:

0.  **Pre-requisito (Acción Manual — No Código):**
    > El desarrollador humano debe realizar esto ANTES de ejecutar cualquier comando.
    > 1. Crear un nuevo repositorio GitHub llamado `tirionapp` (separado del repo de la landing `tirionapp-landing`).
    > 2. Clonar el repo vacío localmente y situarse dentro del directorio.
    > 3. Crear un nuevo proyecto en **Vercel** y conectarlo a este repo de GitHub.
    > 4. El subdominio de producción de la app es **`app.tirionapp.com`**. Configurar este dominio en Vercel → Settings → Domains una vez el proyecto esté creado.
    > 5. En Vercel → Settings → Environment Variables, copiar todas las variables del `.env.local` una vez se tengan los valores reales.

1.  **Inicialización de Next.js:**
    - Ejecuta el siguiente comando (no-interactivo, flags exactos):
      ```bash
      npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
      ```
    - Esto creará el proyecto con TypeScript, Tailwind CSS, ESLint, y App Router en el directorio actual.

2.  **Configuración de Herramientas UI (shadcn/ui):**
    - Inicializa `shadcn-ui` (normalmente con `npx shadcn-ui@latest init`).
    - Configura las rutas para que los componentes se instalen en `src/components/ui` y las utilidades en `src/lib/utils.ts`.
    - Instala e importa al menos un componente base (por ejemplo, `button`) para asegurar que la configuración es correcta.

3.  **Creación de la Estructura de Carpetas del Dominio:**
    - Dentro de `src/`, crea manualmente los directorios: `agents/nodes/`, `agents/rag/`, `backend/n8n/`, `lib/supabase/`, `lib/security/`, `components/chat/cards/`, `components/dashboard/`.
    - Crea archivos `.gitkeep` vacíos dentro de cada carpeta nueva para asegurar que se incluyen en el commit inicial.

4.  **Configuración de Strict Mode y Prettier:**
    - En `tsconfig.json`, verifica que `"strict": true` esté dentro de `compilerOptions`. Si no está, añádelo.
    - Crea `.prettierrc` en la raíz con la siguiente configuración estándar:
      ```json
      { "semi": false, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5" }
      ```
    - Instala Prettier como devDependency: `pnpm add -D prettier eslint-config-prettier`.

5.  **Validación de Variables de Entorno al Startup (Zod):**
    - Crea `src/lib/env.ts`.
    - Implementa un schema Zod que valide TODAS las variables de entorno requeridas al importar el módulo. Si falta alguna variable obligatoria, la app debe fallar inmediatamente con un error legible:
      ```ts
      import { z } from 'zod'

      const envSchema = z.object({
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
        SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
        NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
        OPENAI_API_KEY: z.string().min(1),
        ANTHROPIC_API_KEY: z.string().min(1),
        GOOGLE_API_KEY: z.string().min(1),
        // ... todas las demás variables del .env.local
      })

      export const env = envSchema.parse(process.env)
      export type Env = z.infer<typeof envSchema>
      ```
    - **IMPORTANTE:** A partir de ahora, todos los prompts deben usar `env.VARIABLE` en lugar de `process.env.VARIABLE` para garantizar tipado estricto.

6.  **Utilidades de API estandarizadas:**
    - Crea `src/lib/api/errors.ts` con la clase `ApiError` y el helper `handleApiError()`:
      ```ts
      export class ApiError extends Error {
        constructor(
          public readonly statusCode: number,
          public readonly code: string,
          message: string,
          public readonly details?: unknown
        ) { super(message) }
      }

      export function handleApiError(error: unknown): Response {
        if (error instanceof ApiError) {
          return Response.json(
            { error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) } },
            { status: error.statusCode }
          )
        }
        console.error('[API Error] Unhandled:', error)
        return Response.json(
          { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
          { status: 500 }
        )
      }
      ```
    - Crea `src/lib/api/response.ts` con la función `apiSuccess()` para respuestas estandarizadas:
      ```ts
      export function apiSuccess<T>(data: T, meta?: PaginationMeta, status = 200): Response {
        return Response.json({ data, ...(meta ? { meta } : {}) }, { status })
      }
      ```
    - **IMPORTANTE:** Todos los Route Handlers de los prompts 04-11 deben usar `apiSuccess()` para éxitos y `handleApiError()` en sus bloques catch.

4.  **Configuración de Variables de Entorno:**
    - Crea el archivo `.env.local` en la raíz del proyecto con las próximas variables que se irán necesitando. Por ahora, déjalas vacías:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=
      NEXT_PUBLIC_SUPABASE_ANON_KEY=
      SUPABASE_SERVICE_ROLE_KEY=
      NEXT_PUBLIC_APP_URL=http://localhost:3000
      # En producción (Vercel), esta variable debe ser: https://app.tirionapp.com
      OPENAI_API_KEY=
      ANTHROPIC_API_KEY=
      GOOGLE_API_KEY=
      LLM_FLASH=gemini-3.1-flash
      LLM_SONNET=claude-sonnet-4-6
      LLM_OPUS=claude-opus-4-6
      LLM_POWER=gpt-5.2
      N8N_HOST=
      N8N_API_KEY=
      N8N_CALLBACK_SECRET=
      STRIPE_SECRET_KEY=
      STRIPE_WEBHOOK_SECRET=
      STRIPE_PRICE_STARTER=
      STRIPE_PRICE_GROWTH=
      STRIPE_PRICE_SCALE=
      UPSTASH_REDIS_REST_URL=
      UPSTASH_REDIS_REST_TOKEN=
      ```
    - Crea también `.env.example` copiando el mismo contenido (sin valores reales) para que sea commitable.

7.  **Archivo `.nvmrc` y Script de Typecheck:**
    - Crea `.nvmrc` con el contenido `22` (o la versión de Node.js que uses).
    - Añade al `package.json` los siguientes scripts adicionales:
      ```json
      {
        "scripts": {
          "typecheck": "tsc --noEmit",
          "validate": "pnpm lint && pnpm typecheck && pnpm build"
        }
      }
      ```

5.  **Numeración corregida — Limpieza del Template:**
    - Limpia la página inicial `src/app/page.tsx` dejando solo un mensaje simple (ej. "TirionApp - Core Application").
    - Elimina variables y estilos innecesarios del template en `globals.css` (manteniendo las directivas de Tailwind).
    - Crea las páginas de error globales de Next.js App Router:
      - `src/app/error.tsx`: Componente de error global (Client Component). Muestra un mensaje amigable con botón "Volver a intentar" que llame a `reset()`. **Debe usar las variables CSS `--agency-*` definidas en el Prompt 01b para mantener consistencia visual.**
      - `src/app/not-found.tsx`: Página 404 personalizada con enlace de vuelta a `/dashboard`. **Mismo requisito de design tokens.**

6.  **Verificación Final:**
    - Asegúrate de que los scripts `dev`, `build` y `lint` en `package.json` funcionen correctamente.
    - Documenta en el `README.md` principal las instrucciones básicas para levantar este entorno de desarrollo.

---
**Nota para la IA:** No es necesario que implementes la base de datos ni la lógica de LangGraph o los agentes en este paso. Concéntrate exclusivamente en inicializar Next.js con Tailwind/shadcn, definir la estructura de carpetas, crear el archivo `.env.local` y `.env.example`, la validación de env vars con Zod, y las utilidades de API estandarizadas (`ApiError`, `apiSuccess`). Estos patrones serán reutilizados en TODOS los prompts siguientes.

## Testing Strategy
- Verificar que `pnpm dev` arranca sin errores.
- Verificar que `pnpm typecheck` pasa sin errores.
- Verificar que `pnpm lint` pasa sin errores.
- Verificar que importar `env` falla con un error claro si faltan variables.
