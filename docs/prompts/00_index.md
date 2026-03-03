emope# Índice de Prompts para Claude Code

Este directorio contiene los prompts estructurados en Markdown para construir la plataforma de automatizaciones con IA paso a paso utilizando Claude Code.

## Estado de los Prompts

*   [ ] **01_Setup_Inicial.md**: Inicialización del repositorio de la aplicación (Next.js App Router para dashboard y chat), dependencias base (Tailwind, Shadcn) y estructura de carpetas principal.
*   [ ] **01b_Sistema_Diseño.md**: Sistema de diseño UI: design tokens (paleta `surface` + acento naranja), tipografía Geist, CSS variables para modo claro/oscuro, sobreescritura del tema shadcn/ui, y componentes `ThemeProvider` y `ThemeToggle`.
*   [ ] **02_Base_de_Datos.md**: Esquema de Supabase (PostgreSQL), tablas (users, projects, automations, interviews, rag_data), tipos de TypeScript y RLS.
*   [ ] **03_Autenticacion.md**: Configuración de auth (Clerk / Supabase Auth), middlewares de protección de rutas y conexión con la base de datos de usuarios.
*   [ ] **04_Agentes_LangGraph.md**: Definición del State, orquestador, nodos de los agentes (Consultor, Arquitecto, Generador, Validador) y routing.
*   [ ] **05_Sistema_RAG.md**: Configuración de embeddings, almacenamiento en pgvector, recuperación semántica y pipeline Retrieve & Generate.
*   [ ] **06_Backend_API.md**: Endpoints principales (Next.js App Router), webhooks entrantes y orquestación hacia n8n.
*   [ ] **07_Integracion_n8n.md**: Conexión con la API de n8n para importar dinámicamente los workflows JSON generados por la IA y gestionar su ejecución.
*   [ ] **08_Frontend_Entrevista.md**: Interfaz del chat del onboarding, manejo del estado de la conversación y sistema de micro-validaciones (UI no técnica).
*   [ ] **09_Frontend_Dashboard.md**: Panel de control del usuario, listado de flujos, métricas de éxito y estado de integraciones.
*   [ ] **10_Seguridad_DevOps.md**: Manejo seguro de API Keys, rate limiting (Upstash), validación de payloads (Zod) y despliegue de n8n con Docker.
* **[Prompt 11: Pagos Suscripciones](./11_Pagos_Suscripciones.md)**: Webhooks de Stripe, roles, rate limiting de ejecuciones.
* **[Prompt 12: Testing CICD](./12_Testing_CICD.md)**: Pruebas unitarias, E2E y flujos de CI/CD.
* **[Prompt 13: VoiceAI CallCenter](./13_VoiceAI_CallCenter.md)**: Arquitectura híbrida (Vapi + n8n tool-calling) para agentes telefónicos.

## Prompts Pendientes / A Considerar (Para iteraciones futuras).

---
**Instrucciones de uso:** 
Cada uno de estos prompts estará diseñado para ser ejecutado en Claude Code de manera secuencial, asegurando que el proyecto se construya de forma modular y con el contexto correcto en cada paso.
