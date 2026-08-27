import { supabase } from '../lib/supabase';

const AI_EDGE_FUNCTION_URL = '/functions/v1/ai-substitution';

const SUBSTITUTION_CACHE_KEY = 'cookflow_substitution_cache';
const ADAPTED_RECIPE_KEY_PREFIX = 'cookflow_adapted_recipe_';

const ROLE_CACHE_KEY = 'cookflow_ingredient_roles_cache';

function getCacheKey(recipeId, missingIngredientId, kitchenIngredientIds, servings) {
  return `${recipeId}-${missingIngredientId}-${kitchenIngredientIds.sort().join(',')}-${servings}`;
}

async function fetchIngredientRoles(ingredientIds) {
  try {
    const cached = getRolesFromCache(ingredientIds);
    const uncachedIds = ingredientIds.filter(id => !cached[id]);
    
    if (uncachedIds.length > 0) {
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, role')
        .in('id', uncachedIds);
      
      if (!error && data) {
        data.forEach(ing => {
          if (ing.role) {
            cached[ing.id] = ing.role;
          }
        });
        setRolesCache(cached);
      }
    }
    
    return cached;
  } catch (error) {
    console.error('Failed to fetch ingredient roles:', error);
    return {};
  }
}

function getRolesFromCache(ingredientIds) {
  try {
    const cache = JSON.parse(localStorage.getItem(ROLE_CACHE_KEY) || '{}');
    const result = {};
    ingredientIds.forEach(id => {
      if (cache[id]) result[id] = cache[id];
    });
    return result;
  } catch {
    return {};
  }
}

function setRolesCache(roles) {
  try {
    localStorage.setItem(ROLE_CACHE_KEY, JSON.stringify(roles));
  } catch {
    // Ignore
  }
}

function enrichKitchenIngredientsWithRoles(kitchenIngredients) {
  return kitchenIngredients.map(ing => ({
    ...ing,
    role: ing.role || 'other',
  }));
}

function getFromCache(key) {
  try {
    const cache = JSON.parse(localStorage.getItem(SUBSTITUTION_CACHE_KEY) || '{}');
    const entry = cache[key];
    if (entry && Date.now() - entry.timestamp < 24 * 60 * 60 * 1000) {
      return entry.data;
    }
    return null;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    const cache = JSON.parse(localStorage.getItem(SUBSTITUTION_CACHE_KEY) || '{}');
    cache[key] = { data, timestamp: Date.now() };
    localStorage.setItem(SUBSTITUTION_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache errors
  }
}

async function fetchDatabaseSubstitutions(
  missingIngredientId,
  kitchenIngredientIds,
  recipeContext
) {
  try {
    let query = supabase
      .from('ingredient_substitutions')
      .select(`
        *,
        substitute_ingredient:ingredients!ingredient_substitutions_substitute_ingredient_id_fkey(*)
      `)
      .eq('ingredient_id', missingIngredientId)
      .in('substitute_ingredient_id', kitchenIngredientIds);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching database substitutions:', error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Filter by conditions if recipe context provided
    const filtered = data.filter(sub => {
      if (!sub.conditions) return true;
      const conditions = sub.conditions.split(',').map(c => c.trim().toLowerCase());
      const recipeTags = [
        recipeContext.cuisine?.toLowerCase(),
        recipeContext.category?.toLowerCase(),
        recipeContext.cookingMethod?.toLowerCase(),
      ].filter(Boolean);
      return conditions.some(c => recipeTags.some(t => t?.includes(c) || c.includes(t || '')));
    });

    return filtered.map(sub => ({
      id: sub.id,
      ingredients: [{
        ingredientId: sub.substitute_ingredient?.id,
        name: sub.substitute_ingredient?.name || '',
        quantity: sub.quantity_ratio,
        unit: sub.unit,
        preparation: undefined,
      }],
      confidence: sub.confidence,
      confidenceScore: sub.confidence_score,
      reason: sub.notes || 'Standard culinary substitution',
      tasteImpact: sub.taste_impact || 'Minimal impact',
      textureImpact: sub.texture_impact || 'Minimal impact',
      warnings: sub.warnings ? [sub.warnings] : [],
      source: 'database',
    }));
  } catch (error) {
    console.error('Database substitution fetch error:', error);
    return [];
  }
}

async function fetchAISubstitutions(
  missingIngredient,
  recipe,
  kitchenIngredients,
  servings,
  originalServings
) {
  // Enrich kitchen ingredients with roles
  const enrichedKitchenIngredients = await enrichKitchenIngredientsWithRoles(kitchenIngredients);
  
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}${AI_EDGE_FUNCTION_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        missingIngredient: {
          id: missingIngredient.ingredientId,
          name: missingIngredient.name,
          quantity: missingIngredient.quantity,
          unit: missingIngredient.unit,
          preparation: missingIngredient.preparation,
          role: missingIngredient.role,
        },
        recipe: {
          id: recipe.id,
          title: recipe.title,
          cuisine: recipe.cuisine?.name || recipe.cuisine,
          category: recipe.category?.name || recipe.category,
          cookingMethod: inferCookingMethod(recipe),
          description: recipe.description,
        },
        availableIngredients: enrichedKitchenIngredients.map(ing => ({
          id: ing.id,
          name: ing.name,
          quantity: 1,
          unit: 'unit',
          role: ing.role,
        })),
        servings,
        originalServings,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.warn('AI substitution error:', data.error);
      return [];
    }

    return (data.substitutions || []).map((sub, index) => ({
      id: `ai-${Date.now()}-${index}`,
      ingredients: sub.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        preparation: ing.preparation,
      })),
      confidence: sub.confidence,
      confidenceScore: sub.confidenceScore,
      reason: sub.reason,
      tasteImpact: sub.tasteImpact,
      textureImpact: sub.textureImpact,
      warnings: sub.warnings || [],
      source: 'ai',
    }));
  } catch (error) {
    console.error('AI substitution fetch error:', error);
    return [];
  }
}

