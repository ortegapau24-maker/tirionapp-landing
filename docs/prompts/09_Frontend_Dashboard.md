# Prompt 09: Frontend - Dashboard de Usuario y Métricas

**Objetivo:** Desarrollar el panel de control principal donde el cliente puede visualizar, gestionar y monitorear el rendimiento de las automatizaciones que la IA ha creado para su negocio.

---

> ⚠️ **IMPORTANTE — RESTRICCIÓN DE ALCANCE:**
> Este prompt es el **Paso 9 de 11**. Solo implementa las vistas del Dashboard (Overview, Automatizaciones, Integraciones y Billing). NO implementes el chat de onboarding (Prompt 08), la lógica de Stripe (Prompt 11), ni ningún agente de IA.

---

## 1. Contexto del Dashboard
Una vez que el usuario sale del Chat de Onboarding (Prompt 08), llega a su "Centro de Mando" (Dashboard). 
A diferencia del backend técnico (n8n) que es invisible para él, este dashboard debe destilar la información técnica en métricas de negocio puras.

El usuario debe poder:
1. **Ver sus Automatizaciones:** Listado claro de flujos activos, pausados o en borrador.
2. **"Transparencia sin Riesgo" (Detalle Visual):** Al entrar a una automatización específica, no verá el indescifrable JSON de n8n, sino un diagrama o lista limpia creada por nosotros (ej. "1. Recibe Email -> 2. IA Lee -> 3. Slack").
3. **Métricas de Valor:** En el detalle, verán "Ejecuciones exitosas: 124", "Fallidas: 2" y el log limpio de las últimas ejecuciones.
4. **Gestionar Integraciones (OAuth):** Un panel donde autorizar herramientas.

## 2. Herramientas a utilizar
- **Next.js (App Router)**: Layouts anidados (`app/(dashboard)/layout.tsx`) para la navegación lateral (Sidebar).
- **shadcn/ui**: Tablas (`Table`), Tarjetas de métricas (`Card`), Pestañas (`Tabs`), Botones y Modals.
- **Recharts** (o similar ligero): Para los gráficos de barras o líneas de "Ejecuciones en los últimos 30 días".
- **Lucide Icons**: Iconografía para estados (Activo verde, Pausado gris, Error rojo).

## 3. Entregables Esperados
Deberás crear/modificar los siguientes archivos en la carpeta `src/app/(dashboard)/` y `src/components/dashboard/`:

- `src/app/(dashboard)/layout.tsx`: El molde del panel que incluye el Sidebar (Navegación entre 'Resumen', 'Mis Flujos', 'Integraciones', 'Facturación').
- `src/app/(dashboard)/page.tsx`: La vista "Resumen" (Overview) con las KPI cards y el gráfico principal.
- `src/app/(dashboard)/automations/page.tsx`: La vista listado de automatizaciones.
- `src/app/(dashboard)/automations/[id]/page.tsx`: La vista "Detalle de Automatización", mostrando métricas específicas y el visor del flujo.
- `src/app/(dashboard)/integrations/page.tsx`: La vista donde conectan herramientas.
- `src/components/dashboard/MetricCard.tsx`: Componente UI reutilizable para KPIs.
- `src/components/dashboard/AutomationFlowViewer.tsx`: Componente visual puro que pinta la secuencia gráfica de la automatización. **Su fuente de datos es el campo `flow_definition` (JSONB) de la tabla `automations`**. Itera el array de nodos y pinta cada paso con su icono de Lucide correspondiente. Es estrictamente de solo lectura.
- `src/app/(dashboard)/loading.tsx`: Skeleton loader global del dashboard. **Obligatorio.** Sin él, los Server Components muestran una pantalla en blanco durante el fetch a Supabase.

## 4. Instrucciones Paso a Paso para Claude Code

Por favor, ejecuta los siguientes pasos en orden:

1.  **Instalación de Dependencias Visuales:**
    - Asegúrate de tener los componentes básicos: `npx shadcn-ui@latest add table card tabs switch badge dialog`.
    - Opcional: Instala `recharts` si deseas pintar un gráfico real en el Overview (`pnpm add recharts`). **IMPORTANTE: Cargar Recharts con `next/dynamic` (lazy loading) — son ~200KB que no deben cargarse si el usuario no visita el Overview.**

