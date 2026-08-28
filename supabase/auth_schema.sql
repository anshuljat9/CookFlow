-- Part 9 Authentication & User Accounts Schema
-- Run this in Supabase SQL Editor after running schema.sql, substitutions_schema.sql, video_extraction_schema.sql

-- Enable UUID extension (already enabled in schema.sql but keeping for clarity)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
-- Extended user profile linked to auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updated at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. USER PREFERENCES TABLE
-- ============================================
CREATE TABLE user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_cuisines TEXT[] DEFAULT '{}',
  dietary_preferences TEXT[] DEFAULT '{}',
  spice_level TEXT DEFAULT 'medium' CHECK (spice_level IN ('mild', 'medium', 'hot', 'extra-hot')),
  cooking_skill TEXT DEFAULT 'beginner' CHECK (cooking_skill IN ('beginner', 'intermediate', 'advanced')),
  favorite_ingredients UUID[] DEFAULT '{}',
  disliked_ingredients UUID[] DEFAULT '{}',
  preferred_music_mood TEXT DEFAULT 'chill',
  preferred_music_platform TEXT DEFAULT 'spotify',
  recently_viewed_recipes UUID[] DEFAULT '{}',
  recipe_feedback JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Updated at trigger for user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. USER FAVORITES TABLE
-- ============================================
CREATE TABLE user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_recipe ON user_favorites(recipe_id);

-- ============================================
-- 4. USER KITCHEN INGREDIENTS TABLE
-- ============================================
CREATE TABLE user_kitchen_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC(10,3),
  unit TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ingredient_id)
);

CREATE INDEX idx_user_kitchen_ingredients_user ON user_kitchen_ingredients(user_id);
CREATE INDEX idx_user_kitchen_ingredients_ingredient ON user_kitchen_ingredients(ingredient_id);

-- ============================================
-- 5. COOKING HISTORY TABLE
-- ============================================
CREATE TABLE cooking_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  servings INTEGER DEFAULT 1,
  was_adapted BOOLEAN DEFAULT FALSE,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  would_cook_again BOOLEAN,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cooking_history_user ON cooking_history(user_id);
CREATE INDEX idx_cooking_history_recipe ON cooking_history(recipe_id);
CREATE INDEX idx_cooking_history_completed_at ON cooking_history(completed_at DESC);

-- ============================================
-- 6. USER IMPORTED RECIPES (Part 6 integration)
-- ============================================
CREATE TABLE user_imported_recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  source_type TEXT CHECK (source_type IN ('url', 'upload', 'image')),
  source_url TEXT,
  source_platform TEXT,
  extraction_confidence NUMERIC(3,2),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX idx_user_imported_recipes_user ON user_imported_recipes(user_id);

-- ============================================
-- 7. EXTEND RECIPES TABLE FOR OWNERSHIP
-- ============================================
-- Add user_id to recipes for ownership tracking of imported/AI-generated recipes
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;

-- Add index for user's own recipes
CREATE INDEX idx_recipes_user ON recipes(user_id);

-- ============================================
-- 8. UPDATE VIDEO EXTRACTION JOBS TABLE
-- ============================================
-- Already has user_id column, ensure RLS policies are correct
-- The existing policies in video_extraction_schema.sql already handle user_id IS NULL for anonymous

-- ============================================
-- 9. ENABLE RLS ON ALL NEW TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_kitchen_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_imported_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_adapted_recipes ENABLE ROW LEVEL SECURITY; -- Already has RLS from substitutions_schema.sql

-- ============================================
-- 10. RLS POLICIES
-- ============================================

-- PROFILES
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- USER PREFERENCES
CREATE POLICY "Users can read own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- USER FAVORITES
CREATE POLICY "Users can read own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- USER KITCHEN INGREDIENTS
CREATE POLICY "Users can read own kitchen" ON user_kitchen_ingredients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kitchen" ON user_kitchen_ingredients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kitchen" ON user_kitchen_ingredients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own kitchen" ON user_kitchen_ingredients
  FOR DELETE USING (auth.uid() = user_id);

-- COOKING HISTORY
CREATE POLICY "Users can read own cooking history" ON cooking_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cooking history" ON cooking_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cooking history" ON cooking_history
  FOR UPDATE USING (auth.uid() = user_id);

-- USER IMPORTED RECIPES
CREATE POLICY "Users can read own imported recipes" ON user_imported_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own imported recipes" ON user_imported_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own imported recipes" ON user_imported_recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own imported recipes" ON user_imported_recipes
  FOR DELETE USING (auth.uid() = user_id);

-- USER ADAPTED RECIPES (update existing policies)
DROP POLICY IF EXISTS "Users can read own adapted recipes" ON user_adapted_recipes;
DROP POLICY IF EXISTS "Users can insert own adapted recipes" ON user_adapted_recipes;
DROP POLICY IF EXISTS "Users can update own adapted recipes" ON user_adapted_recipes;
DROP POLICY IF EXISTS "Users can delete own adapted recipes" ON user_adapted_recipes;

CREATE POLICY "Users can read own adapted recipes" ON user_adapted_recipes
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own adapted recipes" ON user_adapted_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own adapted recipes" ON user_adapted_recipes
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own adapted recipes" ON user_adapted_recipes
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- RECIPES TABLE: Update RLS for private/user-owned recipes
DROP POLICY IF EXISTS "Public can read published recipes" ON recipes;

CREATE POLICY "Public can read public recipes" ON recipes
  FOR SELECT USING (NOT is_private OR auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" ON recipes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 11. TRIGGERS FOR UPDATED_AT
-- ============================================
-- Reuse existing update_updated_at_column() function from schema.sql

-- ============================================
-- 12. HELPER FUNCTION: Create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, created_at, updated_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name' || NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'avatar_url', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  
  -- Create default preferences
  INSERT INTO public.user_preferences (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 13. STORAGE BUCKET FOR AVATARS (Optional)
-- ============================================
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
-- ON CONFLICT (id) DO NOTHING;

-- CREATE POLICY "Users can upload own avatar" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
-- 
-- CREATE POLICY "Users can read own avatar" ON storage.objects
--   FOR SELECT USING (bucket_id = 'avatars' AND auth.uid() = owner);
-- 
-- CREATE POLICY "Users can update own avatar" ON storage.objects
--   FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);
-- 
-- CREATE POLICY "Users can delete own avatar" ON storage.objects
--   FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);