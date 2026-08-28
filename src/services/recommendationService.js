import { recipeService } from './recipeService';
import { preferenceService } from './preferenceService';
import { cookingSessionService } from './cookingSessionService';
import ingredientMatcher from '../utils/ingredientMatcher';

const RECOMMENDATION_WEIGHTS = {
  CUISINE_MATCH: 30,
  FAVORITE_INGREDIENT: 25,
  DIET_COMPATIBILITY: 20,
  MEAL_MATCH: 15,
  FAVORITE_RECIPE: 20,
  COOKED_BEFORE: 10,
  HIGH_RATING: 10,
  DISLIKED_INGREDIENT_PENALTY: -50,
  SPICE_MISMATCH_PENALTY: -15,
};

function getSpiceLevelValue(level) {
  const values = { mild: 1, medium: 2, hot: 3, 'extra-hot': 4 };
  return values[level] || 2;
}

function getSkillLevelValue(skill) {
  const values = { beginner: 1, intermediate: 2, advanced: 3 };
  return values[skill] || 1;
}

export const recommendationService = {
  async getPersonalizedRecipes(options = {}) {
    const { limit = 12, excludeRecipeIds = [] } = options;
    const prefs = preferenceService.getPreferences();
    const history = cookingSessionService.getHistory();

    try {
      const result = await recipeService.getRecipes({ limit: 100 });
      let recipes = result.recipes.filter(r => !excludeRecipeIds.includes(r.id));

      if (recipes.length === 0) return { recipes: [], reason: 'No recipes available' };

      const scoredRecipes = recipes.map(recipe => {
        const score = this.scoreRecipe(recipe, prefs, history);
        return { ...recipe, recommendationScore: score, recommendationReason: this.getRecommendationReason(recipe, prefs, history) };
      });

      scoredRecipes.sort((a, b) => b.recommendationScore - a.recommendationScore);

      return {
        recipes: scoredRecipes.slice(0, limit),
        reason: this.getOverallReason(prefs, history),
      };
    } catch (error) {
      console.error('Failed to get personalized recipes:', error);
      return { recipes: [], reason: 'Error loading recommendations' };
    }
  },

  scoreRecipe(recipe, prefs, history) {
    let score = 0;

    if (prefs.favoriteCuisines?.length > 0 && recipe.cuisine_id && prefs.favoriteCuisines.includes(recipe.cuisine_id)) {
      score += RECOMMENDATION_WEIGHTS.CUISINE_MATCH;
    }

    const recipeIngredients = recipe.recipe_ingredients?.map(ri => ri.ingredient?.id || ri.ingredient_id).filter(Boolean) || [];
    const favoriteIngredients = prefs.favoriteIngredients || [];
    const dislikedIngredients = prefs.dislikedIngredients || [];

    for (const favIng of favoriteIngredients) {
      if (recipeIngredients.includes(favIng)) {
        score += RECOMMENDATION_WEIGHTS.FAVORITE_INGREDIENT;
      }
    }

    for (const disIng of dislikedIngredients) {
      if (recipeIngredients.includes(disIng)) {
        score += RECOMMENDATION_WEIGHTS.DISLIKED_INGREDIENT_PENALTY;
      }
    }

    if (prefs.dietaryPreferences?.length > 0) {
      let dietMatches = 0;
      if (prefs.dietaryPreferences.includes('vegetarian') && recipe.is_vegetarian) dietMatches++;
      if (prefs.dietaryPreferences.includes('vegan') && recipe.is_vegan) dietMatches++;
      if (prefs.dietaryPreferences.includes('gluten-free') && recipe.is_gluten_free) dietMatches++;
      if (prefs.dietaryPreferences.includes('dairy-free') && !this.hasDairy(recipe)) dietMatches++;
      if (prefs.dietaryPreferences.includes('keto') && this.isKetoFriendly(recipe)) dietMatches++;
      score += dietMatches * RECOMMENDATION_WEIGHTS.DIET_COMPATIBILITY;
    }

    if (prefs.favoriteCuisines?.length > 0 && recipe.category_id && prefs.favoriteCuisines.includes(recipe.category_id)) {
      score += RECOMMENDATION_WEIGHTS.MEAL_MATCH;
    }

    const cookedBefore = history.some(h => h.recipeId === recipe.id);
    if (cookedBefore) {
      score += RECOMMENDATION_WEIGHTS.COOKED_BEFORE;
    }

    const isFavorite = prefs.recipeFeedback?.[recipe.id]?.wouldCookAgain === true;
    if (isFavorite) {
      score += RECOMMENDATION_WEIGHTS.FAVORITE_RECIPE;
    }

    if (recipe.rating >= 4.5) {
      score += RECOMMENDATION_WEIGHTS.HIGH_RATING;
    }

    const userSpiceValue = getSpiceLevelValue(prefs.spiceLevel);
    const recipeSpiceValue = this.estimateRecipeSpice(recipe);
    const spiceDiff = Math.abs(userSpiceValue - recipeSpiceValue);
    if (spiceDiff >= 2) {
      score += RECOMMENDATION_WEIGHTS.SPICE_MISMATCH_PENALTY;
    }

    return Math.max(0, score);
  },

  getRecommendationReason(recipe, prefs, history) {
    const reasons = [];

    if (prefs.favoriteCuisines?.includes(recipe.cuisine_id)) {
      reasons.push(`you like ${recipe.cuisine?.name || recipe.cuisine_id} food`);
    }

    const recipeIngredients = recipe.recipe_ingredients?.map(ri => ri.ingredient?.name).filter(Boolean) || [];
    const favoriteIngredients = prefs.favoriteIngredients || [];
    const matchedFav = recipeIngredients.find(ing => favoriteIngredients.some(fav => fav.toLowerCase() === ing.toLowerCase()));
    if (matchedFav) {
      reasons.push(`you like ${matchedFav}`);
    }

    const cookedBefore = history.some(h => h.recipeId === recipe.id);
    if (cookedBefore) {
      reasons.push('you\'ve cooked this before');
    }

    if (prefs.dietaryPreferences?.length > 0) {
      const diets = prefs.dietaryPreferences.filter(d => {
        if (d === 'vegetarian') return recipe.is_vegetarian;
        if (d === 'vegan') return recipe.is_vegan;
        if (d === 'gluten-free') return recipe.is_gluten_free;
        return false;
      });
      if (diets.length > 0) {
        reasons.push(`matches your ${diets.join(', ')} preference`);
      }
    }

    if (recipe.rating >= 4.5) {
      reasons.push('highly rated');
    }

    return reasons.length > 0 ? reasons.slice(0, 2).join(' & ') : 'popular choice';
  },

  getOverallReason(prefs, history) {
    if (prefs.favoriteCuisines?.length > 0) {
      return `Based on your favorite cuisines: ${prefs.favoriteCuisines.join(', ')}`;
    }
    if (history.length > 0) {
      return `Based on your cooking history`;
    }
    if (prefs.dietaryPreferences?.length > 0) {
      return `Based on your dietary preferences: ${prefs.dietaryPreferences.join(', ')}`;
    }
    return 'Popular and highly rated recipes';
  },

  hasDairy(recipe) {
    const dairyKeywords = ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'ghee', 'paneer'];
    const ingredients = recipe.recipe_ingredients?.map(ri => ri.ingredient?.name?.toLowerCase()).filter(Boolean) || [];
    return ingredients.some(ing => dairyKeywords.some(dk => ing.includes(dk)));
  },

  isKetoFriendly(recipe) {
    const highCarbKeywords = ['rice', 'pasta', 'bread', 'potato', 'flour', 'sugar', 'noodles', 'wheat', 'corn', 'oats'];
    const ingredients = recipe.recipe_ingredients?.map(ri => ri.ingredient?.name?.toLowerCase()).filter(Boolean) || [];
    return !ingredients.some(ing => highCarbKeywords.some(kw => ing.includes(kw)));
  },

  estimateRecipeSpice(recipe) {
    const spicyKeywords = ['chili', 'chilli', 'pepper', 'cayenne', 'jalapeno', 'habanero', 'gochugaru', 'gochujang', 'sriracha', 'spicy', 'hot'];
    const ingredients = recipe.recipe_ingredients?.map(ri => ri.ingredient?.name?.toLowerCase()).filter(Boolean) || [];
    const instructions = recipe.recipe_steps?.map(s => s.instruction?.toLowerCase()).filter(Boolean).join(' ') || '';
    const allText = [...ingredients, instructions].join(' ');
    const matches = spicyKeywords.filter(kw => allText.includes(kw)).length;
    if (matches >= 3) return 4;
    if (matches >= 2) return 3;
    if (matches >= 1) return 2;
    return 1;
  },

  async getCookAgainRecipes(limit = 8) {
    const history = cookingSessionService.getHistory();
    const recentHistory = history.slice(0, 20);
    if (recentHistory.length === 0) return { recipes: [], reason: 'No cooking history yet' };

    try {
      const recipeIds = [...new Set(recentHistory.map(h => h.recipeId))];
      const result = await recipeService.getRecipesByIds(recipeIds);
      return {
        recipes: result.slice(0, limit),
        reason: 'Recently cooked recipes',
      };
    } catch (error) {
      return { recipes: [], reason: 'Error loading cook again recipes' };
    }
  },

  async getKitchenBasedRecommendations(kitchenIngredientIds, limit = 12) {
    if (!kitchenIngredientIds?.length) return { recipes: [], reason: 'Add ingredients to your kitchen first' };

    try {
      const result = await recipeService.getRecipes({ limit: 100 });
      const matches = result.recipes.map(recipe => {
        const match = ingredientMatcher.calculateRecipeMatch(recipe, kitchenIngredientIds);
        return { ...recipe, matchPercentage: match.matchPercentage };
      });

      matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
      return {
        recipes: matches.slice(0, limit),
        reason: 'Based on ingredients in your kitchen',
      };
    } catch (error) {
      return { recipes: [], reason: 'Error loading kitchen recommendations' };
    }
  },

  async getRecentlyViewedRecipes(limit = 10) {
    const recipeIds = preferenceService.getRecentlyViewed(limit);
    if (recipeIds.length === 0) return { recipes: [], reason: 'No recently viewed recipes' };

    try {
      const result = await recipeService.getRecipesByIds(recipeIds);
      return {
        recipes: result,
        reason: 'Recently viewed',
      };
    } catch (error) {
      return { recipes: [], reason: 'Error loading recently viewed' };
    }
  },

  async getFallbackRecipes(limit = 12) {
    try {
      const popular = await recipeService.getPopularRecipes(limit);
      return { recipes: popular, reason: 'Popular recipes' };
    } catch {
      return { recipes: [], reason: 'No recipes available' };
    }
  },
};

export default recommendationService;