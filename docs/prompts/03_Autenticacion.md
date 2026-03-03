# Prompt 03: Autenticación y Rutas Privadas

**Objetivo:** Configurar el sistema de autenticación utilizando Supabase Auth en Next.js (App Router), proteger las rutas privadas mediante Middleware y enlazar la creación de usuarios con nuestra tabla pública `users`.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 3 de 11**. Solo implementa el sistema de autenticación (Supabase Auth, middleware de protección de rutas, y las UIs de login/registro/reset). NO implementes la lógica del chat, agentes de IA ni el dashboard. El resto llega en prompts sucesivos.

---

## 1. Contexto de la Autenticación (Nivel Producción)
Dado que hemos configurado todo el esquema de BD en Supabase (Prompt 02), es lógico y eficiente utilizar **Supabase Auth** para gestionar de forma segura el registro, login y sesiones de los usuarios. 

Para que este módulo sea **Production Ready B2B**, debe cubrir:
1. **Flujos Completos:** Login, Registro, Recuperación de Contraseña (Forgot Password) y Verificación de Email (Magic Links / Confirmations).
2. **OAuth Providers:** Habilitar al menos Google OAuth como alternativa "One-Click" (estándar B2B).
3. **Sincronización de Perfiles:** Cuando Supabase Auth registra un usuario, nuestro trigger ya crea la fila en `public.users`. El frontend debe poder leer no solo la sesión de `auth`, sino también los datos de la fila `public.users` (como `credits_remaining` y `company_name`).
4. **Protección Multicapa:** 
   - **Middleware:** Redirecciones a nivel de Edge (impide renderizar páginas de Dashboard si no hay sesión).
   - **Server Actions & API Routes:** Protección nativa en el servidor (validando tokens reales antes de mutar la BD).
   - **Rate Limiting de Login:** Limitar a **5 intentos por email cada 15 minutos** para prevenir ataques de brute force. No esperar al Prompt 10 para esto.
5. **UX / UI Robusta:** Manejo de estados de carga (Spinners), notificaciones de error claras (Toasts cuando un email ya existe o clave errónea) e inyecciones CSRF si aplican.
6. **Validación del redirectTo de OAuth:** El `redirectTo` del OAuth DEBE validarse contra un allowlist de dominios permitidos (`localhost:3000`, `app.tirionapp.com`). Un open redirect no validado es un vector de phishing.
7. **Audit Log mínimo:** Registrar en consola estructurada (JSON): `login_success`, `login_failed`, `password_reset_requested`, `oauth_callback_processed`. En B2B enterprise esto es requisito de compliance.

## 2. Herramientas a utilizar
- `@supabase/ssr` (Librería oficial para Server-Side Rendering de Next.js App Router).
- `@supabase/supabase-js`.
- Componentes UI de `shadcn/ui` (formularios con `react-hook-form` + `zod` para validación estricta, botones, inputs y `toast` para notificaciones).

## 3. Entregables Esperados
Deberás crear/modificar los siguientes archivos en la carpeta `src/` tu aplicación:

- `lib/supabase/server.ts`: Cliente SSR para Server Components y Server Actions.
- `lib/supabase/client.ts`: Cliente SSR para Client Components.
- `lib/supabase/middleware.ts`: Helper para refrescar la sesión en Edge.
- `lib/auth/utils.ts`: Funciones helper (ej. `getUserProfile()` que retorna el join entre `auth.users` y `public.users`).
- `middleware.ts`: El middleware global de Next.js protegiendo rutas.
- `app/(auth)/layout.tsx`: Layout minimalista y limpio.
- `app/(auth)/login/page.tsx`: UI de Login (User/Pass + OAuth).
- `app/(auth)/register/page.tsx`: UI de Registro.
- `app/(auth)/forgot-password/page.tsx`: UI para resetear contraseña.
- `app/(auth)/reset-password/page.tsx`: UI de confirmación tras clickar link del email.
- `app/auth/callback/route.ts`: Endpoint robusto para intercambiar el código seguro de Supabase y redirigir (handling de errores de link expirado).

## 4. Instrucciones Paso a Paso para Claude Code

Por favor, ejecuta los siguientes pasos en orden:

