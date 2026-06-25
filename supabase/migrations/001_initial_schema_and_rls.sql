-- ==========================================================================
-- Orion Software — Migración inicial: esquema + políticas RLS
-- ==========================================================================
-- Ejecutar en el SQL Editor de Supabase.
-- Para exportar políticas existentes: supabase db dump --schema public > mig.sql
-- ==========================================================================

-- ── 1. ENABLE RLS en todas las tablas ─────────────────────────────────────

ALTER TABLE IF EXISTS user_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_roles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS roles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS patients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clinical_notes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clinical_records   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS providers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS backup_history     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS treatment_services ENABLE ROW LEVEL SECURITY;

-- ── 2. FUNCIÓN AUXILIAR: ¿el usuario actual es admin? ────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
  );
$$;

-- ── 3. FUNCIÓN AUXILIAR: ¿el usuario actual es el dueño del registro? ────

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- ── 4. POLÍTICAS RLS ──────────────────────────────────────────────────────

-- ● user_profiles — cada usuario ve/edita su propio perfil; admins ven todo
CREATE POLICY "Users view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins insert profiles" ON user_profiles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete profiles" ON user_profiles
  FOR DELETE USING (public.is_admin());

-- ● user_roles — admins gestionan; usuarios ven sus propios roles
CREATE POLICY "Users view own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins manage roles" ON user_roles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins update roles" ON user_roles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins delete roles" ON user_roles
  FOR DELETE USING (public.is_admin());

-- ● subscriptions — admins gestionan; usuarios ven su propia suscripción
CREATE POLICY "Users view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins insert subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins update subscriptions" ON subscriptions
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins delete subscriptions" ON subscriptions
  FOR DELETE USING (public.is_admin());

-- ● subscription_history — admins gestionan; usuarios ven su propio historial
CREATE POLICY "Users view own history" ON subscription_history
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins insert history" ON subscription_history
  FOR INSERT WITH CHECK (public.is_admin());

-- ● appointments — provider dueño + admin ven todo
CREATE POLICY "Providers view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers insert appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers update own appointments" ON appointments
  FOR UPDATE USING (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers delete own appointments" ON appointments
  FOR DELETE USING (auth.uid() = provider_id OR public.is_admin());

-- ● patients — todo provider autenticado puede ver; admin puede todo
CREATE POLICY "Authenticated users view patients" ON patients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users insert patients" ON patients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users update patients" ON patients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users delete patients" ON patients
  FOR DELETE USING (auth.role() = 'authenticated');

-- ● clinical_notes — RLS por provider_id (notas privadas), admin ve todo
CREATE POLICY "Providers view own notes" ON clinical_notes
  FOR SELECT USING (
    auth.uid() = provider_id
    OR public.is_admin()
    OR is_private = false
  );

CREATE POLICY "Providers insert notes" ON clinical_notes
  FOR INSERT WITH CHECK (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers update own notes" ON clinical_notes
  FOR UPDATE USING (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers delete own notes" ON clinical_notes
  FOR DELETE USING (auth.uid() = provider_id OR public.is_admin());

-- ● clinical_records — provider dueño + admin
CREATE POLICY "Providers view own records" ON clinical_records
  FOR SELECT USING (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers insert records" ON clinical_records
  FOR INSERT WITH CHECK (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers update own records" ON clinical_records
  FOR UPDATE USING (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers delete own records" ON clinical_records
  FOR DELETE USING (auth.uid() = provider_id OR public.is_admin());

-- ● service_categories — todo autenticado puede ver; admin escribe
CREATE POLICY "Authenticated users view services" ON service_categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins manage services" ON service_categories
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins update services" ON service_categories
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins delete services" ON service_categories
  FOR DELETE USING (public.is_admin());

-- ● providers — todo autenticado ve; admin gestiona
CREATE POLICY "Authenticated users view providers" ON providers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins manage providers" ON providers
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins update providers" ON providers
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins delete providers" ON providers
  FOR DELETE USING (public.is_admin());

-- ● backup_history — solo admins
CREATE POLICY "Admins view backups" ON backup_history
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins insert backups" ON backup_history
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete backups" ON backup_history
  FOR DELETE USING (public.is_admin());

-- ● treatment_services — todo autenticado ve; provider dueño edita
CREATE POLICY "Authenticated users view treatments" ON treatment_services
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Providers insert treatments" ON treatment_services
  FOR INSERT WITH CHECK (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers update own treatments" ON treatment_services
  FOR UPDATE USING (auth.uid() = provider_id OR public.is_admin());

CREATE POLICY "Providers delete own treatments" ON treatment_services
  FOR DELETE USING (auth.uid() = provider_id OR public.is_admin());
