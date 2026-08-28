const MIN_MATCH_THRESHOLD = 50;

function getRequiredIngredients(recipeIngredients) {
  return recipeIngredients.filter(ri => !ri.is_optional);
}

function getOptionalIngredients(recipeIngredients) {
  return recipeIngredients.filter(ri => ri.is_optional);
}

function getIngredientId(recipeIngredient) {
  return recipeIngredient.ingredient?.id || recipeIngredient.ingredient_id;
}

function getIngredientName(recipeIngredient) {
  return recipeIngredient.ingredient?.name || recipeIngredient.name;
}

function getIngredientQuantity(recipeIngredient) {
  return recipeIngredient.quantity;
}

function getIngredientUnit(recipeIngredient) {
  return recipeIngredient.unit;
}

function getIngredientPreparation(recipeIngredient) {
  return recipeIngredient.preparation;
}

export function calculateRecipeMatch(recipe, kitchenIngredientIds) {
  const recipeIngredients = recipe.recipe_ingredients || [];
  const requiredIngredients = getRequiredIngredients(recipeIngredients);
  const optionalIngredients = getOptionalIngredients(recipeIngredients);
  
  const totalRequired = requiredIngredients.length;
  const totalOptional = optionalIngredients.length;
  
  if (totalRequired === 0) {
    return {
      matchPercentage: 100,
      availableIngredients: [],
      missingIngredients: [],
      totalRequiredIngredients: 0,
      matchedRequiredIngredients: 0,
      totalOptionalIngredients: totalOptional,
      matchedOptionalIngredients: 0,
    };
  }
  
  const kitchenIdSet = new Set(kitchenIngredientIds);
  
  let matchedRequired = 0;
  const availableIngredients = [];
  const missingIngredients = [];
  
  for (const ri of requiredIngredients) {
    const ingredientId = getIngredientId(ri);
    const ingredientName = getIngredientName(ri);
    const quantity = getIngredientQuantity(ri);
    const unit = getIngredientUnit(ri);
    const preparation = getIngredientPreparation(ri);
    
    if (kitchenIdSet.has(ingredientId)) {
      matchedRequired++;
      availableIngredients.push({
        ingredientId,
        name: ingredientName,
        quantity,
        unit,
        preparation,
        isOptional: false,
      });
    } else {
      missingIngredients.push({
        ingredientId,
        name: ingredientName,
        quantity,
        unit,
        preparation,
        isOptional: false,
      });
    }
  }
  
  let matchedOptional = 0;
  for (const ri of optionalIngredients) {
    const ingredientId = getIngredientId(ri);
    const ingredientName = getIngredientName(ri);
    const quantity = getIngredientQuantity(ri);
    const unit = getIngredientUnit(ri);
    const preparation = getIngredientPreparation(ri);
    
    if (kitchenIdSet.has(ingredientId)) {
      matchedOptional++;
      availableIngredients.push({
        ingredientId,
        name: ingredientName,
        quantity,
        unit,
        preparation,
        isOptional: true,
      });
    } else {
      missingIngredients.push({
        ingredientId,
        name: ingredientName,
        quantity,
        unit,
        preparation,
        isOptional: true,
      });
    }
  }
  
  const matchPercentage = Math.round((matchedRequired / totalRequired) * 100);
  
  return {
    matchPercentage,
    availableIngredients,
    missingIngredients,
    totalRequiredIngredients: totalRequired,
    matchedRequiredIngredients: matchedRequired,
    totalOptionalIngredients: totalOptional,
    matchedOptionalIngredients: matchedOptional,
  };
}

export function rankRecipesByMatch(recipes, kitchenIngredientIds) {
  const recipesWithMatch = recipes.map(recipe => {
    const match = calculateRecipeMatch(recipe, kitchenIngredientIds);
    return { ...recipe, match };
  });
  
  recipesWithMatch.sort((a, b) => {
    if (b.match.matchPercentage !== a.match.matchPercentage) {
      return b.match.matchPercentage - a.match.matchPercentage;
    }
    
    const aCoverage = a.match.matchedRequiredIngredients / Math.max(a.match.totalRequiredIngredients, 1);
    const bCoverage = b.match.matchedRequiredIngredients / Math.max(b.match.totalRequiredIngredients, 1);
    if (bCoverage !== aCoverage) {
      return bCoverage - aCoverage;
    }
    
    if ((b.rating || 0) !== (a.rating || 0)) {
      return (b.rating || 0) - (a.rating || 0);
    }
    
    return (a.total_time_minutes || 0) - (b.total_time_minutes || 0);
  });
  
  return recipesWithMatch;
}

export function filterRecipesByThreshold(recipesWithMatch, threshold = MIN_MATCH_THRESHOLD) {
  return recipesWithMatch.filter(r => r.match.matchPercentage >= threshold);
}

export function getMatchQuality(matchPercentage) {
  if (matchPercentage >= 90) return 'excellent';
  if (matchPercentage >= 75) return 'good';
  if (matchPercentage >= 50) return 'possible';
  return 'low';
}

export function getMatchQualityLabel(matchPercentage) {
  const quality = getMatchQuality(matchPercentage);
  switch (quality) {
    case 'excellent': return 'Excellent Match';
    case 'good': return 'Good Match';
    case 'possible': return 'Possible';
    case 'low': return 'Low Match';
    default: return 'Low Match';
  }
}

export function getMatchQualityColor(matchPercentage) {
  const quality = getMatchQuality(matchPercentage);
  switch (quality) {
    case 'excellent': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'good': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'possible': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    case 'low': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    default: return 'bg-warm-100 text-charcoal-700 dark:bg-charcoal-800 dark:text-warm-300';
  }
}

const ingredientMatcher = {
  calculateRecipeMatch,
  rankRecipesByMatch,
  filterRecipesByThreshold,
  getMatchQuality,
  getMatchQualityLabel,
  getMatchQualityColor,
};

export default ingredientMatcher;