import { useState, useEffect, useCallback, useMemo } from 'react';
import { ingredientService } from '../services/ingredientService';

const KITCHEN_STORAGE_KEY = 'cookflow_kitchen';

export function useKitchen() {
  const [selectedIngredientIds, setSelectedIngredientIds] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(KITCHEN_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
  
  useEffect(() => {
    if (selectedIngredientIds.length > 0) {
      const fetchIngredients = async () => {
        setIsLoadingIngredients(true);
        try {
          const ingredients = await Promise.all(
            selectedIngredientIds.map(id => ingredientService.getIngredientById(id))
          );
          setSelectedIngredients(ingredients.filter(Boolean));
        } catch (err) {
          console.error('Failed to load kitchen ingredients:', err);
          setSelectedIngredients([]);
        } finally {
          setIsLoadingIngredients(false);
        }
      };
      fetchIngredients();
    } else {
      setSelectedIngredients([]);
      setIsLoadingIngredients(false);
    }
  }, [selectedIngredientIds]);
  
  const addIngredient = useCallback((ingredient) => {
    setSelectedIngredientIds(prev => {
      if (prev.some(id => id === ingredient.id)) return prev;
      const next = [...prev, ingredient.id];
      if (typeof window !== 'undefined') {
        localStorage.setItem(KITCHEN_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);
  
  const removeIngredient = useCallback((ingredientId) => {
    setSelectedIngredientIds(prev => {
      const next = prev.filter(id => id !== ingredientId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(KITCHEN_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);
  
  const clearAll = useCallback(() => {
    setSelectedIngredientIds([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KITCHEN_STORAGE_KEY);
    }
  }, []);
  
  const hasIngredient = useCallback((ingredientId) => {
    return selectedIngredientIds.includes(ingredientId);
  }, [selectedIngredientIds]);
  
  const count = selectedIngredientIds.length;
  
  const urlParams = useMemo(() => {
    return selectedIngredientIds.join(',');
  }, [selectedIngredientIds]);
  
  return {
    selectedIngredientIds,
    selectedIngredients,
    isLoadingIngredients,
    count,
    addIngredient,
    removeIngredient,
    clearAll,
    hasIngredient,
    urlParams,
  };
}