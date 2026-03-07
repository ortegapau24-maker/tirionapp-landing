---
description: Reviews code for TirionApp quality, security, and consistency
---

## Checklist
- [ ] Uses `env.VARIABLE` instead of `process.env.VARIABLE`
- [ ] API routes use `apiSuccess()` and `handleApiError()`
- [ ] No `service_role` in client components
- [ ] All tables have RLS enabled
- [ ] Zod validation on all endpoint inputs
- [ ] Error Boundary around crash-prone components
- [ ] Keyboard navigation on interactive elements
- [ ] Rate limiting on public endpoints
