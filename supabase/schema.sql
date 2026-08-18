-- CookFlow Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cuisines table (reference data)
CREATE TABLE cuisines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color_class TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table (reference data)
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  type TEXT CHECK (type IN ('meal', 'diet', 'style')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Difficulties table (reference data)
CREATE TABLE difficulties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color_class TEXT,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredients table (normalized)
CREATE TABLE ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT REFERENCES ingredient_categories(id),
  unit_type TEXT, -- 'weight', 'volume', 'count', 'other'
  canonical_name TEXT, -- for future ingredient matching
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredient categories
CREATE TABLE ingredient_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color_class TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main recipes table
CREATE TABLE recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  cuisine_id TEXT REFERENCES cuisines(id),
  category_id TEXT REFERENCES categories(id),
  meal_type_id TEXT REFERENCES categories(id),
  diet_type_id TEXT REFERENCES categories(id),
  difficulty_id TEXT REFERENCES difficulties(id),
  prep_time_minutes INTEGER DEFAULT 0 CHECK (prep_time_minutes >= 0),
  cook_time_minutes INTEGER DEFAULT 0 CHECK (cook_time_minutes >= 0),
  total_time_minutes INTEGER GENERATED ALWAYS AS (prep_time_minutes + cook_time_minutes) STORED,
  servings INTEGER DEFAULT 1 CHECK (servings > 0),
  rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
  calories INTEGER,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  source_type TEXT CHECK (source_type IN ('manual', 'ai_generated', 'imported', 'user_submitted')),
  source_url TEXT,
  source_platform TEXT,
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_confidence NUMERIC(3,2),
  source_creator TEXT,
  original_recipe_id UUID REFERENCES recipes(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipe ingredients junction table
CREATE TABLE recipe_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC(10,3) NOT NULL,
  unit TEXT NOT NULL,
  preparation TEXT, -- e.g., 'diced', 'minced', 'sliced'
  is_optional BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recipe_id, ingredient_id, preparation)
);

-- Recipe steps table
CREATE TABLE recipe_steps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  duration_seconds INTEGER,
  temperature TEXT, -- e.g., '180°C', '350°F', 'medium-high'
  tip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recipe_id, step_number)
);

-- Recipe tags junction table
CREATE TABLE recipe_tags (
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine_id);
CREATE INDEX idx_recipes_category ON recipes(category_id);
CREATE INDEX idx_recipes_meal_type ON recipes(meal_type_id);
CREATE INDEX idx_recipes_diet_type ON recipes(diet_type_id);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty_id);
CREATE INDEX idx_recipes_is_vegetarian ON recipes(is_vegetarian);
CREATE INDEX idx_recipes_is_vegan ON recipes(is_vegan);
CREATE INDEX idx_recipes_is_gluten_free ON recipes(is_gluten_free);
CREATE INDEX idx_recipes_rating ON recipes(rating DESC);
CREATE INDEX idx_recipes_total_time ON recipes(total_time_minutes);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_recipes_title_search ON recipes USING GIN (to_tsvector('english', title));
CREATE INDEX idx_recipes_description_search ON recipes USING GIN (to_tsvector('english', description));

CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);

CREATE INDEX idx_recipe_steps_recipe ON recipe_steps(recipe_id);

CREATE INDEX idx_recipe_tags_recipe ON recipe_tags(recipe_id);
CREATE INDEX idx_recipe_tags_tag ON recipe_tags(tag_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE difficulties ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_categories ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read published recipes" ON recipes
  FOR SELECT USING (true);

CREATE POLICY "Public can read recipe ingredients" ON recipe_ingredients
  FOR SELECT USING (true);

CREATE POLICY "Public can read recipe steps" ON recipe_steps
  FOR SELECT USING (true);

CREATE POLICY "Public can read recipe tags" ON recipe_tags
  FOR SELECT USING (true);

CREATE POLICY "Public can read ingredients" ON ingredients
  FOR SELECT USING (true);

CREATE POLICY "Public can read tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Public can read cuisines" ON cuisines
  FOR SELECT USING (true);

CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read difficulties" ON difficulties
  FOR SELECT USING (true);

CREATE POLICY "Public can read ingredient categories" ON ingredient_categories
  FOR SELECT USING (true);