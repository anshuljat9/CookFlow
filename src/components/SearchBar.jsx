import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function SearchBar({ 
  placeholder = "What are you craving?", 
  value, 
  onChange, 
  onSubmit,
  showClear = true,
  className = '',
  autoFocus = false
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <label htmlFor="search-input" className="sr-only">Search recipes</label>
      <div className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-primary-500/20' : ''}`}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400 dark:text-charcoal-500 transition-colors duration-200" aria-hidden="true" />
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-warm-300 bg-white text-charcoal-900 placeholder-charcoal-400 text-base transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-warm-100 dark:placeholder-charcoal-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
          autoComplete="off"
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
  );
}