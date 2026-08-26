import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Utensils, MapPin } from 'lucide-react';

export default function SearchSuggestions({
  suggestions,
  onSelect,
  onClose,
  highlightedIndex,
  setHighlightedIndex,
  inputRef,
}) {
  const containerRef = useRef(null);
  const { recipes = [], ingredients = [], cuisines = [] } = suggestions || {};

  const hasSuggestions = recipes.length > 0 || ingredients.length > 0 || cuisines.length > 0;

  if (!hasSuggestions) return null;

  const totalItems = recipes.length + ingredients.length + cuisines.length;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current?.contains(e.target)) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => Math.min(prev + 1, totalItems - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelection(highlightedIndex);
          }
          break;
        case 'Escape':
          onClose?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [totalItems, highlightedIndex, setHighlightedIndex, onClose]);

  const handleSelection = (index) => {
    let itemIndex = 0;
    
    for (const recipe of recipes) {
      if (itemIndex === index) {
        onSelect?.({ type: 'recipe', data: recipe });
        return;
      }
      itemIndex++;
    }
    
    for (const ingredient of ingredients) {
      if (itemIndex === index) {
        onSelect?.({ type: 'ingredient', data: ingredient });
        return;
      }
      itemIndex++;
    }
    
    for (const cuisine of cuisines) {
      if (itemIndex === index) {
        onSelect?.({ type: 'cuisine', data: cuisine });
        return;
      }
      itemIndex++;
    }
  };

  const renderItem = (item, index, icon, iconColor, navigateUrl) => {
    const isHighlighted = highlightedIndex === index;
    return (
      <button
        key={`${item.type}-${item.id || index}`}
        type="button"
        onClick={() => handleSelection(index)}
        onMouseEnter={() => setHighlightedIndex(index)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
          isHighlighted ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-warm-50 dark:hover:bg-charcoal-800'
        }`}
        role="option"
        aria-selected={isHighlighted}
      >
        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <span className="font-medium text-charcoal-900 dark:text-warm-100 truncate block">
            {item.name || item.title}
          </span>
          {item.cuisine && (
            <span className="text-xs text-charcoal-500 dark:text-charcoal-400">
              {item.cuisine.icon} {item.cuisine.name}
            </span>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-charcoal-400 dark:text-charcoal-500 flex-shrink-0" />
      </button>
    );
  };

  let flatIndex = 0;

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-charcoal-900 rounded-2xl shadow-xl border border-warm-200 dark:border-charcoal-800 overflow-hidden z-50 animate-fade-in"
      role="listbox"
      aria-label="Search suggestions"
    >
      {recipes.length > 0 && (
        <>
          <div className="px-4 py-2 text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider border-b border-warm-100 dark:border-charcoal-800">
            Recipes
          </div>
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${recipe.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleSelection(flatIndex);
              }}
              onMouseEnter={() => setHighlightedIndex(flatIndex)}
              className={`block w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                highlightedIndex === flatIndex ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-warm-50 dark:hover:bg-charcoal-800'
              }`}
              role="option"
              aria-selected={highlightedIndex === flatIndex}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-warm-100 dark:bg-charcoal-800 flex items-center justify-center">
                <Utensils className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-charcoal-900 dark:text-warm-100 truncate block">
                  {recipe.title}
                </span>
                {recipe.cuisine && (
                  <span className="text-xs text-charcoal-500 dark:text-charcoal-400">
                    {recipe.cuisine.icon} {recipe.cuisine.name}
                  </span>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-charcoal-400 dark:text-charcoal-500 flex-shrink-0" />
            </Link>
          ))}
          {flatIndex += recipes.length}
        </>
      )}

      {ingredients.length > 0 && (
        <>
          <div className="px-4 py-2 text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider border-b border-warm-100 dark:border-charcoal-800">
            Ingredients
          </div>
          {ingredients.map((ingredient) => (
            <button
              key={ingredient.id}
              type="button"
              onClick={() => handleSelection(flatIndex)}
              onMouseEnter={() => setHighlightedIndex(flatIndex)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                highlightedIndex === flatIndex ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-warm-50 dark:hover:bg-charcoal-800'
              }`}
              role="option"
              aria-selected={highlightedIndex === flatIndex}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
              </span>
              <span className="font-medium text-charcoal-900 dark:text-warm-100 truncate block">
                {ingredient.name}
              </span>
              <ChevronRight className="h-5 w-5 text-charcoal-400 dark:text-charcoal-500 flex-shrink-0" />
            </button>
          ))}
          {flatIndex += ingredients.length}
        </>
      )}

      {cuisines.length > 0 && (
        <>
          <div className="px-4 py-2 text-xs font-semibold text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wider border-b border-warm-100 dark:border-charcoal-800">
            Cuisines
          </div>
          {cuisines.map((cuisine) => (
            <Link
              key={cuisine.id}
              to={`/explore?cuisine=${cuisine.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleSelection(flatIndex);
              }}
              onMouseEnter={() => setHighlightedIndex(flatIndex)}
              className={`block w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                highlightedIndex === flatIndex ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-warm-50 dark:hover:bg-charcoal-800'
              }`}
              role="option"
              aria-selected={highlightedIndex === flatIndex}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl">
                {cuisine.icon}
              </span>
              <span className="font-medium text-charcoal-900 dark:text-warm-100 truncate block">
                {cuisine.name}
              </span>
              <ChevronRight className="h-5 w-5 text-charcoal-400 dark:text-charcoal-500 flex-shrink-0" />
            </Link>
          ))}
        </>
      )}

      <div className="px-4 py-3 border-t border-warm-100 dark:border-charcoal-800">
        <button
          type="button"
          onClick={() => onSelect?.({ type: 'search-all', query: '' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Search all recipes</span>
        </button>
      </div>
    </div>
  );
}