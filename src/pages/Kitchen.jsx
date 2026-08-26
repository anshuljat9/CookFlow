import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X, Plus, Trash2, CheckCircle2, Loader2, Utensils, ArrowLeft, Filter, ChefHat } from 'lucide-react';
import { ingredientCategories } from '../data/ingredients';
import { useKitchen } from '../hooks/useKitchen';
import { useKitchenRecipes } from '../hooks/useKitchenRecipes';
import { ingredientService } from '../services/ingredientService';
import { categoryService } from '../services/categoryService';
import CategoryChip from '../components/CategoryChip';
import IngredientChip from '../components/IngredientChip';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import KitchenRecipeCard from '../components/KitchenRecipeCard';
import FilterPanel from '../components/FilterPanel';
import FilterBottomSheet from '../components/FilterBottomSheet';
import IngredientMatchBadge from '../components/IngredientMatchBadge';

const MIN_MATCH_THRESHOLD = 50;

export default function Kitchen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const {
    selectedIngredientIds,
    selectedIngredients,
    isLoadingIngredients,
    count,
    addIngredient,
    removeIngredient,
    clearAll,
    hasIngredient,
    urlParams,
  } = useKitchen();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showResults, setShowResults] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const [cuisines, setCuisines] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [dietTypes, setDietTypes] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  
