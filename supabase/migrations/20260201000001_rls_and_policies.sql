-- SCA-Political: RLS and role-based policies
-- Requires initial_schema to be applied first.

-- Enable RLS on all app tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lideres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hojas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adhesiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adhesion_audit_log ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role (null if no profile)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS app_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Only admins can update profiles (e.g. assign roles) - enforced in app; allow service role
CREATE POLICY "Users can update own profile display_name"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow insert so signup trigger or app can create profile
CREATE POLICY "Allow insert profile for self"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Lideres: administrador full access; digitador/auditor read only
CREATE POLICY "Lideres select for authenticated with profile"
  ON public.lideres FOR SELECT
  TO authenticated
  USING (
    public.get_my_role() IS NOT NULL
  );

CREATE POLICY "Lideres insert for administrador"
  ON public.lideres FOR INSERT
  TO authenticated
  WITH CHECK (public.get_my_role() = 'administrador');

CREATE POLICY "Lideres update for administrador"
  ON public.lideres FOR UPDATE
  TO authenticated
  USING (public.get_my_role() = 'administrador')
  WITH CHECK (public.get_my_role() = 'administrador');

CREATE POLICY "Lideres delete for administrador"
  ON public.lideres FOR DELETE
  TO authenticated
  USING (public.get_my_role() = 'administrador');

-- Hojas: administrador full; digitador read + (reception could be admin-only)
CREATE POLICY "Hojas select for authenticated with profile"
  ON public.hojas FOR SELECT
  TO authenticated
  USING (public.get_my_role() IS NOT NULL);

CREATE POLICY "Hojas insert for administrador"
  ON public.hojas FOR INSERT
  TO authenticated
  WITH CHECK (public.get_my_role() = 'administrador');

CREATE POLICY "Hojas update for administrador"
  ON public.hojas FOR UPDATE
  TO authenticated
  USING (public.get_my_role() = 'administrador')
  WITH CHECK (public.get_my_role() = 'administrador');

CREATE POLICY "Hojas delete for administrador"
  ON public.hojas FOR DELETE
  TO authenticated
  USING (public.get_my_role() = 'administrador');

-- Adhesiones: administrador full; digitador select + insert + update (for data entry)
CREATE POLICY "Adhesiones select for authenticated with profile"
  ON public.adhesiones FOR SELECT
  TO authenticated
  USING (public.get_my_role() IS NOT NULL);

CREATE POLICY "Adhesiones insert for administrador or digitador"
  ON public.adhesiones FOR INSERT
  TO authenticated
  WITH CHECK (public.get_my_role() IN ('administrador', 'digitador'));

CREATE POLICY "Adhesiones update for administrador or digitador"
  ON public.adhesiones FOR UPDATE
  TO authenticated
  USING (public.get_my_role() IN ('administrador', 'digitador'))
  WITH CHECK (public.get_my_role() IN ('administrador', 'digitador'));

CREATE POLICY "Adhesiones delete for administrador"
  ON public.adhesiones FOR DELETE
  TO authenticated
  USING (public.get_my_role() = 'administrador');

-- Audit log: read for administrador and auditor
CREATE POLICY "Adhesion_audit_log select for admin and auditor"
  ON public.adhesion_audit_log FOR SELECT
  TO authenticated
  USING (public.get_my_role() IN ('administrador', 'auditor'));

CREATE POLICY "Adhesion_audit_log insert for authenticated"
  ON public.adhesion_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Trigger: create profile on signup (default role: digitador)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, display_name)
  VALUES (NEW.id, 'digitador', NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (must be in auth schema or use Supabase hook)
-- Supabase allows triggers on auth.users; run as postgres/superuser
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
