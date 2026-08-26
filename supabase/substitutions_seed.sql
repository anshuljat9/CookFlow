-- Substitution Seed Data
-- Run this after running substitutions_schema.sql

-- First, update ingredients with roles
-- We'll use canonical_name to match ingredients
UPDATE ingredients SET role = 'aromatic' WHERE canonical_name IN ('onion', 'garlic', 'ginger', 'shallot', 'leek', 'green onion');
UPDATE ingredients SET role = 'fat' WHERE canonical_name IN ('butter', 'ghee', 'olive oil', 'vegetable oil', 'canola oil', 'coconut oil', 'sesame oil', 'bacon');
UPDATE ingredients SET role = 'liquid' WHERE canonical_name IN ('water', 'milk', 'heavy cream', 'broth', 'stock', 'coconut milk', 'coconut cream');
UPDATE ingredients SET role = 'dairy' WHERE canonical_name IN ('milk', 'heavy cream', 'yogurt', 'sour cream', 'cream cheese', 'buttermilk', 'evaporated milk', 'condensed milk');
UPDATE ingredients SET role = 'acid' WHERE canonical_name IN ('lemon', 'lime', 'vinegar', 'apple cider vinegar', 'rice vinegar', 'balsamic vinegar', 'red wine vinegar', 'lemon juice', 'lime juice');
UPDATE ingredients SET role = 'sweetener' WHERE canonical_name IN ('sugar', 'brown sugar', 'honey', 'maple syrup', 'palm sugar', 'jaggery', 'coconut sugar');
UPDATE ingredients SET role = 'thickener' WHERE canonical_name IN ('flour', 'cornstarch', 'arrowroot', 'potato starch', 'tapioca starch', 'xanthan gum');
UPDATE ingredients SET role = 'binder' WHERE canonical_name IN ('egg', 'eggs', 'breadcrumbs', 'panko', 'flax seeds', 'chia seeds', 'gelatin');
UPDATE ingredients SET role = 'leavener' WHERE canonical_name IN ('baking powder', 'baking soda', 'yeast', 'active dry yeast', 'instant yeast');
UPDATE ingredients SET role = 'protein' WHERE canonical_name IN ('chicken breast', 'chicken thigh', 'beef', 'ground beef', 'pork', 'fish', 'salmon', 'shrimp', 'tofu', 'tempeh', 'chickpeas', 'lentils', 'beans');
UPDATE ingredients SET role = 'seasoning' WHERE canonical_name IN ('salt', 'black pepper', 'pepper');
UPDATE ingredients SET role = 'flavor' WHERE canonical_name IN ('basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro', 'mint', 'dill', 'tarragon', 'vanilla extract', 'vanilla');
UPDATE ingredients SET role = 'texture' WHERE canonical_name IN ('nuts', 'peanuts', 'almonds', 'cashews', 'walnuts', 'pistachios', 'breadcrumbs', 'panko', 'coconut');
UPDATE ingredients SET role = 'structural' WHERE canonical_name IN ('egg', 'eggs', 'flour', 'gelatin');

-- For ingredients not explicitly set, default to 'other'
UPDATE ingredients SET role = 'other' WHERE role IS NULL;

-- Now insert common substitutions
-- Using the canonical_name to find ingredient IDs

-- Heavy Cream substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'heavy cream'),
  (SELECT id FROM ingredients WHERE canonical_name = 'milk'),
  0.8, 'ml', 'sauces,soups,curries,pasta', 'high', 0.90,
  'Slightly less rich', 'Slightly thinner', 'Add butter for richness', 'Use whole milk for best results'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'heavy cream') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'milk');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'heavy cream'),
  (SELECT id FROM ingredients WHERE canonical_name = 'butter'),
  0.2, 'g', 'sauces,soups,curries,pasta', 'high', 0.88,
  'Adds richness', 'Adds body', 'Combine with milk', 'Use with 80% milk'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'heavy cream') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'butter');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'heavy cream'),
  (SELECT id FROM ingredients WHERE canonical_name = 'evaporated milk'),
  1.0, 'ml', 'sauces,soups,baking', 'high', 0.85,
  'Slightly caramelized flavor', 'Similar richness', 'Do not use sweetened condensed milk', 'Best for cooking, not whipping'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'heavy cream') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'evaporated milk');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'heavy cream'),
  (SELECT id FROM ingredients WHERE canonical_name = 'coconut cream'),
  1.0, 'ml', 'curries,thai,desserts,vegan', 'high', 0.88,
  'Coconut flavor', 'Rich and thick', 'Will add coconut taste', 'Chill can and use solid part'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'heavy cream') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'coconut cream');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'heavy cream'),
  (SELECT id FROM ingredients WHERE canonical_name = 'greek yogurt'),
  0.5, 'ml', 'sauces,dips,cold dishes', 'medium', 0.70,
  'Tangy flavor', 'Thicker', 'Temper before adding to hot dishes', 'Mix with milk to thin'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'heavy cream') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'greek yogurt');