function inferCookingMethod(recipe) {
  const steps = recipe.recipe_steps || [];
  const instructions = steps.map((s) => s.instruction).join(' ').toLowerCase();
  
  if (instructions.includes('bake') || instructions.includes('oven')) return 'baking';
  if (instructions.includes('fry') || instructions.includes('sauté')) return 'frying';
  if (instructions.includes('grill') || instructions.includes('bbq')) return 'grilling';
  if (instructions.includes('steam')) return 'steaming';
  if (instructions.includes('boil') || instructions.includes('simmer')) return 'boiling';
  if (instructions.includes('roast')) return 'roasting';
  if (instructions.includes('slow cook') || instructions.includes('crock')) return 'slow cooking';
  
  return 'stovetop';
}

function validateSubstitution(option, kitchenIngredientNames) {
  if (!option.ingredients || option.ingredients.length === 0) return false;
  if (!option.confidence || !['high', 'medium', 'low'].includes(option.confidence)) return false;
  if (typeof option.confidenceScore !== 'number' || option.confidenceScore < 0 || option.confidenceScore > 1) return false;
  if (!option.reason || option.reason.trim().length < 10) return false;
  
  // Check all substitute ingredients are in kitchen
  for (const ing of option.ingredients) {
    if (!kitchenIngredientNames.some(k => k.toLowerCase() === ing.name.toLowerCase())) {
      return false;
    }
  }
  
  return true;
}

