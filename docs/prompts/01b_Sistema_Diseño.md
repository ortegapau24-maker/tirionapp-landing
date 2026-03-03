# Prompt 01b: Sistema de Diseño UI (Design Tokens, Tema y Dark Mode)

**Objetivo:** Configurar el sistema de diseño completo de la aplicación: paleta de colores, tipografía, CSS custom properties, tema de shadcn/ui, y toggle de dark/light mode. Este prompt garantiza que la app tenga la misma estética premium que la landing page (`tirionapp-landing`).

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 1b de 11** (entre el Setup y la BD). Solo configura el sistema de diseño: tailwind.config, globals.css, shadcn theme overrides, fuente Geist y el toggle dark/light. NO implementes componentes de producto, rutas, ni lógica de negocio.

---

## 1. Referencia de Diseño

La app debe ser visualmente indistinguible de la landing en identidad de marca. El usuario pasa de `www.tirionapp.com` (landing oscura, minimalista) a `app.tirionapp.com` (app con modo claro y oscuro). La transición debe sentirse como el mismo producto.

**Principios del diseño:**
- **Minimalista y de alto contraste.** Sin ruido. Los datos mandan.
- **Botones:** Siempre negros o gris oscuro en modo oscuro. Gris muy oscuro (`#111`) en modo claro. NUNCA naranja.
- **Acento naranja** (`#ff8a00`): reservado **exclusivamente** para texto en hover (links del menú, texto clicable, estado activo de nav items). Nunca en fondos de botones.
- **Superficies grises neutras** en modo oscuro. Blancas en modo claro.
- **Tipografía:** `Geist Sans`. Pesos 400, 500, 600.
- **Border radius:** `0.625rem` base.

---

## 2. Design Tokens (Paleta exacta)

### Modo Oscuro (dark) — estética landing
```
Fondo base:        #0a0a0a  (surface.DEFAULT)
Superficie cards:  #141414  (surface.100)
Superficie elevada: #1a1a1a (surface.200)
Bordes:            #262626  (surface.300)
Bordes hover:      #404040  (surface.400)
Texto principal:   #fafafa  (surface.50)
Texto secundario:  #a3a3a3
Texto muted:       #737373
Acento naranja:    #ff8a00
Acento glow:       #ff6b00
Acento hover:      #ff9d2e
```

### Modo Claro (light)
```
Fondo base:        #ffffff
Superficie cards:  #f9f9fa
Superficie elevada: #f3f3f5
Bordes:            rgba(0, 0, 0, 0.06)
Texto principal:   #050505
Texto secundario:  #333333
Texto muted:       #666666
Acento naranja:    #ff8a00  (mismo — es el color de marca)
```

### Tokens adicionales
```
Focus ring (dark):  ring: 0 0% 60%  (gris visible sobre fondo oscuro)
Focus ring (light): ring: 0 0% 20%  (gris oscuro visible sobre fondo claro)
Transición rápida:  150ms ease      (hovers, toggles)
Transición base:    300ms ease      (animaciones de entrada/salida)
Transición suave:   500ms ease      (transiciones de página)
```

### Escala de z-index (OBLIGATORIA)
```
z-base:       0     (contenido normal)
z-sticky:     10    (headers sticky, toolbars)
z-dropdown:   20    (dropdowns, popovers)
z-modal:      30    (modals, dialogs, drawers)
z-toast:      40    (toasts, notificaciones)
z-tooltip:    50    (tooltips)
```
> Todos los componentes de shadcn/ui y los prompts 08/09 DEBEN seguir esta escala.

---

## 3. Entregables Esperados

- `tailwind.config.ts`: Paleta `surface` + `agency` + familia tipográfica Geist.
- `src/app/globals.css`: CSS custom properties para modo claro y oscuro + `@layer base` con body, headings.
- `src/components/shared/ThemeProvider.tsx`: Provider de Next Themes + toggle dark/light.
- `src/components/shared/ThemeToggle.tsx`: Botón de toggle de tema (icono sol/luna con Lucide).
- `src/app/layout.tsx` (modificación): Importar fuente Geist, `ThemeProvider`, y la clase de modo oscuro.

---

## 4. Instrucciones Paso a Paso para Claude Code