1.  **Instalación y Setup Base:**
    - Verifica que el `.env.local` (creado en Prompt 01) contenga:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
      NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
      SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
      ```
    - Ejecuta `pnpm add @supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers/zod`.
    - Instaura los componentes de UI necesarios: `npx shadcn-ui@latest add form input button label toast`.

2.  **Configuración de Clientes SSR (Type-Safe):**
    - En `src/lib/supabase/`, implementa `client.ts` (`createBrowserClient`) y `server.ts` (`createServerClient`) utilizando cookies en Next.js.
    - Asegúrate de pasar el genérico `<Database>` desde `src/types/database.types.ts` a cada cliente para tipado estricto.
    - Implementa `middleware.ts` exportando `updateSession` que modifique las cookies de la respuesta HTTP de manera segura (manejo de CSRF implícito en las cookies modernas).

3.  **Middleware y Helper de Perfil Público:**
    - Crea `src/middleware.ts`. Intercepta peticiones:
      - **`/chat/*` requiere autenticación obligatoria sin excepciones.** Nunca permitir acceso de "guest" o anónimo a ninguna ruta que interaccione con los LLMs. Cada mensaje del chat consume tokens y es un vector de prompt injection. Redirige a `/login?next=/chat` si no hay sesión.
      - Expulsa no logueados de `/dashboard/*` y `/api/private/*` mandándolos a `/login?next=ruta_actual`.
      - Redirige logueados intentando entrar a `/login` hacia `/dashboard`.
    - En `src/lib/auth/utils.ts`, crea un helper asíncrono `getAuthUser()` que, mediante el cliente de servidor, haga fetch tanto a `supabase.auth.getUser()` como a la tabla `public.users`. Esto asegura que en el backend tienes acceso inmediato a `credits_remaining`, el plan actual, etc.

4.  **Interfaces de UI (Zod + React Hook Form):**
    - Crea un Layout en `src/app/(auth)/layout.tsx` (fondo sutil, panel centrado).
    - Crea `register/page.tsx`: Implementa `react-hook-form` con `zod` para exigir contraseñas robustas:
      - Mínimo 8 caracteres
      - Al menos 1 mayúscula
      - Al menos 1 número
      - Al menos 1 carácter especial (`!@#$%^&*`)
      Recoger también `company_name`. Llama a `supabase.auth.signUp()`. Maneja los `toast.error()` si el email ya existe.
    - Crea `login/page.tsx`: Integrado con Server Actions o fetches al cliente. Debe incluir un separador clásico "O continúa con..." y un botón "Login with Google" (llamando a `signInWithOAuth`).
    - **Para el OAuth de Google:** El `redirectTo` debe ser `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`.
      - **En desarrollo (`.env.local`):** `NEXT_PUBLIC_APP_URL=http://localhost:3000`
      - **En producción (Vercel):** `NEXT_PUBLIC_APP_URL=https://app.tirionapp.com`
      - Añade `https://app.tirionapp.com/auth/callback` como URL autorizada tanto en el panel de Supabase (Authentication → URL Configuration) como en la Google Cloud Console (Credenciales → ID de Cliente OAuth → URIs de redireccionamiento autorizados).
    - Crea `forgot-password/page.tsx` para solicitar link por email (`supabase.auth.resetPasswordForEmail`).
    - Crea `reset-password/page.tsx` (destino del link) con un nuevo formulario que ejecuta `supabase.auth.updateUser({ password: newPassword })`.

5.  **Ruta de Confirmación (Callback):**
    - Implementa `src/app/auth/callback/route.ts` (API route GET). Este endpoint captura el query param `code` en callbacks de Google o correos mágicos, lo intercambia por la sesión (`exchangeCodeForSession`), e intercepta posibles errores retornando una re-dirección limpia a `/login?error=invalid_link` en caso de fallar.

6.  **Verificación Final:**
    - Deja documentada una Server Action de prueba en `src/app/dashboard/test-action.ts` que demuestre cómo verificar si la petición es legítima usando `await createServerClient()`.
    - Garantiza que al enviar el formulario `login` el botón de submit cambie a "Cargando..." y se deshabiliten los inputs para evitar duplicidad de peticiones (Best practice de UX).
    - **Manejo de email no confirmado:** Si el usuario intenta loguearse sin haber confirmado su email, mostrar un mensaje claro: "Verifica tu email para continuar" con un botón "Reenviar email de verificación" que llame a `supabase.auth.resend()`.

---
**Nota para la IA:** Tu objetivo principal es dejar el blindaje de las rutas funcionando 100%. Un usuario no autenticado jamás debe poder cargar la lógica pesada de la aplicación generadora de IA (las rutas privadas). El rate limiting del login es crítico — no esperes al Prompt 10 para implementarlo.

## Testing Strategy
- Verificar que un usuario no logueado es redirigido a `/login` al intentar acceder a `/dashboard` o `/chat`.
- Verificar que un usuario logueado es redirigido a `/dashboard` al intentar acceder a `/login`.
- Verificar que el 6º intento de login con email incorrecto en 15 min devuelve 429.
- Verificar que el `redirectTo` de OAuth solo acepta dominios del allowlist.
- Verificar que el callback `auth/callback` maneja códigos inválidos/expirados sin crash.
- Verificar que `getAuthUser()` retorna tanto datos de `auth.users` como de `public.users`.
