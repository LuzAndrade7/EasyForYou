-- =====================================================
-- FIX: Cambiar foreign key de avatars
-- El problema es que avatars.user_id apunta a profiles.id
-- pero debería apuntar a auth.users.id directamente
-- =====================================================

-- 1. Eliminar la foreign key existente
ALTER TABLE public.avatars 
DROP CONSTRAINT IF EXISTS avatars_user_id_fkey;

-- 2. Crear nueva foreign key apuntando a auth.users
ALTER TABLE public.avatars 
ADD CONSTRAINT avatars_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Verificar que la columna pet_name existe
ALTER TABLE public.avatars ADD COLUMN IF NOT EXISTS pet_name TEXT;

-- =====================================================
-- También asegurarse de que profiles tenga la FK correcta
-- =====================================================

-- Verificar estructura de profiles
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Ejecuta esto para ver las constraints:
-- SELECT conname, conrelid::regclass, confrelid::regclass 
-- FROM pg_constraint 
-- WHERE contype = 'f' AND conrelid::regclass::text IN ('avatars', 'profiles');
