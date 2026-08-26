import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, X, ChevronDown, Grid, List, Loader2, AlertCircle, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes';
import { categoryService } from '../services/categoryService';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import CategoryChip from '../components/CategoryChip';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import FilterPanel from '../components/FilterPanel';
import FilterBottomSheet from '../components/FilterBottomSheet';
import { DEFAULT_FILTERS, FILTER_CONFIG, getActiveFilterCount, filtersToSearchParams, searchParamsToFilters } from '../utils/filterConfig';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState(() => searchParamsToFilters(searchParams));
  const [viewMode, setViewMode] = useState('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [dietTypes, setDietTypes] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  const {
    recipes,
    loading,
    error,
    pagination,
    refetch,
    loadMore,
    hasMore,
  } = useRecipes(filters);

  const activeFilterCount = getActiveFilterCount(filters);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [cuisinesData, categoriesData, mealTypesData, dietTypesData, difficultiesData] = await Promise.all([
          categoryService.getCuisines(),
          categoryService.getCategories('meal'),
          categoryService.getMealTypes(),
          categoryService.getDietTypes(),
          categoryService.getDifficulties(),
        ]);
        setCuisines(cuisinesData);
        setCategories(categoriesData);
        setMealTypes(mealTypesData);
        setDietTypes(dietTypesData);
        setDifficulties(difficultiesData);
      } catch (err) {
        console.error('Failed to load reference data:', err);
      }
    };
    fetchReferenceData();
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value, page: 1 };
      const params = filtersToSearchParams(next);
      navigate(`/explore?${params}`, { replace: true });
      return next;
    });
  }, [navigate]);

  const clearFilters = useCallback(() => {
    const params = filtersToSearchParams(DEFAULT_FILTERS);
    navigate(`/explore?${params}`, { replace: true });
    setFilters(DEFAULT_FILTERS);
  }, [navigate]);

  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const defaultValue = DEFAULT_FILTERS[key];
      const next = { ...prev, [key]: defaultValue };
      const params = filtersToSearchParams(next);
      navigate(`/explore?${params}`, { replace: true });
      return next;
    });
  }, [navigate]);

  const handleRetry = () => {
    refetch();
  };

  const activeFilterChips = useMemo(() => {
    const chips = [];
    
    if (filters.cuisine) {
      const cuisine = cuisines.find(c => c.id === filters.cuisine);
      chips.push({ 
        label: cuisine ? `${cuisine.icon} ${cuisine.name}` : filters.cuisine, 
        key: 'cuisine' 
      });
    }
    if (filters.category) {
      const category = categories.find(c => c.id === filters.category);
      chips.push({ 
        label: category ? `${category.icon} ${category.name}` : filters.category, 
        key: 'category' 
      });
    }
    if (filters.mealType) {
      const mealType = mealTypes.find(m => m.id === filters.mealType);
      chips.push({ 
        label: mealType ? `${mealType.icon} ${mealType.name}` : filters.mealType, 
        key: 'mealType' 
      });
    }
    if (filters.dietType) {
      const dietType = dietTypes.find(d => d.id === filters.dietType);
      chips.push({ 
        label: dietType ? `${dietType.icon} ${dietType.name}` : filters.dietType, 
        key: 'dietType' 
      });
    }
    if (filters.difficulty) {
      const difficulty = difficulties.find(d => d.id === filters.difficulty);
      chips.push({ 
        label: difficulty?.name || filters.difficulty, 
        key: 'difficulty' 
      });
    }
    if (filters.maxTime) {
      const timeOpt = FILTER_CONFIG.cookingTime.options.find(t => t.id === filters.maxTime);
      chips.push({ 
        label: timeOpt?.name || filters.maxTime, 
        key: 'maxTime' 
      });
    }
    if (filters.minRating) {
      const ratingOpt = FILTER_CONFIG.rating.options.find(r => r.value == filters.minRating);
      chips.push({ 
        label: ratingOpt?.name || `${filters.minRating}+ Stars`, 
        key: 'minRating' 
      });
    }
    
    return chips;
  }, [filters, cuisines, categories, mealTypes, dietTypes, difficulties]);

  return (
    <div className="animate-fade-in">
      <div className="bg-warm-50 dark:bg-charcoal-900 border-b border-warm-200 dark:border-charcoal-800">
        <div className="container-custom py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-warm-100">Explore Recipes</h1>
              <p className="text-charcoal-500 dark:text-charcoal-400 mt-1">Discover your next favorite meal</p>
            </div>
            <div className="flex flex-1 lg:flex-none gap-4">
              <SearchBar 
                value={filters.search}
                onChange={(v) => handleFilterChange('search', v)}
                placeholder="Search recipes..."
                className="flex-1 max-w-md"
                showSuggestions={true}
              />
              <Button 
                variant="outline" 
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden"
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-primary-600 text-white text-xs">{activeFilterCount}</span>
                )}
              </Button>
              <div className="hidden lg:flex items-center gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'} 
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid className="h-5 w-5" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'ghost'} 
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0 hidden lg:block" aria-label="Filters">
            <div className="lg:sticky lg:top-24">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                cuisines={cuisines}
                categories={categories}
                mealTypes={mealTypes}
                dietTypes={dietTypes}
                difficulties={difficulties}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0" role="main">
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
                <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Active filters:</span>
                {activeFilterChips.map(({ label, key }) => (
                  <CategoryChip
                    key={key}
                    label={label}
                    selected
                    onClick={() => removeFilter(key)}
                  />
                ))}
              </div>
            )}

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                {pagination.total} recipe{pagination.total !== 1 ? 's' : ''} found
              </p>
              <div className="hidden lg:flex items-center gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'} 
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'ghost'} 
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {error ? (
              <div className="card p-8 text-center" role="alert">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-warm-100 mb-2">
                  Unable to load recipes
                </h3>
                <p className="text-charcoal-500 dark:text-charcoal-400 mb-4">
                  {error}
                </p>
                <Button variant="primary" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={handleRetry}>
                  Try Again
                </Button>
              </div>
            ) : loading ? (
              <div 
                className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                role="list"
                aria-label="Recipes"
                aria-busy="true"
              >
                {[...Array(6)].map((_, i) => (
                  <RecipeCardSkeleton key={i} variant={viewMode === 'list' ? 'compact' : 'default'} />
                ))}
              </div>
            ) : recipes.length > 0 ? (
              <>
                <div 
                  className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                  role="list"
                  aria-label="Recipes"
                >
                  {recipes.map(recipe => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      variant={viewMode === 'list' ? 'compact' : 'default'}
                    />
                  ))}
                </div>
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button 
                      variant="outline" 
                      leftIcon={<Loader2 className="h-4 w-4" />}
                      onClick={loadMore}
                      disabled={loading}
                    >
                      Load More Recipes
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState 
                type="search" 
                onActionClick={clearFilters}
                showClearFilters={activeFilterCount > 0}
                showPopularRecipes={true}
              />
            )}
          </main>
        </div>
      </div>

      <FilterBottomSheet
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        cuisines={cuisines}
        categories={categories}
        mealTypes={mealTypes}
        dietTypes={dietTypes}
        difficulties={difficulties}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}