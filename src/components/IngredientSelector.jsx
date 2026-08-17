import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { ingredients, ingredientCategories, getIngredientsByCategory, searchIngredients } from '../data/ingredients';
import CategoryChip from './CategoryChip';
import IngredientChip from './IngredientChip';

export default function IngredientSelector({ 
  selectedIngredients = [], 
  onChange,
  placeholder = "Search ingredients...",
  maxSelections,
  className = ''
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredIngredients = searchQuery 
    ? searchIngredients(searchQuery)
    : activeCategory === 'all'
      ? ingredients
      : getIngredientsByCategory(activeCategory);

  const availableIngredients = filteredIngredients.filter(
    ing => !selectedIngredients.some(sel => sel.id === ing.id)
  );

  const handleSelect = (ingredient) => {
    if (maxSelections && selectedIngredients.length >= maxSelections) return;
    onChange([...selectedIngredients, ingredient]);
    setSearchQuery('');
    setHighlightedIndex(-1);
    searchInputRef.current?.focus();
  };

  const handleRemove = (id) => {
    onChange(selectedIngredients.filter(ing => ing.id !== id));
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, availableIngredients.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && availableIngredients[highlightedIndex]) {
          handleSelect(availableIngredients[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div 
        className="relative"
        onKeyDown={handleKeyDown}
      >
        <div 
          className="flex flex-wrap gap-2 min-h-[48px] px-4 py-2.5 rounded-2xl border border-warm-300 bg-white text-charcoal-900 placeholder-charcoal-400 transition-all duration-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-warm-100 dark:placeholder-charcoal-500 dark:focus-within:border-primary-400 dark:focus-within:ring-primary-400/20"
          onClick={() => { setIsDropdownOpen(true); searchInputRef.current?.focus(); }}
          role="combobox"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          aria-label="Select ingredients"
        >
          {selectedIngredients.map(ing => (
            <IngredientChip 
              key={ing.id} 
              ingredient={ing} 
              onRemove={handleRemove}
              showIcon
            />
          ))}
          
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => { 
              setSearchQuery(e.target.value); 
              setIsDropdownOpen(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            placeholder={selectedIngredients.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[150px] bg-transparent border-none outline-none text-sm py-1"
            aria-activedescendant={highlightedIndex >= 0 ? `ingredient-${availableIngredients[highlightedIndex]?.id}` : undefined}
            aria-autocomplete="list"
            role="searchbox"
          />
          
          <ChevronDown className={`h-5 w-5 text-charcoal-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </div>

        {isDropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 w-full max-h-96 mt-2 rounded-2xl bg-white border border-warm-200 shadow-lg overflow-hidden dark:bg-charcoal-800 dark:border-charcoal-700 animate-scale-in"
            role="listbox"
          >
            <div className="px-3 py-2 border-b border-warm-200 dark:border-charcoal-700 sticky top-0 bg-white dark:bg-charcoal-800 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setHighlightedIndex(-1); }}
                  placeholder="Filter ingredients..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-warm-300 bg-warm-50 text-charcoal-900 text-sm focus:outline-none focus:border-primary-500 dark:border-charcoal-600 dark:bg-charcoal-900 dark:text-warm-100"
                />
              </div>
            </div>

            <div className="flex gap-1 px-2 py-2 border-b border-warm-200 dark:border-charcoal-700 overflow-x-auto sticky top-[48px] bg-white dark:bg-charcoal-800 z-10" role="tablist">
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

            <div className="max-h-[400px] overflow-y-auto p-2">
              {availableIngredients.length === 0 ? (
                <div className="py-8 text-center text-charcoal-500 dark:text-charcoal-400">
                  {searchQuery ? 'No ingredients found' : 'All ingredients already selected'}
                </div>
              ) : (
                <ul role="listbox" className="space-y-1">
                  {availableIngredients.map((ing, index) => (
                    <li
                      key={ing.id}
                      id={`ingredient-${ing.id}`}
                      role="option"
                      aria-selected={index === highlightedIndex}
                      className={`px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium cursor-pointer transition-colors duration-150 ${index === highlightedIndex ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-warm-100 dark:hover:bg-charcoal-700'}`}
                      onClick={() => handleSelect(ing)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <span className="text-lg">{ing.icon}</span>
                      <span className="flex-1 text-charcoal-900 dark:text-warm-100">{ing.name}</span>
                      <span className="text-xs text-charcoal-400 dark:text-charcoal-500 capitalize">{ing.category}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}