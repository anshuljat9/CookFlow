export function formatTime(minutes) {
  if (!minutes || minutes < 1) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatDuration(seconds) {
  if (!seconds || seconds < 60) return `${seconds || 0}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export function scaleQuantity(originalQuantity, originalServings, targetServings) {
  if (!originalQuantity || !originalServings || !targetServings) return originalQuantity;
  if (originalServings === targetServings) return originalQuantity;
  
  const scaled = (originalQuantity * targetServings) / originalServings;
  return Math.round(scaled * 100) / 100;
}

export function formatQuantity(quantity, unit) {
  if (!quantity && quantity !== 0) return '';
  
  const formatNumber = (num) => {
    if (num % 1 === 0) return num.toString();
    if (num * 2 % 1 === 0) return `${num.toFixed(1).replace('.5', '½')}`;
    if (num * 3 % 1 === 0) return `${num.toFixed(1).replace('.33', '⅓').replace('.66', '⅔')}`;
    if (num * 4 % 1 === 0) return `${num.toFixed(1).replace('.25', '¼').replace('.75', '¾')}`;
    return num.toFixed(2).replace(/\.?0+$/, '');
  };
  
  return `${formatNumber(quantity)} ${unit}`.trim();
}

export function formatIngredient(recipeIngredient, targetServings = null) {
  const { quantity, unit, preparation, ingredient, is_optional } = recipeIngredient;
  const origServings = recipeIngredient.recipe_servings || 1;
  
  let displayQuantity = quantity;
  if (targetServings && targetServings !== origServings) {
    displayQuantity = scaleQuantity(quantity, origServings, targetServings);
  }
  
  let parts = [];
  if (displayQuantity) parts.push(formatQuantity(displayQuantity, unit));
  if (preparation) parts.push(preparation);
  if (ingredient?.name) parts.push(ingredient.name);
  
  let formatted = parts.join(' ');
  if (is_optional) formatted += ' (optional)';
  
  return formatted;
}

export function getDifficultyColor(difficulty) {
  const colors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return colors[difficulty?.id || difficulty] || colors.medium;
}

export function getDietaryBadges(recipe) {
  const badges = [];
  if (recipe.is_vegetarian) badges.push({ label: 'Vegetarian', className: 'badge-green' });
  if (recipe.is_vegan) badges.push({ label: 'Vegan', className: 'badge-green' });
  if (recipe.is_gluten_free) badges.push({ label: 'Gluten Free', className: 'badge-amber' });
  return badges;
}

export function transformRecipeForUI(recipe) {
  if (!recipe) return null;
  
  return {
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    description: recipe.description,
    image: recipe.image_url,
    cuisine: recipe.cuisine?.id,
    cuisineName: recipe.cuisine?.name,
    cuisineIcon: recipe.cuisine?.icon,
    cuisineColor: recipe.cuisine?.color_class,
    category: recipe.category?.id,
    categoryName: recipe.category?.name,
    mealType: recipe.meal_type?.id,
    difficulty: recipe.difficulty?.id,
    difficultyName: recipe.difficulty?.name,
    difficultyColor: recipe.difficulty?.color_class,
    prepTime: recipe.prep_time_minutes,
    cookTime: recipe.cook_time_minutes,
    totalTime: recipe.total_time_minutes,
    servings: recipe.servings,
    rating: recipe.rating,
    ratingCount: recipe.rating_count,
    calories: recipe.calories,
    isVegetarian: recipe.is_vegetarian,
    isVegan: recipe.is_vegan,
    isGlutenFree: recipe.is_gluten_free,
    tags: recipe.recipe_tags?.map(rt => rt.tag?.name).filter(Boolean) || [],
    ingredients: recipe.recipe_ingredients?.map(ri => ({
      quantity: ri.quantity,
      unit: ri.unit,
      preparation: ri.preparation,
      isOptional: ri.is_optional,
      ingredient: ri.ingredient,
    })) || [],
    steps: recipe.recipe_steps?.map(rs => ({
      number: rs.step_number,
      instruction: rs.instruction,
      duration: rs.duration_seconds,
      temperature: rs.temperature,
      tip: rs.tip,
    })) || [],
    sourceType: recipe.source_type,
    sourceUrl: recipe.source_url,
    aiGenerated: recipe.ai_generated,
    aiConfidence: recipe.ai_confidence,
  };
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}