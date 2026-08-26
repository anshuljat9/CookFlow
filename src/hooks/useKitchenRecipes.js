import { useState, useEffect, useCallback, useMemo } from 'react';
import { recipeService } from '../services/recipeService';
import { rankRecipesByMatch, filterRecipesByThreshold, calculateRecipeMatch } from '../utils/ingredientMatcher';

const MIN_MATCH_THRESHOLD = 50;

export function useKitchenRecipes(kitchenIngredientIds, options = {}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(MIN_MATCH_THRESHOLD);
  const [filters, setFilters] = useState({
    cuisine: '',
    dietType: '',
    maxTime: '',
    difficulty: '',
    ...options,
  });
  
  const findRecipes = useCallback(async () => {
    if (!kitchenIngredientIds.length) {
      setRecipes([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await recipeService.getRecipes({
        ...filters,
        limit: 100,
      });
      
      const ranked = rankRecipesByMatch(result.recipes, kitchenIngredientIds);
      const filtered = filterRecipesByThreshold(ranked, threshold);
      
      setRecipes(filtered);
    } catch (err) {
      console.error('Error finding kitchen recipes:', err);
      setError('Unable to find recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [kitchenIngredientIds, filters, threshold]);
  
  useEffect(() => {
    findRecipes();
  }, [findRecipes]);
  
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const updateThreshold = useCallback((newThreshold) => {
    setThreshold(newThreshold);
  }, []);
  
  const refetch = useCallback(() => {
    findRecipes();
  }, [findRecipes]);
  
  return {
    recipes,
    loading,
    error,
    threshold,
    filters,
    findRecipes,
    updateFilters,
    updateThreshold,
    refetch,
  };
}

export function useRecipeMatch(recipe, kitchenIngredientIds) {
  const match = useMemo(() => {
    if (!recipe || !kitchenIngredientIds.length) {
      return null;
    }
    return calculateRecipeMatch(recipe, kitchenIngredientIds);
  }, [recipe, kitchenIngredientIds]);
  
  return match;
}