export const substitutionService = {
  async getSubstitutionsForMissingIngredient(
    missingIngredient,
    recipe,
    kitchenIngredients,
    servings = 1,
    originalServings = 1
  ) {
    const kitchenIngredientIds = kitchenIngredients.map(k => k.id);
    const kitchenIngredientNames = kitchenIngredients.map(k => k.name);
    const cacheKey = getCacheKey(recipe.id, missingIngredient.ingredientId, kitchenIngredientIds, servings);

    // Check cache first
    const cached = getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Enrich missing ingredient with role if not present
    let enrichedMissingIngredient = missingIngredient;
    if (!missingIngredient.role) {
      const roles = await fetchIngredientRoles([missingIngredient.ingredientId]);
      enrichedMissingIngredient = {
        ...missingIngredient,
        role: roles[missingIngredient.ingredientId] || 'other',
      };
    }

    // 1. Try database substitutions first (rule-based, fast, reliable)
    const recipeContext = {
      cuisine: recipe.cuisine?.name || recipe.cuisine,
      category: recipe.category?.name || recipe.category,
      cookingMethod: inferCookingMethod(recipe),
    };

    const dbSubstitutions = await fetchDatabaseSubstitutions(
      enrichedMissingIngredient.ingredientId,
      kitchenIngredientIds,
      recipeContext
    );

    // If we have high-confidence database substitutions, use them
    const highConfidenceDb = dbSubstitutions.filter(s => s.confidence === 'high');
    if (highConfidenceDb.length > 0) {
      const validated = highConfidenceDb.filter(s => validateSubstitution(s, kitchenIngredientNames));
      if (validated.length > 0) {
        setCache(cacheKey, validated);
        return validated;
      }
    }

    // 2. If no high-confidence DB results, try AI
    const aiSubstitutions = await fetchAISubstitutions(
      enrichedMissingIngredient,
      recipe,
      kitchenIngredients,
      servings,
      originalServings
    );

    const validatedAi = aiSubstitutions.filter(s => validateSubstitution(s, kitchenIngredientNames));
    
    // Combine: prioritize DB high confidence, then AI, then DB medium/low
    const allOptions = [
      ...highConfidenceDb,
      ...validatedAi,
      ...dbSubstitutions.filter(s => s.confidence !== 'high'),
    ].slice(0, 3);

    // If we have any valid options, cache and return
    if (allOptions.length > 0) {
      setCache(cacheKey, allOptions);
      return allOptions;
    }

    // No substitutions found
    setCache(cacheKey, []);
    return [];
  },

  async getAllSubstitutions(
    missingIngredients,
    recipe,
    kitchenIngredients,
    servings = 1,
    originalServings = 1
  ) {
    const results = await Promise.all(
      missingIngredients.map(async (missing) => {
        const options = await this.getSubstitutionsForMissingIngredient(
          missing,
          recipe,
          kitchenIngredients,
          servings,
          originalServings
        );
        return { missingIngredient: missing, options };
      })
    );
    return results;
  },

  // Adapted recipe state management
  saveAdaptedRecipe(state) {
    try {
      const key = `${ADAPTED_RECIPE_KEY_PREFIX}${state.recipeId}`;
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save adapted recipe:', error);
    }
  },

  loadAdaptedRecipe(recipeId) {
    try {
      const key = `${ADAPTED_RECIPE_KEY_PREFIX}${recipeId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  clearAdaptedRecipe(recipeId) {
    try {
      const key = `${ADAPTED_RECIPE_KEY_PREFIX}${recipeId}`;
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  },

  clearCache() {
    try {
      localStorage.removeItem(SUBSTITUTION_CACHE_KEY);
    } catch {
      // Ignore
    }
  },

  scaleSubstitutionQuantities(substitutions, scaleFactor) {
    return substitutions.map(opt => ({
      ...opt,
      ingredients: opt.ingredients.map(ing => ({
        ...ing,
        quantity: Math.round(ing.quantity * scaleFactor * 100) / 100,
      })),
    }));
  },

  scaleAdaptedRecipe(adaptedState, newServings) {
    if (!adaptedState || !adaptedState.servings || adaptedState.servings === newServings) {
      return adaptedState;
    }
    
    const scaleFactor = newServings / adaptedState.servings;
    
    const scaledAdaptedIngredients = adaptedState.adaptedIngredients.map(ing => {
      if (ing.isSubstituted && ing.substitutedWith) {
        return {
          ...ing,
          substitutedWith: ing.substitutedWith.map(s => ({
            ...s,
            quantity: Math.round(s.quantity * scaleFactor * 100) / 100,
          })),
          originalIngredient: ing.originalIngredient ? {
            ...ing.originalIngredient,
            quantity: Math.round(ing.originalIngredient.quantity * scaleFactor * 100) / 100,
          } : undefined,
        };
      }
      return {
        ...ing,
        quantity: Math.round(ing.quantity * scaleFactor * 100) / 100,
        originalIngredient: ing.originalIngredient ? {
          ...ing.originalIngredient,
          quantity: Math.round(ing.originalIngredient.quantity * scaleFactor * 100) / 100,
        } : undefined,
      };
    });
    
    return {
      ...adaptedState,
      servings: newServings,
      adaptedIngredients: scaledAdaptedIngredients,
      updatedAt: new Date().toISOString(),
    };
  },
};

export default substitutionService;