-- Buttermilk substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'buttermilk'),
  (SELECT id FROM ingredients WHERE canonical_name = 'milk'),
  1.0, 'ml', 'baking,marinades', 'high', 0.85,
  'Less tangy', 'Similar', 'Add acid to milk', 'Use 1 tbsp lemon juice/vinegar per cup milk, let sit 5 min'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'buttermilk') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'milk');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'buttermilk'),
  (SELECT id FROM ingredients WHERE canonical_name = 'yogurt'),
  0.75, 'ml', 'baking,marinades,dressings', 'high', 0.80,
  'Tangy', 'Thicker', 'Thin with water/milk', 'Plain yogurt works best'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'buttermilk') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'yogurt');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'buttermilk'),
  (SELECT id FROM ingredients WHERE canonical_name = 'sour cream'),
  0.75, 'ml', 'baking,dips,dressings', 'medium', 0.75,
  'Tangy', 'Thick', 'Thin with water/milk', 'Good for baking'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'buttermilk') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'sour cream');

-- Sour cream substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'sour cream'),
  (SELECT id FROM ingredients WHERE canonical_name = 'greek yogurt'),
  1.0, 'g', 'dips,baking,tacos,sauces', 'high', 0.90,
  'Similar tang', 'Similar', 'Full fat works best', 'Best all-around substitute'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'sour cream') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'greek yogurt');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'sour cream'),
  (SELECT id FROM ingredients WHERE canonical_name = 'cream cheese'),
  1.0, 'g', 'dips,cheesecake,frosting', 'medium', 0.70,
  'Less tangy', 'Thicker', 'Soften and thin with milk', 'Add lemon juice for tang'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'sour cream') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'cream cheese');

-- Greek yogurt substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'greek yogurt'),
  (SELECT id FROM ingredients WHERE canonical_name = 'plain yogurt'),
  1.0, 'g', 'sauces,marinades,baking', 'high', 0.85,
  'Less tangy', 'Thinner', 'Strain for thicker consistency', 'Regular yogurt is thinner'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'greek yogurt') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'plain yogurt');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'greek yogurt'),
  (SELECT id FROM ingredients WHERE canonical_name = 'sour cream'),
  1.0, 'g', 'dips,sauces,baking', 'high', 0.88,
  'Similar', 'Similar', 'Very close substitute', 'Nearly identical'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'greek yogurt') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'sour cream');

-- Butter substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'butter'),
  (SELECT id FROM ingredients WHERE canonical_name = 'ghee'),
  1.0, 'g', 'cooking,frying,sautéing', 'high', 0.95,
  'Nutty, rich', 'Same', 'Higher smoke point', 'Best for high heat'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'butter') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'ghee');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'butter'),
  (SELECT id FROM ingredients WHERE canonical_name = 'olive oil'),
  0.75, 'ml', 'sautéing,roasting,baking', 'medium', 0.75,
  'Fruity, olive flavor', 'Crispier', 'Not for creaming', 'Use 3/4 amount of oil'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'butter') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'olive oil');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'butter'),
  (SELECT id FROM ingredients WHERE canonical_name = 'coconut oil'),
  1.0, 'g', 'baking,vegan,cooking', 'high', 0.85,
  'Coconut flavor (refined has less)', 'Similar', 'Solid at room temp', 'Refined = less coconut taste'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'butter') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'coconut oil');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'butter'),
  (SELECT id FROM ingredients WHERE canonical_name = 'vegetable oil'),
  0.75, 'ml', 'baking,cooking', 'medium', 0.70,
  'Neutral', 'Moister', 'Not for creaming', 'Use 3/4 cup oil per 1 cup butter'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'butter') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'vegetable oil');

