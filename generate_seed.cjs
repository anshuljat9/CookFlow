const fs = require('fs');
const crypto = require('crypto');

const recipesModule = require('./src/data/recipes.js');
const recipes = recipesModule.recipes || recipesModule.default.recipes;

const ingredientMap = {
  'chicken breast': 'chicken breast',
  'yogurt': 'yogurt',
  'ginger-garlic paste': 'garlic',
  'turmeric': 'turmeric',
  'red chili powder': 'red chili powder',
  'butter': 'butter',
  'onion': 'onion',
  'tomato puree': 'tomato',
  'heavy cream': 'heavy cream',
  'garam masala': 'garam masala',
  'kasuri methi': 'kasuri methi',
  'salt': 'salt',
  'cilantro': 'cilantro',
  'pizza dough': 'flour',
  'san marzano tomato sauce': 'tomato sauce',
  'fresh mozzarella': 'mozzarella',
  'basil': 'basil',
  'olive oil': 'olive oil',
  'chicken thigh': 'chicken thigh',
  'peanuts': 'peanuts',
  'dried red chilies': 'chili',
  'bell pepper': 'bell pepper',
  'soy sauce': 'soy sauce',
  'dark soy sauce': 'dark soy sauce',
  'chinese black vinegar': 'vinegar',
  'sugar': 'sugar',
  'cornstarch': 'cornstarch',
  'oil': 'vegetable oil',
  'sichuan peppercorns': 'sichuan peppercorn',
  'garlic': 'garlic',
  'ginger': 'ginger',
  'green onions': 'green onion',
  'achiote paste': 'achiote paste',
  'orange juice': 'orange',
  'lime juice': 'lime',
  'cumin': 'cumin',
  'oregano': 'oregano',
  'pineapple': 'pineapple',
  'corn tortillas': 'tortilla',
  'salsa verde': 'salsa verde',
  'spaghetti': 'spaghetti',
  'gochugaru': 'gochugaru',
  'honey': 'honey',
  'sesame oil': 'sesame oil',
  'ground beef': 'ground beef',
  'brioche buns': 'bread',
  'cheddar cheese': 'cheddar',
  'lettuce': 'lettuce',
  'tomato': 'tomato',
  'pickles': 'pickles',
  'mayonnaise': 'mayonnaise',
  'ketchup': 'ketchup',
  'mustard': 'mustard',
  'cucumbers': 'cucumber',
  'feta cheese': 'feta',
  'kalamata olives': 'olives',
  'red wine vinegar': 'red wine vinegar',
  'dried oregano': 'oregano',
  'salmon': 'salmon',
  'mirin': 'mirin',
  'sake': 'sake',
  'cornstarch slurry': 'cornstarch',
  'rice noodles': 'rice noodles',
  'shrimp': 'shrimp',
  'eggs': 'egg',
  'bean sprouts': 'bean sprouts',
  'fish sauce': 'fish sauce',
  'tamarind paste': 'tamarind',
  'palm sugar': 'palm sugar',
  'chili powder': 'chili powder',
  'chives': 'green onion',
  'fettuccine': 'fettuccine',
  'parmesan': 'parmesan',
  'nutmeg': 'nutmeg',
  'parsley': 'parsley',
  'basmati rice': 'basmati rice',
  'mixed vegetables': 'carrot',
  'biryani masala': 'garam masala',
  'saffron milk': 'saffron',
  'mint': 'mint',
  'ghee': 'ghee',
  'bay leaf': 'bay leaf',
  'cardamom': 'cardamom',
  'cloves': 'cloves',
  'cinnamon': 'cinnamon',
  'guanciale': 'bacon',
  'pecorino romano': 'parmesan',
  'black pepper': 'black pepper',
  'silken tofu': 'silken tofu',
  'ground pork': 'ground pork',
  'doubanjiang': 'doubanjiang',
  'fermented black beans': 'fermented black beans',
  'chicken stock': 'chicken stock',
  'white fish': 'cod',
  'flour': 'flour',
  'beer': 'beer',
  'cabbage slaw': 'cabbage',
  'chipotle in adobo': 'chipotle',
  'cooked rice': 'rice',
  'beef': 'beef',
  'spinach': 'spinach',
  'nori': 'nori',
  'elbow macaroni': 'pasta',
  'gruyere': 'cheese',
  'panko breadcrumbs': 'bread',
  'paprika': 'paprika',
  'red bell pepper': 'bell pepper',
  'crushed tomatoes': 'tomato',
  'feta': 'feta',
  'pork bones': 'pork',
  'pork belly': 'pork belly',
  'bamboo shoots': 'bamboo shoots',
  'tare': 'soy sauce',
  'coconut milk': 'coconut milk',
  'green curry paste': 'curry paste',
  'thai eggplants': 'eggplant',
  'thai basil': 'basil',
  'kaffir lime leaves': 'lime leaves',
  'red chilies': 'chili',
  'jasmine rice': 'jasmine rice',
  'red wine': 'red wine',
  'bacon': 'bacon',
  'pearl onions': 'onion',
  'mushrooms': 'mushroom',
  'carrots': 'carrot',
  'celery': 'celery',
  'bouquet garni': 'bay leaf',
  'brandy': 'brandy',
};

