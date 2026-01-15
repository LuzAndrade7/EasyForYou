-- Ejecutar en Supabase SQL Editor para actualizar la tabla avatars
-- Agregar columna para el nombre de la mascota

ALTER TABLE avatars ADD COLUMN IF NOT EXISTS pet_name TEXT;

-- Si la tabla no existe, crearla con la nueva estructura
-- CREATE TABLE IF NOT EXISTS avatars (
--   id SERIAL PRIMARY KEY,
--   user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
--   animal_type INT NOT NULL CHECK (animal_type BETWEEN 1 AND 5),
--   pet_name TEXT NOT NULL,
--   level INT NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 5),
--   xp INT NOT NULL DEFAULT 0
-- );

-- Habilitar RLS (Row Level Security)
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean/editen sus propios avatars
CREATE POLICY "Users can view own avatar" ON avatars
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own avatar" ON avatars
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own avatar" ON avatars
  FOR UPDATE USING (auth.uid() = user_id);