-- Oil substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'vegetable oil'),
  (SELECT id FROM ingredients WHERE canonical_name = 'canola oil'),
  1.0, 'ml', 'all purpose', 'high', 0.95,
  'Nearly identical', 'Identical', 'Interchangeable', 'Same smoke point'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'vegetable oil') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'canola oil');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'olive oil'),
  (SELECT id FROM ingredients WHERE canonical_name = 'vegetable oil'),
  1.0, 'ml', 'cooking,baking', 'low', 0.50,
  'Loses olive flavor', 'Similar', 'Not for finishing', 'Only if no other option'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'olive oil') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'vegetable oil');

-- Milk substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'milk'),
  (SELECT id FROM ingredients WHERE canonical_name = 'water'),
  1.0, 'ml', 'baking,emergency', 'low', 0.40,
  'No richness', 'Thinner', 'Add butter for fat', 'Only in emergencies'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'milk') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'water');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'milk'),
  (SELECT id FROM ingredients WHERE canonical_name = 'coconut milk'),
  1.0, 'ml', 'curries,smoothies,baking,vegan', 'high', 0.85,
  'Coconut flavor', 'Creamier', 'Shake can first', 'Full fat for richness'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'milk') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'coconut milk');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'milk'),
  (SELECT id FROM ingredients WHERE canonical_name = 'almond milk'),
  1.0, 'ml', 'baking,smoothies,vegan', 'medium', 0.70,
  'Nutty', 'Thinner', 'Unsweetened preferred', 'May need thickener'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'milk') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'almond milk');

-- Lemon juice substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'lemon juice'),
  (SELECT id FROM ingredients WHERE canonical_name = 'lime juice'),
  1.0, 'ml', 'all', 'high', 0.95,
  'Lime flavor', 'Identical', 'Nearly identical acidity', 'Best direct substitute'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'lemon juice') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'lime juice');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'lemon juice'),
  (SELECT id FROM ingredients WHERE canonical_name = 'vinegar'),
  0.5, 'ml', 'cooking,baking', 'medium', 0.70,
  'Vinegar taste', 'Similar', 'Use half amount', 'White or apple cider vinegar'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'lemon juice') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'vinegar');

-- Vinegar substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'vinegar'),
  (SELECT id FROM ingredients WHERE canonical_name = 'lemon juice'),
  2.0, 'ml', 'cooking,marinades,dressings', 'medium', 0.70,
  'Citrus flavor', 'Similar', 'Use double amount', 'Fresh preferred'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'vinegar') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'lemon juice');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'apple cider vinegar'),
  (SELECT id FROM ingredients WHERE canonical_name = 'white vinegar'),
  1.0, 'ml', 'cooking,baking,pickling', 'high', 0.85,
  'Less fruity', 'Identical', 'Add pinch of sugar', 'Nearly identical acidity'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'apple cider vinegar') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'white vinegar');

-- Herb substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'parsley'),
  (SELECT id FROM ingredients WHERE canonical_name = 'cilantro'),
  1.0, 'g', 'garnish,salsas,mexican', 'medium', 0.70,
  'Cilantro flavor', 'Similar', 'Different flavor profile', 'Use half amount if strong'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'parsley') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'cilantro');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'cilantro'),
  (SELECT id FROM ingredients WHERE canonical_name = 'parsley'),
  1.0, 'g', 'garnish,italian,mediterranean', 'medium', 0.70,
  'Parsley flavor', 'Similar', 'Less citrusy', 'Add lemon zest for brightness'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'cilantro') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'parsley');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'basil'),
  (SELECT id FROM ingredients WHERE canonical_name = 'oregano'),
  0.5, 'g', 'italian,tomato sauces,pizza', 'medium', 0.65,
  'Earthier', 'Similar', 'Use half amount', 'Dried oregano more potent'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'basil') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'oregano');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'thyme'),
  (SELECT id FROM ingredients WHERE canonical_name = 'oregano'),
  1.0, 'g', 'roasting,soups,stews', 'medium', 0.70,
  'More pungent', 'Similar', 'Use sparingly', 'Oregano is stronger'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'thyme') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'oregano');

