import { useState, useEffect, useCallback, useMemo } from 'react';
import { substitutionService } from '../services/substitutionService';

export function useRecipeAdaptation(recipeId) {
  const [adaptedState, setAdaptedState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!recipeId) {
      setAdaptedState(null);
      return;
    }

    const loadAdapted = async () => {
      setIsLoading(true);
      try {
        const stored = substitutionService.loadAdaptedRecipe(recipeId);
        setAdaptedState(stored);
      } catch (error) {
        console.error('Failed to load adapted recipe:', error);
        setAdaptedState(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdapted();
  }, [recipeId]);

  const saveAdaptation = useCallback((state) => {
    substitutionService.saveAdaptedRecipe(state);
    setAdaptedState(state);
  }, []);

  const clearAdaptation = useCallback(() => {
    if (recipeId) {
      substitutionService.clearAdaptedRecipe(recipeId);
      setAdaptedState(null);
    }
  }, [recipeId]);

  const hasAdaptation = !!adaptedState;

  return {
    adaptedState,
    isLoading,
    saveAdaptation,
    clearAdaptation,
    hasAdaptation,
  };
}

export function useSubstitutionState() {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [substitutionResults, setSubstitutionResults] = useState([]);

  const selectOption = useCallback((missingIngredientId, optionId) => {
    setSelectedOptions(prev => ({ ...prev, [missingIngredientId]: optionId }));
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedOptions({});
  }, []);

  const getSelectedOption = useCallback((missingIngredientId, results) => {
    const selectedId = selectedOptions[missingIngredientId];
    if (!selectedId) return null;
    
    const result = results.find(r => r.missingIngredient.ingredientId === missingIngredientId);
    return result?.options.find(o => o.id === selectedId) || null;
  }, [selectedOptions]);

  const substitutedCount = useMemo(() => Object.keys(selectedOptions).length, [selectedOptions]);

  return {
    selectedOptions,
    substitutionResults,
    setSubstitutionResults,
    selectOption,
    clearSelections,
    getSelectedOption,
    substitutedCount,
  };
}

export function useIngredientRoles(kitchenIngredients) {
  const roles = useMemo(() => {
    const roleMap = {};
    kitchenIngredients.forEach(ing => {
      const role = ing.role || 'other';
      if (!roleMap[role]) roleMap[role] = [];
      roleMap[role].push(ing);
    });
    return roleMap;
  }, [kitchenIngredients]);

  return roles;
}