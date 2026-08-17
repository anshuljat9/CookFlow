import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Plus, Trash2, CheckCircle2, Loader2, Utensils } from 'lucide-react';
import { ingredients, ingredientCategories, getIngredientsByCategory, searchIngredients } from '../data/ingredients';
import { getRecipesByCategory as getMatchingRecipes } from '../data/recipes';
import CategoryChip from '../components/CategoryChip';
import IngredientChip from '../components/IngredientChip';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

const mockMatchingRecipes = [
  { id: 1, title: 'Butter Chicken', cuisine: 'indian', cookingTime: 45, rating: 4.8, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&auto=format&fit=crop', matchedIngredients: 5, totalIngredients: 12 },
  { id: 5, title: 'Korean Garlic Noodles', cuisine: 'korean', cookingTime: 15, rating: 4.7, image: 'https://images.unsplash.com/photo-1619995987388-3e0b3e8a4c4a?w=400&auto=format&fit=crop', matchedIngredients: 4, totalIngredients: 8 },
  { id: 7, title: 'Greek Salad', cuisine: 'mediterranean', cookingTime: 10, rating: 4.4, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop', matchedIngredients: 4, totalIngredients: 7 },
];

export default function Kitchen() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const filteredIngredients = useMemo(() => {
    if (searchQuery) return searchIngredients(searchQuery);
    if (activeCategory === 'all') return ingredients;
    return getIngredientsByCategory(activeCategory);
  }, [activeCategory, searchQuery]);

  const availableIngredients = filteredIngredients.filter(
    ing => !selectedIngredients.some(sel => sel.id === ing.id)
  );

  const handleAddIngredient = (ingredient) => {
    if (!selectedIngredients.some(sel => sel.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleRemoveIngredient = (id) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing.id !== id));
  };

  const handleFindRecipes = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 1500);
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
    setShowResults(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="container-custom py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-warm-100">My Kitchen</h1>
          <p className="text-charcoal-500 dark:text-charcoal-400 mt-1">Add ingredients you have, find recipes you can make</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="card p-5" aria-labelledby="kitchen-heading">
              <h2 id="kitchen-heading" className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary-600" />
                Your Kitchen
              </h2>

              {selectedIngredients.length > 0 ? (
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
                  No ingredients added yet. Start building your kitchen!
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
                    placeholder="Search ingredients to add..."
                    className="input pl-12 pr-12"
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
                    count={getIngredientsByCategory(cat.id).filter(ing => !selectedIngredients.some(sel => sel.id === ing.id)).length}
                  />
                ))}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {availableIngredients.length === 0 ? (
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
                        <span className="text-lg">{ing.icon}</span>
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
                disabled={selectedIngredients.length === 0 || isSearching}
              >
                {isSearching ? 'Finding Recipes...' : 'Find Recipes'}
              </Button>

              {selectedIngredients.length > 0 && (
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
                <h2 id="results-heading" className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Recipes You Can Make
                </h2>
                <div className="space-y-3">
                  {mockMatchingRecipes.map(recipe => (
                    <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="block">
                      <div className="flex gap-3 p-3 rounded-xl hover:bg-warm-50 dark:hover:bg-charcoal-800 transition-colors">
                        <img src={recipe.image} alt={recipe.title} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-charcoal-900 dark:text-warm-100 truncate">{recipe.title}</h3>
                          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{recipe.matchedIngredients}/{recipe.totalIngredients} ingredients matched</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-charcoal-400">
                            <span>⏱ {recipe.cookingTime}m</span>
                            <span>★ {recipe.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setShowResults(false)}>
                  Back to Kitchen
                </Button>
              </section>
            )}

            {!showResults && selectedIngredients.length === 0 && (
              <EmptyState type="kitchen" className="mt-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}