-- Spice substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'cumin'),
  (SELECT id FROM ingredients WHERE canonical_name = 'coriander'),
  0.5, 'g', 'mexican,indian,middle eastern', 'low', 0.45,
  'Different flavor', 'Similar', 'Very different profile', 'Only in emergencies'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'cumin') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'coriander');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'fresh garlic'),
  (SELECT id FROM ingredients WHERE canonical_name = 'garlic powder'),
  0.125, 'tsp', 'all cooking', 'high', 0.85,
  'Less pungent', 'No texture', '1 clove = 1/8 tsp powder', 'Add later in cooking'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'garlic') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'garlic powder');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'fresh ginger'),
  (SELECT id FROM ingredients WHERE canonical_name = 'ginger powder'),
  0.25, 'tsp', 'baking,curries,tea', 'high', 0.80,
  'Less bright', 'No texture', '1 tbsp fresh = 1/4 tsp powder', 'Add earlier for infusion'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'ginger') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'ginger powder');

-- Egg substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'egg'),
  (SELECT id FROM ingredients WHERE canonical_name = 'flax seeds'),
  1, 'tbsp', 'baking,vegan', 'medium', 0.70,
  'Nutty', 'Denser', '1 tbsp flax + 3 tbsp water = 1 egg', 'Let sit 5 min to gel'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'egg') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'flax seeds');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'egg'),
  (SELECT id FROM ingredients WHERE canonical_name = 'chia seeds'),
  1, 'tbsp', 'baking,vegan', 'medium', 0.70,
  'Neutral', 'Denser', '1 tbsp chia + 3 tbsp water = 1 egg', 'Let sit 5 min to gel'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'egg') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'chia seeds');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'egg'),
  (SELECT id FROM ingredients WHERE canonical_name = 'applesauce'),
  0.25, 'cup', 'baking,sweet', 'medium', 0.65,
  'Sweet, apple', 'Moist', '1/4 cup = 1 egg', 'Adds moisture, reduce sugar'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'egg') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'applesauce');

-- Cornstarch substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'cornstarch'),
  (SELECT id FROM ingredients WHERE canonical_name = 'flour'),
  2.0, 'tbsp', 'thickening,sauces,gravy', 'high', 0.85,
  'Slight flour taste', 'More opaque', 'Use 2x amount', 'Cook longer to remove flour taste'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'cornstarch') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'flour');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'cornstarch'),
  (SELECT id FROM ingredients WHERE canonical_name = 'arrowroot'),
  1.0, 'tbsp', 'thickening,sauces,clear gels', 'high', 0.90,
  'Neutral', 'Clear', 'Same ratio', 'Better for fruit sauces'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'cornstarch') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'arrowroot');

-- Breadcrumbs substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'breadcrumbs'),
  (SELECT id FROM ingredients WHERE canonical_name = 'panko'),
  1.0, 'cup', 'coating,binding', 'high', 0.95,
  'Crispier', 'Flakier', 'Lighter texture', 'Excellent for coating'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'breadcrumbs') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'panko');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'breadcrumbs'),
  (SELECT id FROM ingredients WHERE canonical_name = 'crushed crackers'),
  1.0, 'cup', 'coating,binding,meatloaf', 'high', 0.85,
  'Cracker flavor', 'Similar', 'Salted crackers = reduce salt', 'Saltines or Ritz work'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'breadcrumbs') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'crushed crackers');

-- Cheese substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'parmesan'),
  (SELECT id FROM ingredients WHERE canonical_name = 'pecorino romano'),
  1.0, 'g', 'pasta,risotto,salads', 'high', 0.90,
  'Sharper, saltier', 'Similar', 'Reduce added salt', 'Sheep milk cheese'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'parmesan') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'pecorino romano');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'parmesan'),
  (SELECT id FROM ingredients WHERE canonical_name = 'grana padano'),
  1.0, 'g', 'pasta,risotto', 'high', 0.88,
  'Milder, nutty', 'Similar', 'Good alternative', 'Less salty than parmesan'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'parmesan') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'grana padano');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'mozzarella'),
  (SELECT id FROM ingredients WHERE canonical_name = 'provolone'),
  1.0, 'g', 'pizza,melting', 'high', 0.85,
  'Sharper', 'Melts well', 'Good melt', 'Aged provolone = sharper'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'mozzarella') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'provolone');

