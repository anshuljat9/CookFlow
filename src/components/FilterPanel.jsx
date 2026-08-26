import { X, ChevronDown } from 'lucide-react';
import CategoryChip from './CategoryChip';
import { FILTER_CONFIG, SORT_OPTIONS } from '../utils/filterConfig';

export default function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  cuisines = [],
  categories = [],
  mealTypes = [],
  dietTypes = [],
  difficulties = [],
  activeFilterCount,
  className = '',
}) {
  const handleCookingTimeChange = (value) => {
    onFilterChange('maxTime', value === filters.maxTime ? '' : value);
  };

  const renderSelectFilter = (filterKey, options, placeholder) => {
    const config = FILTER_CONFIG[filterKey];
    const value = filters[config.key];
    
    return (
      <div>
        <label className="label" htmlFor={`${filterKey}-filter`}>{config.label}</label>
        <select
          id={`${filterKey}-filter`}
          value={value}
          onChange={(e) => onFilterChange(config.key, e.target.value)}
          className="input text-sm py-2"
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

  return (
    <div className={`card p-4 lg:p-5 ${className}`} aria-label="Recipe filters">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-charcoal-900 dark:text-warm-100">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
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
                <span className="text-sm text-charcoal-700 dark:text-warm-200">{time.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="rating-filter">{FILTER_CONFIG.rating.label}</label>
          <select
            id="rating-filter"
            value={filters.minRating}
            onChange={(e) => onFilterChange('minRating', e.target.value)}
            className="input text-sm py-2"
          >
            {FILTER_CONFIG.rating.options.map(opt => (
              <option key={opt.id} value={opt.value ?? ''}>{opt.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="sort-filter">Sort By</label>
          <select
            id="sort-filter"
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="input text-sm py-2"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}