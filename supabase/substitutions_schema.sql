-- Substitution System Schema
-- Run this in Supabase SQL Editor after running schema.sql

-- Ingredient roles for substitution reasoning
CREATE TABLE ingredient_roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert standard ingredient roles
INSERT INTO ingredient_roles (id, name, description) VALUES
('fat', 'Fat', 'Provides richness, mouthfeel, and carries flavor (butter, oil, cream)'),
('liquid', 'Liquid', 'Provides moisture and carries other ingredients (water, milk, broth)'),
('acid', 'Acid', 'Provides acidity, brightness, and can tenderize (lemon, vinegar, yogurt)'),
('sweetener', 'Sweetener', 'Provides sweetness (sugar, honey, maple syrup)'),
('thickener', 'Thickener', 'Thickens sauces and liquids (flour, cornstarch, arrowroot)'),
('binder', 'Binder', 'Binds ingredients together (eggs, breadcrumbs, gelatin)'),
('leavener', 'Leavener', 'Causes rising (baking powder, baking soda, yeast)'),
('protein', 'Protein', 'Main protein source (meat, fish, tofu, beans)'),
('aromatic', 'Aromatic', 'Provides base flavor foundation (onion, garlic, ginger)'),
('seasoning', 'Seasoning', 'Enhances flavor (salt, pepper, spices)'),
('texture', 'Texture', 'Provides specific texture (nuts, breadcrumbs, coconut)'),
('flavor', 'Flavor', 'Primary flavor component (herbs, citrus zest, vanilla)'),
('dairy', 'Dairy', 'Dairy-specific role for milk-based substitutions'),
('structural', 'Structural', 'Critical for structure (eggs in meringue, flour in bread)'),
('other', 'Other', 'Miscellaneous roles')
ON CONFLICT (id) DO NOTHING;

-- Add role column to ingredients table
ALTER TABLE ingredients ADD COLUMN IF NOT EXISTS role TEXT REFERENCES ingredient_roles(id);

-- Ingredient substitutions table
-- Supports multi-ingredient substitutions (one missing -> many substitutes)
CREATE TABLE ingredient_substitutions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  substitute_ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_ratio NUMERIC(10,3) NOT NULL, -- How much substitute per 1 unit of original
  unit TEXT NOT NULL, -- Unit for the substitute quantity
  conditions TEXT, -- When this substitution applies (e.g., 'sauces,curries,baking')
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')) DEFAULT 'medium',
  confidence_score NUMERIC(3,2) DEFAULT 0.70, -- 0.00 to 1.00
  taste_impact TEXT, -- e.g., 'Slightly less rich', 'Similar flavor profile'
  texture_impact TEXT, -- e.g., 'Slightly thinner', 'Similar texture'
  warnings TEXT, -- Any cautions or limitations
  notes TEXT, -- Additional notes
  is_ai_generated BOOLEAN DEFAULT FALSE,
  ai_model TEXT, -- Which AI model generated this
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ingredient_id, substitute_ingredient_id, conditions)
);

-- Index for faster lookups
CREATE INDEX idx_ingredient_substitutions_ingredient ON ingredient_substitutions(ingredient_id);
CREATE INDEX idx_ingredient_substitutions_substitute ON ingredient_substitutions(substitute_ingredient_id);

-- Update trigger for ingredient_substitutions
CREATE OR REPLACE FUNCTION update_substitutions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ingredient_substitutions_updated_at
  BEFORE UPDATE ON ingredient_substitutions
  FOR EACH ROW
  EXECUTE FUNCTION update_substitutions_updated_at();

-- Enable RLS
ALTER TABLE ingredient_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_substitutions ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read ingredient roles" ON ingredient_roles
  FOR SELECT USING (true);

CREATE POLICY "Public can read ingredient substitutions" ON ingredient_substitutions
  FOR SELECT USING (true);

-- User adapted recipes storage (for local persistence, synced if auth exists)
CREATE TABLE user_adapted_recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID, -- Null for anonymous/local storage
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  original_recipe_id UUID REFERENCES recipes(id),
  adaptations JSONB NOT NULL, -- Stores all substitutions, adapted ingredients, adapted steps
  servings INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_adapted_recipes_user ON user_adapted_recipes(user_id);
CREATE INDEX idx_user_adapted_recipes_recipe ON user_adapted_recipes(recipe_id);

ALTER TABLE user_adapted_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own adapted recipes" ON user_adapted_recipes
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own adapted recipes" ON user_adapted_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own adapted recipes" ON user_adapted_recipes
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own adapted recipes" ON user_adapted_recipes
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Update trigger for user_adapted_recipes
CREATE TRIGGER update_user_adapted_recipes_updated_at
  BEFORE UPDATE ON user_adapted_recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_substitutions_updated_at();