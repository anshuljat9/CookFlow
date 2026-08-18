import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Filter, X, ChevronDown, Grid, List, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes';
import { categoryService } from '../services/categoryService';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import CategoryChip from '../components/CategoryChip';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

const initialFilters = {
  search: '',
  cuisine: '',
  category: '',
  vegetarian: false,
  cookingTime: '',
  difficulty: '',
  sort: 'popular',
};

export default function Explore() {
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [cookingTimes] = useState([
    { id: 'under-15', name: 'Under 15 min', value: 15 },
    { id: '15-30', name: '15-30 min', value: 30 },
    { id: '30-60', name: '30-60 min', value: 60 },
    { id: 'over-60', name: 'Over 60 min', value: 120 },
  ]);

  const {
    recipes,
    loading,
    error,
    pagination,
    refetch,
    loadMore,
    hasMore,
  } = useRecipes(filters);

  const activeFilterCount = (() => {
    let count = 0;
    if (filters.cuisine) count++;
    if (filters.category) count++;
    if (filters.vegetarian) count++;
    if (filters.cookingTime) count++;
    if (filters.difficulty) count++;
    return count;
  })();

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [cuisinesData, categoriesData, difficultiesData] = await Promise.all([
          categoryService.getCuisines(),
          categoryService.getCategories(),
          categoryService.getDifficulties(),
        ]);
        setCuisines(cuisinesData);
        setCategories(categoriesData);
        setDifficulties(difficultiesData);
      } catch (err) {
        console.error('Failed to load reference data:', err);
      }
    };
    fetchReferenceData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: initialFilters[key] }));
  };

  const handleRetry = () => {
    refetch();
  };

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
              />
              <Button 
                variant="outline" 
                leftIcon={<Filter className="h-4 w-4" />}
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
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
          <aside className="lg:w-64 flex-shrink-0" aria-label="Filters">
            <div className={`${isFiltersOpen ? 'block' : 'hidden lg:block'} lg:sticky lg:top-24`}>
              <div className="card p-4 lg:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-charcoal-900 dark:text-warm-100">Filters</h2>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-3.5 w-3.5" />
                      Clear all
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="label" htmlFor="cuisine-filter">Cuisine</label>
                    <select
                      id="cuisine-filter"
                      value={filters.cuisine}
                      onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                      className="input text-sm py-2"
                    >
                      <option value="">All Cuisines</option>
                      {cuisines.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label" htmlFor="category-filter">Category</label>
                    <select
                      id="category-filter"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input text-sm py-2"
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Cooking Time</label>
                    <div className="flex flex-col gap-2">
                      {cookingTimes.map(time => (
                        <label key={time.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="cookingTime"
                            value={time.id}
                            checked={filters.cookingTime === time.id}
                            onChange={(e) => handleFilterChange('cookingTime', e.target.value)}
                            className="w-4 h-4 text-primary-600 border-warm-300 focus:ring-primary-500"
                          />
                          <span className="text-sm text-charcoal-700 dark:text-warm-200">{time.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="difficulty-filter">Difficulty</label>
                    <select
                      id="difficulty-filter"
                      value={filters.difficulty}
                      onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                      className="input text-sm py-2"
                    >
                      <option value="">Any Difficulty</option>
                      {difficulties.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.vegetarian}
                        onChange={(e) => handleFilterChange('vegetarian', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-warm-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-charcoal-700 dark:text-warm-200">Vegetarian only</span>
                    </label>
                  </div>

                  <div>
                    <label className="label" htmlFor="sort-filter">Sort By</label>
                    <select
                      id="sort-filter"
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="input text-sm py-2"
                    >
                      <option value="popular">Popular</option>
                      <option value="rating">Highest Rated</option>
                      <option value="time-asc">Quickest First</option>
                      <option value="time-desc">Longest First</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0" role="main">
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">
                <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Active filters:</span>
                {filters.cuisine && (
                  <CategoryChip 
                    label={cuisines.find(c => c.id === filters.cuisine)?.name || filters.cuisine}
                    selected 
                    onClick={() => removeFilter('cuisine')}
                  />
                )}
                {filters.category && (
                  <CategoryChip 
                    label={categories.find(c => c.id === filters.category)?.name || filters.category}
                    selected 
                    onClick={() => removeFilter('category')}
                  />
                )}
                {filters.vegetarian && (
                  <CategoryChip 
                    label="Vegetarian" 
                    selected 
                    onClick={() => removeFilter('vegetarian')}
                  />
                )}
                {filters.cookingTime && (
                  <CategoryChip 
                    label={cookingTimes.find(t => t.id === filters.cookingTime)?.name || filters.cookingTime}
                    selected 
                    onClick={() => removeFilter('cookingTime')}
                  />
                )}
                {filters.difficulty && (
                  <CategoryChip 
                    label={difficulties.find(d => d.id === filters.difficulty)?.name || filters.difficulty}
                    selected 
                    onClick={() => removeFilter('difficulty')}
                  />
                )}
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
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}