1. **Instalación de dependencias de tema:**
   ```bash
   pnpm add next-themes
   ```
   La fuente Geist ya viene incluida con Next.js (`next/font/local` o `geist` package). Usa `next/font/local` configurado con los archivos de Geist Sans y Geist Mono.

2. **`tailwind.config.ts` — Extiende con los design tokens:**
   ```ts
   import type { Config } from 'tailwindcss'

   const config: Config = {
     content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
     darkMode: 'class',
     theme: {
       extend: {
         colors: {
           surface: {
             DEFAULT: '#0a0a0a',
             50: '#fafafa',
             100: '#141414',
             200: '#1a1a1a',
             300: '#262626',
             400: '#404040',
           },
           agency: {
             accent: '#ff8a00',
             'accent-hover': '#ff9d2e',
             glow: '#ff6b00',
           },
         },
         fontFamily: {
           sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
           mono: ['var(--font-geist-mono)', 'monospace'],
         },
         borderRadius: {
           DEFAULT: '0.625rem',
         },
       },
     },
     plugins: [],
   }

   export default config
   ```

3. **`src/app/globals.css` — CSS Variables para ambos modos:**
   Define las variables en `:root` (modo claro) y `.dark` (modo oscuro). Sobreescribe las variables de shadcn/ui para que todos sus componentes (Button, Card, Input, etc.) usen automáticamente tu paleta:
   ```css
   @import "tailwindcss";

   @layer base {
     :root {
       /* shadcn semantic tokens — modo CLARO */
       --background: 0 0% 100%;
       --foreground: 0 0% 2%;
       --card: 0 0% 98%;
       --card-foreground: 0 0% 2%;
       --primary: 0 0% 7%;             /* botón primario: casi negro */
       --primary-foreground: 0 0% 100%;
       --secondary: 0 0% 94%;
       --secondary-foreground: 0 0% 7%;
       --muted: 0 0% 96%;
       --muted-foreground: 0 0% 40%;
       --accent: 0 0% 94%;             /* accent neutro gris, NO naranja */
       --accent-foreground: 0 0% 7%;
       --border: 0 0% 90%;
       --input: 0 0% 90%;
       --ring: 0 0% 20%;               /* ring del focus: gris oscuro */
       --radius: 0.625rem;
       --destructive: 0 84% 60%;

       /* Agency custom tokens — modo CLARO */
       --agency-bg: #ffffff;
       --agency-surface: #f9f9fa;
       --agency-surface-elevated: #f3f3f5;
       --agency-border: rgba(0, 0, 0, 0.06);
       --agency-text-main: #050505;
       --agency-text-secondary: #333333;
       --agency-text-muted: #666666;
       --agency-accent: #ff8a00;        /* solo para texto hover */
     }

     .dark {
       /* shadcn semantic tokens — modo OSCURO */
       --background: 0 0% 4%;
       --foreground: 0 0% 98%;
       --card: 0 0% 8%;
       --card-foreground: 0 0% 98%;
       --primary: 0 0% 98%;            /* botón primario: blanco/gris claro sobre fondo oscuro */
       --primary-foreground: 0 0% 4%;
       --secondary: 0 0% 10%;
       --secondary-foreground: 0 0% 98%;
       --muted: 0 0% 10%;
       --muted-foreground: 0 0% 64%;
       --accent: 0 0% 15%;             /* accent neutro gris oscuro, NO naranja */
       --accent-foreground: 0 0% 98%;
       --border: 0 0% 15%;
       --input: 0 0% 15%;
       --ring: 0 0% 60%;               /* ring gris para focus */
       --destructive: 0 72% 51%;

       /* Agency custom tokens — modo OSCURO */
       --agency-bg: #0a0a0a;
       --agency-surface: #141414;
       --agency-surface-elevated: #1a1a1a;
       --agency-border: rgba(255, 255, 255, 0.06);
       --agency-text-main: #fafafa;
       --agency-text-secondary: #a3a3a3;
       --agency-text-muted: #737373;
       --agency-accent: #ff8a00;        /* solo para texto hover */
     }

     * {
       border-color: var(--agency-border);
     }

     body {
       background-color: var(--agency-bg);
       color: var(--agency-text-main);
       font-family: var(--font-geist-sans);
       -webkit-font-smoothing: antialiased;
     }

     h1, h2, h3, h4, h5, h6 {
       font-weight: 600;
       letter-spacing: -0.02em;
     }
   }

   @layer utilities {
     /* Glassmorphism — para modals y cards elevadas */
     .glass {
       background: rgba(255, 255, 255, 0.03);
       border: 1px solid rgba(255, 255, 255, 0.08);
       backdrop-filter: blur(20px);
       -webkit-backdrop-filter: blur(20px);
     }

     :root .glass {
       background: rgba(0, 0, 0, 0.02);
       border: 1px solid rgba(0, 0, 0, 0.06);
     }

     /* Naranja — SOLO para texto interactivo (hover de links, nav activo) */
     .text-hover-accent {
       transition: color 0.15s ease;
     }
     .text-hover-accent:hover {
       color: var(--agency-accent); /* #ff8a00 */
     }

     /* Nav item activo */
     .nav-active {
       color: var(--agency-accent);
     }
   }
   ```

