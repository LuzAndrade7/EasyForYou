-- =====================================================
-- SCRIPT COMPLETO PARA SUPABASE - EasyForYou
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. ELIMINAR TABLAS EXISTENTES (si quieres empezar limpio)
-- CUIDADO: Esto borra todos los datos
-- DROP TABLE IF EXISTS public.arch_results CASCADE;
-- DROP TABLE IF EXISTS public.content_progress CASCADE;
-- DROP TABLE IF EXISTS public.topics CASCADE;
-- DROP TABLE IF EXISTS public.avatars CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- =====================================================
-- 2. CREAR TABLAS
-- =====================================================

-- Perfil extendido (datos extra del usuario)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Avatar/animal elegido + nivel + nombre de mascota
CREATE TABLE IF NOT EXISTS public.avatars (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_type INT NOT NULL CHECK (animal_type BETWEEN 1 AND 5),
  pet_name TEXT,
  level INT NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
  xp INT NOT NULL DEFAULT 0
);

-- Temas/contenidos
CREATE TABLE IF NOT EXISTS public.topics (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  points INT NOT NULL DEFAULT 10
);

-- Progreso por tema
CREATE TABLE IF NOT EXISTS public.content_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id BIGINT REFERENCES public.topics(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, topic_id)
);

-- Historial de cálculos (Arch)
CREATE TABLE IF NOT EXISTS public.arch_results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  formula_name TEXT NOT NULL,
  input_json JSONB NOT NULL,
  result_value DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. AGREGAR COLUMNA pet_name SI NO EXISTE
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'avatars' 
    AND column_name = 'pet_name'
  ) THEN
    ALTER TABLE public.avatars ADD COLUMN pet_name TEXT;
  END IF;
END $$;

-- =====================================================
-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arch_results ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. POLÍTICAS DE SEGURIDAD
-- =====================================================

-- PROFILES - Eliminar políticas existentes y crear nuevas
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- AVATARS - Eliminar políticas existentes y crear nuevas
DROP POLICY IF EXISTS "Users manage own avatar" ON public.avatars;
DROP POLICY IF EXISTS "Users can view own avatar" ON public.avatars;
DROP POLICY IF EXISTS "Users can insert own avatar" ON public.avatars;
DROP POLICY IF EXISTS "Users can update own avatar" ON public.avatars;

CREATE POLICY "Users can view own avatar"
ON public.avatars FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own avatar"
ON public.avatars FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own avatar"
ON public.avatars FOR UPDATE
USING (auth.uid() = user_id);

-- CONTENT_PROGRESS
DROP POLICY IF EXISTS "Users manage own progress" ON public.content_progress;

CREATE POLICY "Users manage own progress"
ON public.content_progress FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ARCH_RESULTS
DROP POLICY IF EXISTS "Users manage own arch" ON public.arch_results;

CREATE POLICY "Users manage own arch"
ON public.arch_results FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. VERIFICACIÓN (Ejecutar para comprobar)
-- =====================================================

-- Ver estructura de la tabla avatars
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'avatars';

-- Ver políticas activas
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';
