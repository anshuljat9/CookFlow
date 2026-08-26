import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import SearchSuggestions from './SearchSuggestions';
import { recipeService } from '../services/recipeService';

const DEBOUNCE_MS = 300;

export default function SearchBar({
  placeholder = "What are you craving?",
  value,
  onChange,
  onSubmit,
  showClear = true,
  className = '',
  autoFocus = false,
  showSuggestions = true,
  onSuggestionSelect,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState({ recipes: [], ingredients: [], cuisines: [] });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    setHighlightedIndex(-1);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (showSuggestions && value && value.trim().length >= 2) {
        setDebouncedQuery(value.trim());
        try {
          const data = await recipeService.getSearchSuggestions(value.trim());
          setSuggestions(data);
          setShowDropdown(true);
        } catch (err) {
          console.error('Failed to fetch suggestions:', err);
          setSuggestions({ recipes: [], ingredients: [], cuisines: [] });
          setShowDropdown(false);
        }
      } else {
        setSuggestions({ recipes: [], ingredients: [], cuisines: [] });
        setShowDropdown(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value, showSuggestions]);

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSuggestions({ recipes: [], ingredients: [], cuisines: [] });
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    onSubmit?.(value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
      setIsFocused(false);
    }, 200);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value && value.trim().length >= 2 && showSuggestions) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    
    const totalItems = suggestions.recipes.length + suggestions.ingredients.length + suggestions.cuisines.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, totalItems));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        if (highlightedIndex >= 0) {
          e.preventDefault();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionSelect = (selection) => {
    setShowDropdown(false);
    setHighlightedIndex(-1);
    
    switch (selection.type) {
      case 'recipe':
        onSuggestionSelect?.(selection);
        break;
      case 'ingredient':
      case 'cuisine':
        onSuggestionSelect?.(selection);
        break;
      case 'search-all':
        onSubmit?.(value);
        break;
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <label htmlFor="search-input" className="sr-only">Search recipes</label>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-primary-500/20' : ''}`}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400 dark:text-charcoal-500 transition-colors duration-200" aria-hidden="true" />
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-warm-300 bg-white text-charcoal-900 placeholder-charcoal-400 text-base transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-warm-100 dark:placeholder-charcoal-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={showDropdown}
            role="combobox"
          />
          {showClear && value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-warm-100 dark:hover:bg-charcoal-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>
      
      {showSuggestions && showDropdown && (
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
          onClose={() => setShowDropdown(false)}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          inputRef={inputRef}
        />
      )}
    </div>
  );
}