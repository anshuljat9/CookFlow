import { useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { FILTER_CONFIG, SORT_OPTIONS } from '../utils/filterConfig';
import CategoryChip from './CategoryChip';

export default function FilterBottomSheet({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  cuisines = [],
  categories = [],
  mealTypes = [],
  dietTypes = [],
  difficulties = [],
  activeFilterCount,
}) {
  const sheetRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleCookingTimeChange = (value) => {
    onFilterChange('maxTime', value === filters.maxTime ? '' : value);
  };

  const renderSelectFilter = (filterKey, options, placeholder) => {
    const config = FILTER_CONFIG[filterKey];
    const value = filters[config.key];
    
    return (
      <div>
        <label className="label" htmlFor={`${filterKey}-filter-mobile`}>{config.label}</label>
        <select
          id={`${filterKey}-filter-mobile`}
          value={value}
          onChange={(e) => onFilterChange(config.key, e.target.value)}
          className="input text-base py-3"
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.icon ? `${opt.icon} ` : ''}{opt.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (filters.cuisine) {
      const cuisine = cuisines.find(c => c.id === filters.cuisine);
      activeFilters.push({ 
        label: cuisine ? `${cuisine.icon} ${cuisine.name}` : filters.cuisine, 
        key: 'cuisine' 
      });
    }
    if (filters.category) {
      const category = categories.find(c => c.id === filters.category);
      activeFilters.push({ 
        label: category ? `${category.icon} ${category.name}` : filters.category, 
        key: 'category' 
      });
    }
    if (filters.mealType) {
      const mealType = mealTypes.find(m => m.id === filters.mealType);
      activeFilters.push({ 
        label: mealType ? `${mealType.icon} ${mealType.name}` : filters.mealType, 
        key: 'mealType' 
      });
    }
    if (filters.dietType) {
      const dietType = dietTypes.find(d => d.id === filters.dietType);
      activeFilters.push({ 
        label: dietType ? `${dietType.icon} ${dietType.name}` : filters.dietType, 
        key: 'dietType' 
      });
    }
    if (filters.difficulty) {
      const difficulty = difficulties.find(d => d.id === filters.difficulty);
      activeFilters.push({ 
        label: difficulty?.name || filters.difficulty, 
        key: 'difficulty' 
      });
    }
    if (filters.maxTime) {
      const timeOpt = FILTER_CONFIG.cookingTime.options.find(t => t.id === filters.maxTime);
      activeFilters.push({ 
        label: timeOpt?.name || filters.maxTime, 
        key: 'maxTime' 
      });
    }
    if (filters.minRating) {
      const ratingOpt = FILTER_CONFIG.rating.options.find(r => r.value == filters.minRating);
      activeFilters.push({ 
        label: ratingOpt?.name || `${filters.minRating}+ Stars`, 
        key: 'minRating' 
      });
    }

    return activeFilters;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filter recipes">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-charcoal-950 rounded-t-3xl shadow-xl animate-slide-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-warm-200 dark:border-charcoal-800 flex-shrink-0">
          <h2 className="text-lg font-semibold text-charcoal-900 dark:text-warm-100">Filters</h2>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClearFilters}
                className="px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-charcoal-500 hover:bg-warm-100 dark:text-charcoal-400 dark:hover:bg-charcoal-800 transition-colors"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="px-4 py-3 border-b border-warm-200 dark:border-charcoal-800 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-charcoal-700 dark:text-warm-200">Active filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {renderActiveFilters().map(({ label, key }) => (
                <CategoryChip
                  key={key}
                  label={label}
                  selected
                  onClick={() => onFilterChange(
                    FILTER_CONFIG[key]?.key || key, 
                    FILTER_CONFIG[key]?.type === 'radio' ? '' : ''
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {renderSelectFilter('cuisine', cuisines, 'All Cuisines')}
          {renderSelectFilter('category', categories, 'All Categories')}
          {renderSelectFilter('mealType', mealTypes, 'All Meal Types')}
          {renderSelectFilter('diet', dietTypes, 'All Diets')}
          {renderSelectFilter('difficulty', difficulties, 'Any Difficulty')}

          <div>
            <label className="label">{FILTER_CONFIG.cookingTime.label}</label>
            <div className="flex flex-col gap-2">
              {FILTER_CONFIG.cookingTime.options.map(time => (
                <label key={time.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="cookingTime"
                    value={time.id}
                    checked={filters.maxTime === time.id}
                    onChange={(e) => handleCookingTimeChange(e.target.value)}
                    className="w-4 h-4 text-primary-600 border-warm-300 focus:ring-primary-500"
                  />
                  <span className="text-base text-charcoal-700 dark:text-warm-200">{time.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="rating-filter-mobile">{FILTER_CONFIG.rating.label}</label>
            <select
              id="rating-filter-mobile"
              value={filters.minRating}
              onChange={(e) => onFilterChange('minRating', e.target.value)}
              className="input text-base py-3"
            >
              {FILTER_CONFIG.rating.options.map(opt => (
                <option key={opt.id} value={opt.value ?? ''}>{opt.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="sort-filter-mobile">Sort By</label>
            <select
              id="sort-filter-mobile"
              value={filters.sort}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="input text-base py-3"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-warm-200 dark:border-charcoal-800 flex-shrink-0 safe-area-bottom">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-6 rounded-2xl bg-primary-600 text-white font-semibold text-base hover:bg-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-charcoal-950"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}