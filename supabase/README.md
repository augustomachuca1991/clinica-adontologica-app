# Supabase — Migraciones y RLS

## Requisitos

- [Supabase CLI](https://supabase.com/docs/guides/local-development) instalado
- Acceso al proyecto de Supabase (`VITE_SUPABASE_URL` en `.env`)

## Exportar políticas RLS actuales (desde producción)

```bash
supabase link --project-ref itbgzglbjbiyljibchdf
supabase db dump --schema public > supabase/migrations/001_initial_schema_and_rls.sql
```

> Reemplazar `itbgzglbjbiyljibchdf` con el project-ref de Supabase
> (está en la URL: `https://<project-ref>.supabase.co`)

## Aplicar migraciones

Desde el SQL Editor del dashboard de Supabase, pegar el contenido del archivo
`001_initial_schema_and_rls.sql` y ejecutar.

O via CLI:

```bash
supabase db push
```

## Verificar políticas activas

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```
