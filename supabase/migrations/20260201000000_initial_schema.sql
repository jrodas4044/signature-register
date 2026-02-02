-- SCA-Political: Enums and core tables
-- Run this migration in Supabase SQL Editor or via: supabase db push

-- Enums (Ubiquitous Language from SRS)
CREATE TYPE estado_hoja AS ENUM (
  'PENDIENTE_ENTREGA',
  'CIRCULACION',
  'RECIBIDA',
  'EN_TSE',
  'PROCESADA'
);

CREATE TYPE estado_adhesion AS ENUM (
  'PENDIENTE',
  'ACEPTADO',
  'RECHAZADO',
  'REVISION_TSE',
  'OMITIDO',
  'RECHAZADO_INTERNO'
);

CREATE TYPE causa_rechazo AS ENUM (
  'NO_EMPADRONADO',
  'FIRMA_NO_COINCIDE',
  'ERROR_CAPTURA',
  'DATOS_INCOMPLETOS',
  'DUPLICADO',
  'IMPRESION_DACTILAR',
  'PLANA',
  'AFILIADO',
  'ACTUALIZACION_PADRON'
);

CREATE TYPE lider_estado AS ENUM ('activo', 'inactivo');

CREATE TYPE app_role AS ENUM ('administrador', 'digitador', 'auditor');

-- Profiles: links auth.users to app role (SRS §5 security)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'digitador',
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Lider (Aggregate Root)
CREATE TABLE public.lideres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  zona text,
  dpi text NOT NULL,
  estado lider_estado NOT NULL DEFAULT 'activo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(dpi)
);

-- Hoja (Entity): one sheet per leader at a time
CREATE TABLE public.hojas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_hoja integer NOT NULL,
  lider_id uuid NOT NULL REFERENCES public.lideres(id) ON DELETE RESTRICT,
  estado_fisico estado_hoja NOT NULL DEFAULT 'PENDIENTE_ENTREGA',
  fecha_asignacion timestamptz NOT NULL DEFAULT now(),
  fecha_recepcion timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(numero_hoja)
);

CREATE INDEX idx_hojas_lider_id ON public.hojas(lider_id);
CREATE INDEX idx_hojas_estado_fisico ON public.hojas(estado_fisico);

-- Adhesion (Entity): 5 lines per sheet
CREATE TABLE public.adhesiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hoja_id uuid NOT NULL REFERENCES public.hojas(id) ON DELETE CASCADE,
  linea_id smallint NOT NULL CHECK (linea_id >= 1 AND linea_id <= 5),
  dpi_ciudadano text,
  nombre_ciudadano text,
  estado_legal estado_adhesion NOT NULL DEFAULT 'PENDIENTE',
  causa_rechazo causa_rechazo,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(hoja_id, linea_id)
);

CREATE INDEX idx_adhesiones_hoja_id ON public.adhesiones(hoja_id);
CREATE INDEX idx_adhesiones_dpi_estado ON public.adhesiones(dpi_ciudadano) WHERE dpi_ciudadano IS NOT NULL AND dpi_ciudadano != '';

-- Audit log for adhesion state changes (SRS §5)
CREATE TABLE public.adhesion_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adhesion_id uuid NOT NULL REFERENCES public.adhesiones(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  estado_anterior estado_adhesion,
  estado_nuevo estado_adhesion NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_adhesion_audit_log_adhesion_id ON public.adhesion_audit_log(adhesion_id);
CREATE INDEX idx_adhesion_audit_log_created_at ON public.adhesion_audit_log(created_at);

-- Trigger: update updated_at on lideres
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lideres_updated_at
  BEFORE UPDATE ON public.lideres
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER hojas_updated_at
  BEFORE UPDATE ON public.hojas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER adhesiones_updated_at
  BEFORE UPDATE ON public.adhesiones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Audit trigger: log adhesion state changes (SRS §5)
CREATE OR REPLACE FUNCTION public.log_adhesion_state_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.estado_legal IS DISTINCT FROM NEW.estado_legal THEN
    INSERT INTO public.adhesion_audit_log (adhesion_id, user_id, estado_anterior, estado_nuevo)
    VALUES (NEW.id, auth.uid(), OLD.estado_legal, NEW.estado_legal);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER adhesion_audit_trigger
  AFTER UPDATE ON public.adhesiones
  FOR EACH ROW EXECUTE FUNCTION public.log_adhesion_state_change();