4. **`src/components/shared/ThemeProvider.tsx`:**
   Crea un Client Component que envuelva la app con `ThemeProvider` de `next-themes`:
   ```tsx
   'use client'
   import { ThemeProvider as NextThemesProvider } from 'next-themes'

   export function ThemeProvider({ children }: { children: React.ReactNode }) {
     return (
       <NextThemesProvider
         attribute="class"
         defaultTheme="dark"
         enableSystem
         disableTransitionOnChange
       >
         {children}
       </NextThemesProvider>
     )
   }
   ```
   - `defaultTheme="dark"`: la app carga en oscuro por defecto (igual que la landing).
   - `enableSystem`: respeta la preferencia del sistema del usuario si no ha elegido manualmente.

5. **`src/components/shared/ThemeToggle.tsx`:**
   Botón de toggle que el usuario puede colocar en el header del Dashboard:
   ```tsx
   'use client'
   import { useTheme } from 'next-themes'
   import { Moon, Sun } from 'lucide-react'
   import { Button } from '@/components/ui/button'

   export function ThemeToggle() {
     const { theme, setTheme } = useTheme()
     return (
       <Button
         variant="ghost"
         size="icon"
         onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
         aria-label="Cambiar tema"
       >
         <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
         <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
       </Button>
     )
   }
   ```

6. **`src/app/layout.tsx` — Integración:**
   - Importa `GeistSans` y `GeistMono` de `geist/font` (paquete `geist`).
   - Aplica el `ThemeProvider` envolviendo el `{children}`.
   - La clase `dark` se aplica automáticamente por `next-themes` en el `<html>`.

7. **Verificación Final:**
   - Ejecuta `pnpm dev` y verifica que el body tiene fondo `#0a0a0a` en dark y `#ffffff` en light.
   - Verifica que el `ThemeToggle` cambia el tema sin recarga de página.
   - Comprueba que un `<Button variant="default">` de shadcn es **blanco/gris claro** en dark mode y **casi negro** en light mode. NO debe aparecer naranja.
   - Comprueba que al hacer hover en un elemento con clase `.text-hover-accent`, el texto cambia a `#ff8a00`.
   - El naranja NO debe aparecer en ningún fondo de botón, badge de formulario, o borde de Input.

---
**Nota para la IA:** El objetivo de este prompt es establecer las bases visuales que usarán TODOS los prompts siguientes. Los componentes de shadcn/ui leen automáticamente las variables CSS del `:root` y `.dark`, por lo que configurarlas correctamente aquí es suficiente para que toda la app sea visualmente consistente sin tocar el CSS de cada componente individualmente. La escala de z-index y las clases de transición estandarizadas evitarán conflictos en los prompts 08 (modals de seguridad) y 09 (dropdowns del dashboard).

## Testing Strategy
- Verificar que `body` tiene fondo `#0a0a0a` en dark y `#ffffff` en light.
- Verificar que `ThemeToggle` cambia el tema sin recarga.
- Verificar que un `<Button variant="default">` es blanco/gris claro en dark, casi negro en light. NO naranja.
- Verificar que `.text-hover-accent:hover` produce color `#ff8a00`.
- Verificar que `.sr-only` oculta visualmente pero es legible por screen readers.
- Verificar que focus ring es visible en ambos modos.