-- Brown sugar substitution
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'brown sugar'),
  (SELECT id FROM ingredients WHERE canonical_name = 'white sugar'),
  1.0, 'cup', 'baking,cooking', 'high', 0.85,
  'Less molasses flavor', 'Drier', 'Add 1 tbsp molasses per cup', 'Pack firmly when measuring'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'brown sugar') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'white sugar');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'brown sugar'),
  (SELECT id FROM ingredients WHERE canonical_name = 'white sugar'),
  1.0, 'cup', 'baking,cooking', 'high', 0.80,
  'Molasses flavor', 'Moist', '1 cup white + 1 tbsp molasses', 'Mix thoroughly'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'brown sugar') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'molasses');

-- Honey substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'honey'),
  (SELECT id FROM ingredients WHERE canonical_name = 'maple syrup'),
  1.0, 'tbsp', 'baking,dressings,tea', 'high', 0.88,
  'Maple flavor', 'Thinner', 'Slightly thinner', '1:1 ratio works'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'honey') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'maple syrup');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'honey'),
  (SELECT id FROM ingredients WHERE canonical_name = 'white sugar'),
  1.25, 'cup', 'baking', 'medium', 0.65,
  'No floral notes', 'Crispier', 'Add 1/4 cup liquid', 'Reduce oven temp 25°F'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'honey') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'white sugar');

-- Soy sauce substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'soy sauce'),
  (SELECT id FROM ingredients WHERE canonical_name = 'tamari'),
  1.0, 'ml', 'gluten-free,all', 'high', 0.95,
  'Similar, less wheat', 'Identical', 'Gluten-free', 'Nearly identical'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'soy sauce') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'tamari');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'soy sauce'),
  (SELECT id FROM ingredients WHERE canonical_name = 'coconut aminos'),
  1.0, 'ml', 'gluten-free,soy-free,paleo', 'high', 0.85,
  'Sweeter, less salty', 'Thinner', 'Less sodium', 'Coconut sap based'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'soy sauce') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'coconut aminos');

-- Fish sauce substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'fish sauce'),
  (SELECT id FROM ingredients WHERE canonical_name = 'soy sauce'),
  1.0, 'ml', 'thai,vietnamese,marinades', 'medium', 0.65,
  'Less umami', 'Similar', 'Add anchovy paste if have', 'Not vegetarian'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'fish sauce') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'soy sauce');

-- Tomato paste substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'tomato paste'),
  (SELECT id FROM ingredients WHERE canonical_name = 'tomato sauce'),
  3.0, 'tbsp', 'sauces,stews', 'medium', 0.70,
  'Less concentrated', 'Thinner', 'Reduce liquid in recipe', 'Simmer to thicken'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'tomato paste') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'tomato sauce');

-- Mayonnaise substitutions
INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'mayonnaise'),
  (SELECT id FROM ingredients WHERE canonical_name = 'greek yogurt'),
  1.0, 'tbsp', 'salads,sandwiches,dips,cold', 'medium', 0.70,
  'Tangy', 'Thicker', 'Not for baking', 'Add lemon juice + oil'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'mayonnaise') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'greek yogurt');

INSERT INTO ingredient_substitutions (ingredient_id, substitute_ingredient_id, quantity_ratio, unit, conditions, confidence, confidence_score, taste_impact, texture_impact, warnings, notes)
SELECT 
  (SELECT id FROM ingredients WHERE canonical_name = 'mayonnaise'),
  (SELECT id FROM ingredients WHERE canonical_name = 'sour cream'),
  1.0, 'tbsp', 'dips,dressings,cold', 'medium', 0.75,
  'Tangy', 'Similar', 'Not for baking', 'Good for cold dishes'
WHERE EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'mayonnaise') AND EXISTS (SELECT 1 FROM ingredients WHERE canonical_name = 'sour cream');

ON CONFLICT (ingredient_id, substitute_ingredient_id, conditions) DO NOTHING;