-- Recipe: Butter Chicken
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', 'Butter Chicken', 'butter-chicken', 'Creamy, rich, and perfectly spiced chicken in a velvety tomato-based sauce.', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop', 'indian', 'dinner', 'dinner', NULL, 'medium', 14, 31, 4, 4.8, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'chicken breast'), 500, 'gram', 'cubed', false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'yogurt'), 1, 'cup', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'garlic'), 2, 'tablespoon', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'turmeric'), 1, 'teaspoon', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'red chili powder'), 1, 'teaspoon', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'butter'), 2, 'tablespoon', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'onion'), 1, 'large', 'pureed', false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'tomato'), 2, 'cups', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'heavy cream'), 1, 'cup', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'garam masala'), 1, 'teaspoon', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'kasuri methi'), 1, 'teaspoon', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'salt'), 1, 'count', NULL, false, 11)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM ingredients WHERE canonical_name = 'cilantro'), 1, 'count', NULL, false, 12)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', 1, 'Marinate chicken with yogurt, ginger-garlic paste, turmeric, chili powder, and salt for 30 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', 2, 'Grill or pan-fry chicken until slightly charred. Set aside.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', 3, 'In a pan, melt butter and sauté onion puree until golden brown.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', 4, 'Add tomato puree and cook until oil separates.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', 5, 'Add cream, garam masala, and kasuri methi. Simmer for 5 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', 6, 'Add cooked chicken and simmer for 10 minutes until flavors meld.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', 7, 'Garnish with cilantro and serve with naan or rice.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM tags WHERE name = 'popular'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('8b2d70a5-9aa9-44b3-9d2b-7bbbccbcc5e4', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Margherita Pizza
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', 'Margherita Pizza', 'margherita-pizza', 'Classic Neapolitan pizza with fresh mozzarella, San Marzano tomatoes, and basil.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop', 'italian', 'dinner', 'dinner', NULL, 'medium', 9, 21, 2, 4.7, 0, NULL, true, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', (SELECT id FROM ingredients WHERE canonical_name = 'flour'), 250, 'gram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', (SELECT id FROM ingredients WHERE canonical_name = 'tomato sauce'), 100, 'gram', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', (SELECT id FROM ingredients WHERE canonical_name = 'mozzarella'), 150, 'gram', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', (SELECT id FROM ingredients WHERE canonical_name = 'basil leaves'), 1, 'count', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', (SELECT id FROM ingredients WHERE canonical_name = 'olive oil'), 1, 'count', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', (SELECT id FROM ingredients WHERE canonical_name = 'salt'), 1, 'count', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', 1, 'Preheat oven to 475°F (245°C) with pizza stone inside.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', 2, 'Stretch dough on floured surface to 12-inch circle.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', 3, 'Spread tomato sauce evenly, leaving 1-inch border.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', 4, 'Tear mozzarella and distribute over sauce.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', 5, 'Bake for 10-12 minutes until crust is golden and cheese bubbles.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', 6, 'Top with fresh basil and drizzle olive oil.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', (SELECT id FROM tags WHERE name = 'popular'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('99213d5f-c5ec-4b9a-a0ac-b70cd502734a', (SELECT id FROM tags WHERE name = 'vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Kung Pao Chicken
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', 'Kung Pao Chicken', 'kung-pao-chicken', 'Spicy Sichuan stir-fry with chicken, peanuts, and dried chilies.', 'https://images.unsplash.com/photo-1598515028193-3bb5f721d3b2?w=800&auto=format&fit=crop', 'chinese', 'dinner', 'dinner', NULL, 'medium', 8, 17, 3, 4.6, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'chicken thigh'), 300, 'gram', 'diced', false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'roasted peanuts'), 1.2, 'cup', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'chili'), 6, 'dried', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'pepper'), 1, 'bell', 'cubed', false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = ', cubed'), 1, 'onion', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'soy sauce'), 3, 'tablespoon', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'dark soy sauce'), 1, 'tablespoon', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'vinegar'), 1, 'tablespoon', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'sugar'), 1, 'tablespoon', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'cornstarch'), 1, 'teaspoon', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'vegetable oil'), 2, 'tablespoon', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'sichuan peppercorn'), 2, 'teaspoon', NULL, false, 11)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'cloves'), 3, 'garlic', 'minced', false, 12)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'ginger'), 1, 'teaspoon', 'minced', false, 13)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM ingredients WHERE canonical_name = 'onions'), 2, 'green', 'chopped', false, 14)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', 1, 'Marinate chicken with soy sauce, cornstarch, and 1 tbsp oil for 15 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', 2, 'Mix sauce: soy sauces, vinegar, sugar, and 2 tbsp water.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', 3, 'Toast Sichuan peppercorns, crush lightly.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', 4, 'Stir-fry chicken until cooked through. Remove.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', 5, 'Stir-fry chilies, peppercorns, garlic, ginger until fragrant.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', 6, 'Add vegetables, stir-fry 2 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', 7, 'Return chicken, add sauce, toss with peanuts and green onions.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM tags WHERE name = 'spicy'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('65a1bc74-c5e5-4a39-887d-00589b43b1c9', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Chicken Tacos al Pastor
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', 'Chicken Tacos al Pastor', 'chicken-tacos-al-pastor', 'Achiote-marinated chicken with pineapple, onion, and cilantro in corn tortillas.', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&auto=format&fit=crop', 'mexican', 'dinner', 'dinner', NULL, 'easy', 11, 24, 4, 4.9, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'chicken thigh, thinly sliced'), 500, 'gram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'achiote paste'), 3, 'tablespoon', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'orange'), 1.4, 'cup', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'lime'), 2, 'tablespoon', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'cloves'), 3, 'garlic', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'cumin'), 1, 'teaspoon', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'oregano'), 1, 'teaspoon', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = ', sliced'), 1, 'pineapple', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'tortilla'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = ', diced'), 1, 'onion', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'cilantro'), 1, 'count', 'chopped', false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'lime wedges'), 1, 'count', NULL, false, 11)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM ingredients WHERE canonical_name = 'salsa verde'), 1, 'count', NULL, false, 12)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', 1, 'Blend achiote, orange juice, lime, garlic, cumin, oregano into paste.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', 2, 'Marinate chicken for 2 hours or overnight.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', 3, 'Grill chicken and pineapple until charred.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', 4, 'Chop chicken, warm tortillas.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', 5, 'Assemble: chicken, pineapple, onion, cilantro, salsa.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', 6, 'Serve with lime wedges.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM tags WHERE name = 'popular'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('6fbd8c84-9c5c-49fc-9797-d2b43f47c3c5', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Korean Garlic Noodles
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', 'Korean Garlic Noodles', 'korean-garlic-noodles', 'Buttery, garlicky, spicy noodles ready in 15 minutes.', 'https://images.unsplash.com/photo-1619995987388-3e0b3e8a4c4a?w=800&auto=format&fit=crop', 'korean', 'lunch', 'lunch', NULL, 'easy', 5, 10, 2, 4.7, 0, NULL, true, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'spaghetti or wheat noodles'), 200, 'gram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'butter'), 4, 'tablespoon', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'cloves'), 8, 'garlic', 'minced', false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'soy sauce'), 2, 'tablespoon', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'gochugaru (korean chili flakes)'), 1, 'tablespoon', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'honey'), 1, 'tablespoon', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'sesame oil'), 1, 'teaspoon', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'green onion'), 1, 'count', 'chopped', false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'sesame seeds'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM ingredients WHERE canonical_name = 'fried egg'), 1, 'count', NULL, true, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', 1, 'Cook noodles al dente, reserve 1/2 cup pasta water.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', 2, 'Melt butter in large pan over medium heat.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', 3, 'Add garlic, cook until golden and fragrant (don''t burn).');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', 4, 'Add soy sauce, gochugaru, honey, sesame oil.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', 5, 'Toss in noodles with pasta water to create emulsion.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', 6, 'Top with green onions, sesame seeds, and fried egg.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM tags WHERE name = 'quick'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('cff6f677-7eaf-40c8-89a1-974521974c58', (SELECT id FROM tags WHERE name = 'vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Classic Cheeseburger
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', 'Classic Cheeseburger', 'classic-cheeseburger', 'Juicy beef patty with melted cheese, crisp lettuce, and special sauce.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop', 'american', 'dinner', 'dinner', NULL, 'easy', 6, 14, 2, 4.5, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = 'ground beef (80/20)'), 300, 'gram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = 'buns'), 2, 'brioche', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = 'cheddar'), 2, 'count', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = 'lettuce leaves'), 1, 'count', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = ', sliced'), 1, 'tomato', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = ', sliced'), 1.2, 'onion', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = 'pickles'), 1, 'count', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = 'mayonnaise'), 2, 'tablespoon', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = 'ketchup'), 1, 'tablespoon', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = 'mustard'), 1, 'teaspoon', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM ingredients WHERE canonical_name = 'salt, pepper'), 1, 'count', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', 1, 'Form beef into 2 patties, season generously with salt and pepper.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', 2, 'Heat cast iron skillet over high heat.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', 3, 'Cook patties 3-4 min per side, add cheese last minute.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', 4, 'Toast buns in same pan.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', 5, 'Mix mayo, ketchup, mustard for sauce.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', 6, 'Assemble: bun, sauce, lettuce, patty, tomato, onion, pickles, bun.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM tags WHERE name = 'popular'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('66c6155c-0902-4fee-b399-c8a80aad1329', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Greek Salad
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', 'Greek Salad', 'greek-salad', 'Fresh cucumbers, tomatoes, olives, feta, and oregano with olive oil.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop', 'mediterranean', 'lunch', 'lunch', NULL, 'easy', 3, 7, 4, 4.4, 0, NULL, true, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = ', chunked'), 2, 'cucumbers', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = ', wedged'), 4, 'tomatoes', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = 'onion'), 1, 'red', 'sliced', false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = 'pepper'), 1, 'green', 'sliced', false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = 'feta cheese, block'), 200, 'gram', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = 'olives'), 1, 'count', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = 'olive oil'), 1, 'count', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = 'red wine vinegar'), 1, 'count', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = 'oregano'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM ingredients WHERE canonical_name = 'salt, pepper'), 1, 'count', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', 1, 'Combine cucumbers, tomatoes, onion, pepper in large bowl.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', 2, 'Add olives.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', 3, 'Place feta block on top.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', 4, 'Drizzle generously with olive oil and vinegar.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', 5, 'Sprinkle oregano, salt, pepper.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', 6, 'Serve immediately with crusty bread.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM tags WHERE name = 'healthy'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM tags WHERE name = 'vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('95b3ef6b-ee63-40ae-b64e-3264ccb794d1', (SELECT id FROM tags WHERE name = 'quick'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Salmon Teriyaki
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', 'Salmon Teriyaki', 'salmon-teriyaki', 'Glazed salmon with sweet-savory teriyaki sauce, served over rice.', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop', 'japanese', 'dinner', 'dinner', NULL, 'easy', 6, 14, 2, 4.6, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'fillets (150g each)'), 2, 'salmon', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'soy sauce'), 3, 'tablespoon', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'mirin'), 2, 'tablespoon', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'sake'), 2, 'tablespoon', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'sugar'), 1, 'tablespoon', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'ginger'), 1, 'teaspoon', 'grated', false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'clove'), 1, 'garlic', 'minced', false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'cornstarch + 1 tbsp water'), 1, 'teaspoon', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'sesame seeds'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'green onion'), 1, 'count', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM ingredients WHERE canonical_name = 'steamed rice'), 1, 'count', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', 1, 'Mix soy sauce, mirin, sake, sugar, ginger, garlic.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', 2, 'Pan-sear salmon skin-side down 4 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', 3, 'Flip, add sauce, simmer until thickened.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', 4, 'Add cornstarch slurry for extra gloss.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', 5, 'Spoon glaze over salmon.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', 6, 'Serve over rice with sesame seeds and green onions.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM tags WHERE name = 'healthy'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('6fd9728f-de8a-4570-9886-ba9dc7a2a7c4', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Pad Thai
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', 'Pad Thai', 'pad-thai', 'Classic stir-fried rice noodles with tamarind, shrimp, peanuts, and lime.', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format&fit=crop', 'thai', 'dinner', 'dinner', NULL, 'medium', 9, 21, 2, 4.8, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'rice noodles'), 200, 'gram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'shrimp'), 150, 'gram', 'peeled', false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 's'), 2, 'egg', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'bean sprouts'), 1, 'cup', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'fish sauce'), 3, 'tablespoon', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'tamarind'), 2, 'tablespoon', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'palm sugar'), 1, 'tablespoon', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'chili powder'), 1, 'tablespoon', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'cloves'), 3, 'garlic', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'chives, cut'), 1.2, 'cup', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'peanuts'), 1.4, 'cup', 'crushed', false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'lime wedges'), 1, 'count', NULL, false, 11)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM ingredients WHERE canonical_name = 'vegetable oil'), 1, 'count', NULL, false, 12)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', 1, 'Soak noodles in warm water 20 minutes, drain.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', 2, 'Mix fish sauce, tamarind, sugar, chili powder.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', 3, 'Stir-fry shrimp until pink, remove.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', 4, 'Scramble eggs in same pan.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', 5, 'Add noodles, sauce, toss until coated.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', 6, 'Add shrimp, bean sprouts, chives.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', 7, 'Serve with peanuts and lime.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM tags WHERE name = 'popular'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('7bec2854-1ffb-4306-a9bc-1cf69a173926', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Chicken Alfredo
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', 'Chicken Alfredo', 'chicken-alfredo', 'Creamy fettuccine with tender chicken in rich parmesan sauce.', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop', 'continental', 'dinner', 'dinner', NULL, 'easy', 8, 17, 3, 4.5, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM ingredients WHERE canonical_name = 'fettuccine'), 300, 'gram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM ingredients WHERE canonical_name = 'breasts'), 2, 'chicken', 'sliced', false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM ingredients WHERE canonical_name = 'heavy cream'), 2, 'cups', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM ingredients WHERE canonical_name = 'parmesan'), 1, 'cup', 'grated', false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM ingredients WHERE canonical_name = 'butter'), 4, 'tablespoon', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM ingredients WHERE canonical_name = 'cloves'), 3, 'garlic', 'minced', false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM ingredients WHERE canonical_name = 'salt, pepper'), 1, 'count', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM ingredients WHERE canonical_name = 'nutmeg pinch'), 1, 'count', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM ingredients WHERE canonical_name = 'parsley'), 1, 'count', 'chopped', false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', 1, 'Cook pasta al dente, reserve 1 cup water.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', 2, 'Season chicken, pan-sear in 2 tbsp butter until golden. Remove.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', 3, 'In same pan, melt 2 tbsp butter, sauté garlic.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', 4, 'Add cream, simmer 3 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', 5, 'Whisk in parmesan until smooth.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', 6, 'Add chicken and pasta, toss with pasta water.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', 7, 'Garnish with parsley.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM tags WHERE name = 'popular'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('8172e734-6380-42a6-8231-19d4e59036b0', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Vegetable Biryani
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', 'Vegetable Biryani', 'vegetable-biryani', 'Fragrant layered rice with mixed vegetables, saffron, and aromatic spices.', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop', 'indian', 'dinner', 'dinner', NULL, 'hard', 18, 42, 4, 4.7, 0, NULL, true, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = 'basmati rice'), 2, 'cups', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = 'mixed vegetables (carrot, peas, beans, potato)'), 1, 'count', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = 'yogurt'), 1, 'cup', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = ', fried golden'), 2, 'onions', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = ', chopped'), 2, 'tomatoes', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = 'garlic'), 1, 'count', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = 'garam masala'), 1, 'count', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = 'saffron'), 1, 'count', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = 'mint, cilantro'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = 'ghee, oil'), 1, 'count', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM ingredients WHERE canonical_name = 'whole spices (bay leaf, cardamom, cloves, cinnamon)'), 1, 'count', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', 1, 'Soak rice 30 minutes. Par-boil with whole spices until 70% done.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', 2, 'Sauté vegetables with spices, yogurt, tomatoes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', 3, 'Layer: rice, vegetable mixture, fried onions, herbs, saffron milk.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', 4, 'Repeat layers. Seal pot with dough or tight lid.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', 5, 'Cook on dum (low heat) for 25 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', 6, 'Rest 10 minutes, gently mix before serving.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('f07cd481-6245-43d2-8b10-25f042104325', (SELECT id FROM tags WHERE name = 'vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Carbonara
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', 'Carbonara', 'carbonara', 'Silky pasta with guanciale, egg, pecorino, and black pepper. No cream.', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop', 'italian', 'dinner', 'dinner', NULL, 'medium', 6, 14, 2, 4.9, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', (SELECT id FROM ingredients WHERE canonical_name = 'spaghetti'), 200, 'gram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', (SELECT id FROM ingredients WHERE canonical_name = 'guanciale or pancetta'), 100, 'gram', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', (SELECT id FROM ingredients WHERE canonical_name = 'yolks + 1 whole egg'), 3, 'egg', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', (SELECT id FROM ingredients WHERE canonical_name = 'parmesan'), 50, 'gram', 'grated', false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', (SELECT id FROM ingredients WHERE canonical_name = 'black pepper, freshly cracked'), 1, 'count', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', (SELECT id FROM ingredients WHERE canonical_name = 'salt'), 1, 'count', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', 1, 'Cook pasta in salted water.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', 2, 'Crisp guanciale in cold pan, render fat.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', 3, 'Whisk eggs, pecorino, generous pepper.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', 4, 'Add 1/2 cup pasta water to guanciale, remove from heat.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', 5, 'Add pasta, toss vigorously.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', 6, 'Remove from heat completely, add egg mixture, toss rapidly.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', 7, 'Add more pasta water if needed. Serve immediately.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', (SELECT id FROM tags WHERE name = 'popular'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('7143fe8a-28a6-4cfa-a0c6-e73dabc281be', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Mapo Tofu
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', 'Mapo Tofu', 'mapo-tofu', 'Silken tofu in spicy, numbing Sichuan sauce with ground pork.', 'https://images.unsplash.com/photo-1585580750963-4d5f9d5a8c0a?w=800&auto=format&fit=crop', 'chinese', 'dinner', 'dinner', NULL, 'medium', 6, 14, 3, 4.6, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'silken tofu'), 400, 'gram', 'cubed', false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'ground pork'), 150, 'gram', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'doubanjiang (fermented bean paste)'), 2, 'tablespoon', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'fermented black beans'), 1, 'teaspoon', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'soy sauce'), 1, 'tablespoon', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'sugar'), 1, 'teaspoon', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'chicken stock'), 1, 'cup', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'cornstarch + 2 tbsp water'), 2, 'teaspoon', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'sichuan peppercorn powder'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'chili oil'), 1, 'count', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM ingredients WHERE canonical_name = 'green onion'), 1, 'count', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', 1, 'Blanch tofu in salted water 1 minute, drain.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', 2, 'Brown pork in oil, break into small pieces.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', 3, 'Add doubanjiang, black beans, stir until red oil appears.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', 4, 'Add stock, soy sauce, sugar, simmer.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', 5, 'Gently add tofu, don''t break.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', 6, 'Thicken with cornstarch slurry.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', 7, 'Finish with Sichuan pepper, chili oil, green onions.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM tags WHERE name = 'spicy'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('04fed1bf-05ea-4f18-abcd-77e4753b09bb', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Fish Tacos
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', 'Fish Tacos', 'fish-tacos', 'Crispy beer-battered fish with cabbage slaw and chipotle crema.', 'https://images.unsplash.com/photo-1559472091-2f25b6f65f7e?w=800&auto=format&fit=crop', 'mexican', 'lunch', 'lunch', NULL, 'easy', 8, 17, 3, 4.7, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'white fish (cod/tilapia)'), 300, 'gram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'flour'), 1, 'cup', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'cornstarch'), 1.2, 'cup', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'baking powder'), 1, 'teaspoon', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'beer'), 1, 'cup', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'cabbage slaw mix'), 1, 'count', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'mayo'), 1.2, 'cup', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'in adobo'), 1, 'chipotle', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'lime'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'tortilla'), 1, 'count', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM ingredients WHERE canonical_name = 'oil for frying'), 1, 'count', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', 1, 'Mix flour, cornstarch, baking powder, beer into batter.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', 2, 'Dip fish, fry at 375°F until golden.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', 3, 'Blend mayo, chipotle, lime for crema.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', 4, 'Toss cabbage with lime, salt.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', 5, 'Warm tortillas.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', 6, 'Assemble: fish, slaw, crema, salsa.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('53e349d9-b9c7-4ee1-9755-d02f9c34de96', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Bibimbap
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', 'Bibimbap', 'bibimbap', 'Mixed rice bowl with vegetables, beef, egg, and gochujang sauce.', 'https://images.unsplash.com/photo-1543363873-8e6cf8a3d3e7?w=800&auto=format&fit=crop', 'korean', 'lunch', 'lunch', NULL, 'medium', 11, 24, 2, 4.8, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM ingredients WHERE canonical_name = 'rice'), 2, 'cups', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM ingredients WHERE canonical_name = 'beef, marinated (soy, sugar, sesame, garlic)'), 150, 'gram', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM ingredients WHERE canonical_name = 'spinach, bean sprouts, carrots, zucchini, mushrooms'), 1, 'count', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM ingredients WHERE canonical_name = 's'), 2, 'egg', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM ingredients WHERE canonical_name = 'gochujang'), 1, 'count', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM ingredients WHERE canonical_name = 'sesame oil'), 1, 'count', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM ingredients WHERE canonical_name = 'sesame seeds'), 1, 'count', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM ingredients WHERE canonical_name = 'nori strips'), 1, 'count', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', 1, 'Prepare each vegetable separately: blanch and season.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', 2, 'Stir-fry marinated beef.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', 3, 'Fry eggs sunny-side up.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', 4, 'Place rice in bowls, arrange vegetables and beef.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', 5, 'Top with egg, gochujang, sesame oil, seeds, nori.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', 6, 'Mix everything before eating.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM tags WHERE name = 'healthy'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('a1a5b756-1882-4eff-a1a3-901a8185af22', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Mac and Cheese
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('190d5af1-25a6-49be-8240-236540c816db', 'Mac and Cheese', 'mac-and-cheese', 'Creamy baked macaroni with three-cheese sauce and crispy breadcrumb topping.', 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&auto=format&fit=crop', 'american', 'dinner', 'dinner', NULL, 'easy', 9, 21, 4, 4.6, 0, NULL, true, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'pasta'), 300, 'gram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'butter'), 3, 'tablespoon', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'flour'), 3, 'tablespoon', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'milk'), 3, 'cups', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'sharp cheddar'), 2, 'cups', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'cheese'), 1, 'cup', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'parmesan'), 1.2, 'cup', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'mustard powder'), 1, 'teaspoon', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'bread'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM ingredients WHERE canonical_name = 'paprika'), 1, 'count', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('190d5af1-25a6-49be-8240-236540c816db', 1, 'Cook pasta 1 minute less than package.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('190d5af1-25a6-49be-8240-236540c816db', 2, 'Make roux: butter + flour, cook 2 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('190d5af1-25a6-49be-8240-236540c816db', 3, 'Whisk in milk, simmer until thick.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('190d5af1-25a6-49be-8240-236540c816db', 4, 'Add cheeses, mustard, season.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('190d5af1-25a6-49be-8240-236540c816db', 5, 'Combine pasta and sauce, transfer to baking dish.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('190d5af1-25a6-49be-8240-236540c816db', 6, 'Top with panko mixed with parmesan and paprika.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('190d5af1-25a6-49be-8240-236540c816db', 7, 'Bake at 375°F for 20 minutes until golden.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM tags WHERE name = 'popular'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('190d5af1-25a6-49be-8240-236540c816db', (SELECT id FROM tags WHERE name = 'vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Shakshuka
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', 'Shakshuka', 'shakshuka', 'Eggs poached in spiced tomato-pepper sauce with warm pita.', 'https://images.unsplash.com/photo-1573672614557-41a177d25b4c?w=800&auto=format&fit=crop', 'mediterranean', 'breakfast', 'breakfast', NULL, 'easy', 8, 17, 3, 4.7, 0, NULL, true, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = ', diced'), 1, 'onion', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = 'bell pepper'), 1, 'red', 'diced', false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = 'cloves'), 4, 'garlic', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = 'cumin'), 1, 'teaspoon', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = 'paprika'), 1, 'teaspoon', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = 'cayenne'), 1.2, 'teaspoon', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = '(28oz) crushed tomatoes'), 1, 'can', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = '-6 eggs'), 4, 'count', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = 'feta, crumbled'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = 'cilantro, parsley'), 1, 'count', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM ingredients WHERE canonical_name = 'olive oil'), 1, 'count', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', 1, 'Sauté onion, pepper in oil until soft.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', 2, 'Add garlic, spices, cook 1 minute.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', 3, 'Add tomatoes, simmer 10 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', 4, 'Make wells, crack eggs in.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', 5, 'Cover, cook 5-8 minutes until whites set.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', 6, 'Top with feta, herbs. Serve with pita.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM tags WHERE name = 'vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM tags WHERE name = 'healthy'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('5e29be1d-d9a3-4307-8f81-95d73e659e1e', (SELECT id FROM tags WHERE name = 'breakfast'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Ramen
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', 'Ramen', 'ramen', 'Rich tonkotsu broth with chashu, ajitama, and springy noodles.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop', 'japanese', 'dinner', 'dinner', NULL, 'hard', 54, 126, 2, 4.9, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM ingredients WHERE canonical_name = 'ramen noodles'), 1, 'count', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM ingredients WHERE canonical_name = 'pork bones (for broth - 12hr simmer)'), 1, 'count', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM ingredients WHERE canonical_name = 'pork belly (chashu)'), 1, 'count', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM ingredients WHERE canonical_name = 'soft-boiled eggs (marinated)'), 1, 'count', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM ingredients WHERE canonical_name = 'bamboo shoots'), 1, 'count', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM ingredients WHERE canonical_name = 'nori'), 1, 'count', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM ingredients WHERE canonical_name = 'green onion'), 1, 'count', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM ingredients WHERE canonical_name = 'sesame seeds'), 1, 'count', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM ingredients WHERE canonical_name = 'tare (soy sauce base)'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', 1, 'Simmer pork bones 12+ hours for creamy broth.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', 2, 'Braise pork belly in soy, mirin, sake.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', 3, 'Marinate soft-boiled eggs in soy mixture.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', 4, 'Prepare tare in bowls.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', 5, 'Cook noodles separately.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', 6, 'Combine broth + tare, add noodles.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', 7, 'Top with chashu, egg, bamboo, nori, onions.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('b6a3b59c-8c24-4704-b804-3145e948cb35', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Green Curry
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', 'Green Curry', 'green-curry', 'Aromatic coconut curry with chicken, bamboo shoots, and Thai basil.', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop', 'thai', 'dinner', 'dinner', NULL, 'medium', 9, 21, 4, 4.7, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'chicken'), 400, 'gram', 'sliced', false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'coconut milk'), 2, 'can', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'curry paste'), 3, 'tablespoon', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'bamboo shoots'), 1, 'cup', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'eggplant'), 1, 'count', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'thai basil leaves'), 1, 'count', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'fish sauce'), 1, 'count', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'palm sugar'), 1, 'count', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'lime leaves'), 1, 'count', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'chili'), 1, 'count', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM ingredients WHERE canonical_name = 'jasmine rice'), 1, 'count', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', 1, 'Fry curry paste in coconut cream until fragrant.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', 2, 'Add chicken, cook until sealed.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', 3, 'Add remaining coconut milk, simmer.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', 4, 'Add vegetables, lime leaves.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', 5, 'Season with fish sauce, sugar.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', 6, 'Finish with basil and chilies.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', 7, 'Serve with jasmine rice.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM tags WHERE name = 'spicy'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('683c8e81-d4e0-4ade-9bb5-9c986c04afb6', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;

-- Recipe: Coq au Vin
INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', 'Coq au Vin', 'coq-au-vin', 'Classic French chicken braised in red wine with mushrooms and pearl onions.', 'https://images.unsplash.com/photo-1598514982232-611e0a3a94d6?w=800&auto=format&fit=crop', 'continental', 'dinner', 'dinner', NULL, 'hard', 36, 84, 4, 4.8, 0, NULL, false, false, false, 'manual')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'chicken, cut up'), 1.5, 'kilogram', NULL, false, 0)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'red wine (burgundy)'), 750, 'milliliter', NULL, false, 1)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'bacon, lardons'), 200, 'gram', NULL, false, 2)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'onion'), 250, 'gram', NULL, false, 3)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'mushroom'), 250, 'gram', NULL, false, 4)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = ', sliced'), 2, 'carrots', NULL, false, 5)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'stalks'), 2, 'celery', NULL, false, 6)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'bay leaf'), 1, 'count', NULL, false, 7)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'brandy'), 2, 'tablespoon', NULL, false, 8)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'butter, flour'), 1, 'count', NULL, false, 9)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM ingredients WHERE canonical_name = 'parsley'), 1, 'count', NULL, false, 10)
ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', 1, 'Marinate chicken in wine, herbs overnight.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', 2, 'Brown bacon, remove. Brown chicken in fat.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', 3, 'Sauté vegetables, add flour.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', 4, 'Add wine marinade, brandy, bouquet garni.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', 5, 'Simmer 45 minutes.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', 6, 'Separately cook onions and mushrooms in butter.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', 7, 'Combine, reduce sauce, finish with butter.');

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', 8, 'Garnish with parsley.');

INSERT INTO recipe_tags (recipe_id, tag_id) VALUES
('2157b2cc-86fd-4cff-aced-eb00af24b8c2', (SELECT id FROM tags WHERE name = 'non-vegetarian'))
ON CONFLICT (recipe_id, tag_id) DO NOTHING;
