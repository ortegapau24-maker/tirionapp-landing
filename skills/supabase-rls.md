---
description: Patterns for Supabase Row Level Security policies
---

## Standard RLS Pattern
All SELECT/UPDATE/DELETE policies MUST use:
```sql
CREATE POLICY "Users can only access own data" ON table_name
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = table_name.project_id
      AND projects.user_id = auth.uid()
    )
  );
```