function parseIngredient(ingStr) {
  const str = ingStr.toLowerCase().trim();
  
  const optionalMatch = str.match(/^optional:\s*(.+)$/i);
  const isOptional = !!optionalMatch;
  const cleanStr = optionalMatch ? optionalMatch[1] : str;
  
  let quantity = null;
  let unit = '';
  let name = cleanStr;
  let preparation = '';
  
  const qtyMatch = cleanStr.match(/^([\d\/\.]+)\s*([a-z]+)?\s*(.+)$/);
  if (qtyMatch) {
    quantity = parseFloat(qtyMatch[1].replace('/', '.').replace('½', '0.5').replace('¼', '0.25').replace('¾', '0.75'));
    unit = qtyMatch[2] || '';
    name = qtyMatch[3].trim();
  }
  
  const prepMatch = name.match(/^(.+?),\s*(diced|minced|sliced|chopped|cubed|wedged|chunked|grated|minced|pureed|peeled|seeded|trimmed|halved|quartered|crushed|torn|roughly chopped|finely chopped)$/i);
  if (prepMatch) {
    name = prepMatch[1].trim();
    preparation = prepMatch[2].toLowerCase();
  }
  
  name = name.replace(/^(fresh|dried|large|small|medium|extra virgin|cold|warm|hot)\s+/i, '').trim();
  name = name.replace(/\s+for\s+garnish$/i, '').trim();
  name = name.replace(/\s+to\s+taste$/i, '').trim();
  name = name.replace(/\s+\(optional\)$/i, '').trim();
  
  let canonicalName = ingredientMap[name] || name;
  
  if (unit === 'tbsp') unit = 'tablespoon';
  else if (unit === 'tsp') unit = 'teaspoon';
  else if (unit === 'cup') unit = 'cup';
  else if (unit === 'g' || unit === 'gm' || unit === 'grams') unit = 'gram';
  else if (unit === 'kg') unit = 'kilogram';
  else if (unit === 'ml') unit = 'milliliter';
  else if (unit === 'l') unit = 'liter';
  else if (unit === 'oz') unit = 'ounce';
  else if (unit === 'lb') unit = 'pound';
  else if (unit === 'cloves') unit = 'count';
  else if (unit === 'leaves') unit = 'count';
  else if (unit === 'stalks') unit = 'count';
  else if (unit === 'cans') unit = 'can';
  else if (unit === 'can') unit = 'can';
  else if (unit === 'slices') unit = 'count';
  else if (unit === 'blocks') unit = 'count';
  else if (unit === 'fillets') unit = 'count';
  else if (unit === 'pinch') unit = 'pinch';
  
  return {
    quantity: quantity || 1,
    unit: unit || 'count',
    name: canonicalName,
    preparation,
    isOptional
  };
}

function generateUUID() {
  return crypto.randomUUID();
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getDietFlags(tags) {
  return {
    is_vegetarian: tags.includes('vegetarian') || tags.includes('vegan'),
    is_vegan: tags.includes('vegan'),
    is_gluten_free: tags.includes('gluten-free')
  };
}

const sqlStatements = [];

recipes.forEach((recipe, idx) => {
  const recipeId = generateUUID();
  const slug = slugify(recipe.title);
  const dietFlags = getDietFlags(recipe.tags);
  
  const prepTime = Math.round(recipe.cookingTime * 0.3);
  const cookTime = recipe.cookingTime - prepTime;
  
  sqlStatements.push(`-- Recipe: ${recipe.title}`);
  sqlStatements.push(`INSERT INTO recipes (id, title, slug, description, image_url, cuisine_id, category_id, meal_type_id, diet_type_id, difficulty_id, prep_time_minutes, cook_time_minutes, servings, rating, rating_count, calories, is_vegetarian, is_vegan, is_gluten_free, source_type) VALUES`);
  sqlStatements.push(`('${recipeId}', '${recipe.title.replace(/'/g, "''")}', '${slug}', '${recipe.description.replace(/'/g, "''")}', '${recipe.image}', '${recipe.cuisine}', '${recipe.category}', '${recipe.category}', NULL, '${recipe.difficulty}', ${prepTime}, ${cookTime}, ${recipe.servings}, ${recipe.rating}, 0, NULL, ${dietFlags.is_vegetarian}, ${dietFlags.is_vegan}, ${dietFlags.is_gluten_free}, 'manual')`);
  sqlStatements.push(`ON CONFLICT (slug) DO NOTHING;`);
  sqlStatements.push('');
  
  const parsedIngredients = recipe.ingredients.map((ing, i) => parseIngredient(ing));
  parsedIngredients.forEach((ing, i) => {
    sqlStatements.push(`INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, preparation, is_optional, sort_order) VALUES`);
    sqlStatements.push(`('${recipeId}', (SELECT id FROM ingredients WHERE canonical_name = '${ing.name}'), ${ing.quantity}, '${ing.unit}', ${ing.preparation ? `'${ing.preparation}'` : 'NULL'}, ${ing.isOptional}, ${i})`);
    sqlStatements.push(`ON CONFLICT (recipe_id, ingredient_id, preparation) DO NOTHING;`);
    sqlStatements.push('');
  });
  
  recipe.instructions.forEach((inst, i) => {
    sqlStatements.push(`INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES`);
    sqlStatements.push(`('${recipeId}', ${i + 1}, '${inst.replace(/'/g, "''")}');`);
    sqlStatements.push('');
  });
  
  recipe.tags.forEach(tag => {
    sqlStatements.push(`INSERT INTO recipe_tags (recipe_id, tag_id) VALUES`);
    sqlStatements.push(`('${recipeId}', (SELECT id FROM tags WHERE name = '${tag}'))`);
    sqlStatements.push(`ON CONFLICT (recipe_id, tag_id) DO NOTHING;`);
    sqlStatements.push('');
  });
});

fs.writeFileSync('./supabase/recipes_seed.sql', sqlStatements.join('\n'));
console.log('Generated recipes_seed.sql with', recipes.length, 'recipes');