const { recipes, loading, error, threshold, filters, findRecipes, updateFilters, updateThreshold, refetch } = 
    useKitchenRecipes(selectedIngredientIds, { threshold: MIN_MATCH_THRESHOLD });
  
  const activeFilterCount = (() => {
    let c = 0;
    if (filters.cuisine) c++;
    if (filters.dietType) c++;
    if (filters.maxTime) c++;
    if (filters.difficulty) c++;
    return c;
  })();
  
  useEffect(() => {
    const urlIngredients = searchParams.get('ingredients');
    if (urlIngredients && !selectedIngredientIds.length) {
      const ids = urlIngredients.split(',').filter(Boolean);
      if (ids.length > 0) {
        // Note: We don't auto-add from URL to avoid conflicts with localStorage
        // The URL is mainly for sharing
      }
    }
  }, [searchParams, selectedIngredientIds]);
  
  const handleFindRecipes = useCallback(() => {
    setShowResults(true);
    // Update URL with ingredients for sharing
    if (selectedIngredientIds.length > 0) {
      const params = new URLSearchParams(searchParams);
      params.set('ingredients', selectedIngredientIds.join(','));
      navigate(`/kitchen?${params.toString()}`, { replace: true });
    }
  }, [selectedIngredientIds, searchParams, navigate]);
  
  const handleClearAll = useCallback(() => {
    clearAll();
    setShowResults(false);
    const params = new URLSearchParams(searchParams);
    params.delete('ingredients');
    navigate(`/kitchen?${params.toString()}`, { replace: true });
  }, [clearAll, searchParams, navigate]);
  
  const filteredIngredients = useMemo(async () => {
    if (searchQuery) {
      return await ingredientService.searchIngredients(searchQuery);
    }
    if (activeCategory === 'all') {
      return await ingredientService.getAllIngredients();
    }
    return await ingredientService.getIngredientsByCategory(activeCategory);
  }, [activeCategory, searchQuery]);
  
  const [ingredientsList, setIngredientsList] = useState([]);
  const [isLoadingIngredientsList, setIsLoadingIngredientsList] = useState(false);
  
  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoadingIngredientsList(true);
      try {
        let data;
        if (searchQuery) {
          data = await ingredientService.searchIngredients(searchQuery);
        } else if (activeCategory === 'all') {
          data = await ingredientService.getAllIngredients();
        } else {
          data = await ingredientService.getIngredientsByCategory(activeCategory);
        }
        setIngredientsList(data);
      } catch (err) {
        console.error('Failed to load ingredients:', err);
        setIngredientsList([]);
      } finally {
        setIsLoadingIngredientsList(false);
      }
    };
    fetchIngredients();
  }, [activeCategory, searchQuery]);
  
  const availableIngredients = ingredientsList.filter(
    ing => !hasIngredient(ing.id)
  );
  
  const handleAddIngredient = useCallback((ingredient) => {
    addIngredient(ingredient);
  }, [addIngredient]);
  
  const handleRemoveIngredient = useCallback((id) => {
    removeIngredient(id);
  }, [removeIngredient]);

  return (
    <div className="animate-fade-in">
      <div className="container-custom py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-warm-100">My Kitchen</h1>
          <p className="text-charcoal-500 dark:text-charcoal-400 mt-1">Select the ingredients you already have and we'll find recipes you can make</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="card p-5" aria-labelledby="kitchen-heading">
              <h2 id="kitchen-heading" className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary-600" />
                Your Kitchen {count > 0 && (
                  <span className="text-sm font-normal text-charcoal-500 dark:text-charcoal-400">— {count} ingredient{count !== 1 ? 's' : ''}</span>
                )}
              </h2>

              {count > 0 ? (
                <div className="flex flex-wrap gap-2 mb-6" role="list" aria-label="Selected ingredients">
                  {selectedIngredients.map(ing => (
                    <IngredientChip 
                      key={ing.id} 
                      ingredient={ing} 
                      onRemove={handleRemoveIngredient}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-charcoal-500 dark:text-charcoal-400 text-center py-8">
                  Your kitchen is empty. Start adding ingredients!
                </p>
              )}

              <div className="relative">
                <label htmlFor="ingredient-search" className="sr-only">Search ingredients to add</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" aria-hidden="true" />
                  <input
                    id="ingredient-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ingredients (e.g., potato, paneer, tomato...)"
                    className="input pl-12 pr-12"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-warm-100 dark:hover:bg-charcoal-800 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="card p-5" aria-labelledby="browse-heading">
              <h2 id="browse-heading" className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4">Browse by Category</h2>
              <div className="flex flex-wrap gap-2 mb-4" role="tablist">
                <CategoryChip
                  role="tab"
                  aria-selected={activeCategory === 'all'}
                  label="All"
                  selected={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                />
                {ingredientCategories.map(cat => (
                  <CategoryChip
                    key={cat.id}
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    label={cat.name}
                    icon={cat.icon}
                    selected={activeCategory === cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    count={ingredientsList.filter(ing => ing.category === cat.id && !hasIngredient(ing.id)).length}
                  />
                ))}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {isLoadingIngredientsList ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" aria-busy="true" aria-label="Loading ingredients">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="p-3 rounded-xl bg-warm-100 dark:bg-charcoal-800 animate-pulse flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-warm-200 dark:bg-charcoal-700" />
                        <div className="h-4 w-24 bg-warm-200 dark:bg-charcoal-700 rounded" />
                      </div>
                    ))}
                  </div>
                ) : availableIngredients.length === 0 ? (
                  <p className="text-charcoal-500 dark:text-charcoal-400 text-center py-8">
                    {searchQuery ? 'No ingredients found' : 'All ingredients in this category already added'}
                  </p>
                ) : (
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="listbox">
                    {availableIngredients.map(ing => (
                      <li
                        key={ing.id}
                        role="option"
                        onClick={() => handleAddIngredient(ing)}
                        className="p-3 rounded-xl bg-warm-50 dark:bg-charcoal-800 hover:bg-warm-100 dark:hover:bg-charcoal-700 cursor-pointer transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <span className="text-lg" aria-hidden="true">{ing.icon || '🥬'}</span>
                        <span className="text-charcoal-700 dark:text-warm-200">{ing.name}</span>
                        <Plus className="h-4 w-4 text-charcoal-400 ml-auto" aria-hidden="true" />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="card p-5 sticky top-24" aria-labelledby="actions-heading">
              <h2 id="actions-heading" className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4">Actions</h2>

              <Button 
                className="w-full mb-3" 
                size="lg" 
                leftIcon={<Loader2 className="h-5 w-5" />}
                onClick={handleFindRecipes}
                disabled={count === 0 || loading}
              >
                {loading ? 'Finding Recipes...' : 'Find Recipes'}
              </Button>

              {count > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full mb-4" 
                  leftIcon={<Trash2 className="h-5 w-5" />}
                  onClick={handleClearAll}
                >
                  Clear All Ingredients
                </Button>
              )}

              <div className="p-4 rounded-xl bg-warm-50 dark:bg-charcoal-800">
                <h3 className="font-medium text-charcoal-900 dark:text-warm-100 mb-2">Tips</h3>
                <ul className="text-sm text-charcoal-600 dark:text-charcoal-400 space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" /> Add staples first (oil, salt, spices)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" /> Include fresh produce you have</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" /> Don't forget proteins & grains</li>
                </ul>
              </div>
            </section>

            {showResults && (
              <section className="card p-5 sticky top-24 mt-4 animate-slide-up" aria-labelledby="results-heading">
                <div className="flex items-center justify-between mb-4">
                  <h2 id="results-heading" className="font-semibold text-charcoal-900 dark:text-warm-100 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Recipes You Can Make
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowResults(false)}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </div>
                
                <div className="mb-4 p-3 rounded-xl bg-warm-50 dark:bg-charcoal-800 text-sm text-charcoal-600 dark:text-charcoal-400">
                  Based on <strong>{count} ingredient{count !== 1 ? 's' : ''}</strong> in your kitchen. 
                  We found <strong>{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</strong> 
                  {threshold > 0 ? ` (≥${threshold}% match)` : ''}.
                </div>

                {error ? (
                  <div className="card p-8 text-center" role="alert">
                    <p className="text-charcoal-500 dark:text-charcoal-400 mb-4">{error}</p>
                    <Button variant="primary" leftIcon={<Loader2 className="h-4 w-4" />} onClick={refetch}>
                      Try Again
                    </Button>
                  </div>
                ) : loading ? (
                  <div className="grid grid-cols-1 gap-6" role="list" aria-label="Recipes" aria-busy="true">
                    {[...Array(4)].map((_, i) => (
                      <RecipeCardSkeleton key={i} variant="default" />
                    ))}
                  </div>
                ) : recipes.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-6" role="list" aria-label="Recipes">
                      {recipes.map(recipe => (
                        <KitchenRecipeCard 
                          key={recipe.id} 
                          recipe={recipe} 
                          match={recipe.match}
                          variant="default"
                        />
                      ))}
                    </div>
                    {activeFilterCount > 0 && (
                      <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
                        <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Active filters:</span>
                        {filters.cuisine && (
                          <CategoryChip 
                            label={cuisines.find(c => c.id === filters.cuisine)?.name || filters.cuisine}
                            selected 
                            onClick={() => updateFilters({ cuisine: '' })}
                          />
                        )}
                        {filters.dietType && (
                          <CategoryChip 
                            label={dietTypes.find(d => d.id === filters.dietType)?.name || filters.dietType}
                            selected 
                            onClick={() => updateFilters({ dietType: '' })}
                          />
                        )}
                        {filters.maxTime && (
                          <CategoryChip 
                            label={filters.maxTime}
                            selected 
                            onClick={() => updateFilters({ maxTime: '' })}
                          />
                        )}
                        {filters.difficulty && (
                          <CategoryChip 
                            label={difficulties.find(d => d.id === filters.difficulty)?.name || filters.difficulty}
                            selected 
                            onClick={() => updateFilters({ difficulty: '' })}
                          />
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-warm-200 dark:border-charcoal-800 pt-4">
                      <Button variant="outline" onClick={() => setShowResults(false)}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to Kitchen
                      </Button>
                      <Button variant="outline" onClick={() => setIsMobileFiltersOpen(true)}>
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="ml-1 px-2 py-0.5 rounded-full bg-primary-600 text-white text-xs">{activeFilterCount}</span>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <EmptyState 
                    type="search" 
                    onActionClick={handleClearAll}
                    showClearFilters={count > 0}
                    showPopularRecipes={true}
                  />
                )}
              </section>
            )}

            {!showResults && count === 0 && (
              <EmptyState type="kitchen" className="mt-4" />
            )}
          </div>
        </div>
      </div>

      <FilterBottomSheet
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={() => updateFilters({ cuisine: '', dietType: '', maxTime: '', difficulty: '' })}
        cuisines={cuisines}
        categories={[]}
        mealTypes={mealTypes}
        dietTypes={dietTypes}
        difficulties={difficulties}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}