2.  **Construcción del Layout Base:**
    - Modifica `src/app/(dashboard)/layout.tsx`. Implementa un Sidebar fijo a la izquierda (en Desktop) y un header superior con el menú de usuario. El contenido principal `children` va a la derecha.
    - **Extraer como componente independiente:** Crear `src/components/dashboard/Sidebar.tsx` con: highlight del item activo (usando `usePathname()`), badge de créditos restantes, y comportamiento collapsible en móvil (hamburger menu). **Usar z-index `z-sticky` (10) del Prompt 01b.**

3.  **Desarrollo de la Vista Overview (`page.tsx`):**
    - Obtén los datos desde Supabase (Server Component): Suma de `automation_runs`, estado actual de créditos del usuario y métricas calculadas.
    - Pinta 3 `MetricCard`: "Automatizaciones Activas", "Créditos Disponibles", "Tareas Completadas (30d)". **Memoizar `MetricCard` con `React.memo` — son componentes puros de presentación.**
    - Añade una sección de "Ejecuciones Recientes" que liste los últimos 5 fallos/éxitos de `automation_runs`.
    - **Estado vacío (Empty State):** Si el usuario tiene 0 automatizaciones y 0 ejecuciones, NO mostrar tarjetas vacías. Mostrar una ilustración + CTA claro: "Crea tu primera automatización →" que lleve al chat.

4.  **Gestor de Automatizaciones (`automations/page.tsx` y `id/page.tsx`):**
    - Obtén la lista de automatizaciones del usuario. Renderiza una tabla.
    - Cada fila debe ser clickeable (link hacia `/automations/[id]`). El click lleva a la vista de "Detalle".
    - En `automations/[id]/page.tsx`, pinta arriba el status (con `<Switch>` para activar/pausar, lo cual llama a un Server Action). **El Server Action de activación debe verificar que el usuario no supera el límite de "Automatizaciones Activas" de su plan antes de hacer la llamada a n8n.** **Optimistic UI: el Switch cambia inmediatamente visualmente (optimistic) y revierte si el Server Action falla.**
    - **Breadcrumbs:** Añadir `Automations > [Nombre del workflow]` con `<Link>` de Next.js en la parte superior.
    - Abajo, pinta dos pestañas:
      * "Flujo": Crea `AutomationFlowViewer.tsx`. Itera el `flow_definition` y pinta una secuencia limpia usando Lucide. ¡NO el editor n8n real! Solo una vista *read-only* amigable.
      * "Logs": Lista las ejecuciones recientes (`automation_runs`) en lenguaje llano, para que el usuario sepa si falló algo.

5.  **Centro de Integraciones (`integrations/page.tsx`):**
    - Muestra una grilla de tarjetas. Cada tarjeta representa una herramienta soportada (Gmail, Slack, Stripe, HubSpot).
    - Consultando la tabla `integrations`, si el usuario ya ha provisto su token, la tarjeta muestra un check verde "Conectado".
    - Si no, muestra el botón "Conectar", que abre un Modal informando: "Para conectar esta herramienta, hazlo durante el Chat de Onboarding o contacta con soporte." **NO implementes un flujo OAuth completo en este prompt** — eso es una funcionalidad de crecimiento post-MVP.

6.  **Verificación Final:**
    - Comprueba que la navegación por el Sidebar sea rápida usando componentes `<Link href="..." />` de Next.js.
    - Asegúrate de que el estado de carga (`loading.tsx`) esté presente para que la app no parezca congelada mientras hace fetch a Supabase.

---
**Nota para la IA:** Recuerda que la filosofía del producto es "agencia IA como servicio". El cliente NO debería ver el lienzo drag-and-drop de n8n en el dashboard. Solo debe ver botones a prueba de tontos (Activar/Desactivar/Eliminar). La complejidad técnica se oculta intencionadamente. `AutomationFlowViewer` debe memoizarse con `React.memo` — es un componente de solo lectura puro.

## Testing Strategy
- Verificar que Recharts se carga lazy (no aparece en el bundle si no se visita Overview).
- Verificar que el Empty State se muestra cuando un usuario nuevo sin datos accede al Dashboard.
- Verificar que el `<Switch>` de activar/pausar hace optimistic update y revierte en caso de error.
- Verificar que los breadcrumbs muestran el nombre correcto del workflow.
- Verificar que el Sidebar resalta el item activo correctamente basado en la URL.
- Verificar que `loading.tsx` muestra skeleton loader mientras el Server Component hace fetch.
- Verificar que las integraciones "Conectadas" muestran check verde y las no conectadas muestran botón.
