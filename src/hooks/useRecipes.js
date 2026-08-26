import { useState, useEffect, useCallback, useRef } from 'react';
import { recipeService } from '../services/recipeService';

export function useRecipes(options = {}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const isInitialLoad = useRef(true);

  const fetchRecipes = useCallback(async (fetchOptions = {}) => {
    const isLoadMore = fetchOptions.page && fetchOptions.page > 1;
    
    if (!isLoadMore) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const result = await recipeService.getRecipes({ ...options, ...fetchOptions });
      
      if (isLoadMore) {
        setRecipes(prev => [...prev, ...result.recipes]);
      } else {
        setRecipes(result.recipes);
      }
      
      setPagination(prev => ({
        ...prev,
        ...result,
      }));
    } catch (err) {
      setError(err.message);
      if (!isLoadMore) {
        setRecipes([]);
      }
    } finally {
      setLoading(false);
      isInitialLoad.current = false;
    }
  }, [options]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const refetch = (newOptions) => fetchRecipes(newOptions);
  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchRecipes({ page: pagination.page + 1 });
    }
  };

  return {
    recipes,
    loading,
    error,
    pagination,
    refetch,
    loadMore,
    hasMore: pagination.page < pagination.totalPages,
  };
}

export function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await recipeService.getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError(err.message);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return { recipe, loading, error, refetch: () => {} };
}

export function usePopularRecipes(limit = 8) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await recipeService.getPopularRecipes(limit);
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [limit]);

  return { recipes, loading, error };
}

export function useQuickRecipes(limit = 8, maxMinutes = 30) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await recipeService.getQuickRecipes(limit, maxMinutes);
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [limit, maxMinutes]);

  return { recipes, loading, error };
}

export function useTrendingRecipes(limit = 8) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await recipeService.getTrendingRecipes(limit);
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [limit]);

  return { recipes, loading, error };
}