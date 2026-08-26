export const FILTER_CONFIG = {
  cuisine: {
    label: 'Cuisine',
    key: 'cuisine',
    placeholder: 'All Cuisines',
    fetchKey: 'cuisines',
  },
  category: {
    label: 'Category',
    key: 'category',
    placeholder: 'All Categories',
    fetchKey: 'categories',
  },
  mealType: {
    label: 'Meal Type',
    key: 'mealType',
    placeholder: 'All Meal Types',
    fetchKey: 'mealTypes',
  },
  diet: {
    label: 'Diet',
    key: 'dietType',
    placeholder: 'All Diets',
    fetchKey: 'dietTypes',
  },
  difficulty: {
    label: 'Difficulty',
    key: 'difficulty',
    placeholder: 'Any Difficulty',
    fetchKey: 'difficulties',
  },
  cookingTime: {
    label: 'Cooking Time',
    key: 'maxTime',
    type: 'radio',
    options: [
      { id: 'under-15', name: 'Under 15 min', value: 15 },
      { id: '15-30', name: '15-30 min', value: 30 },
      { id: '30-60', name: '30-60 min', value: 60 },
      { id: 'over-60', name: 'Over 60 min', value: 120 },
    ],
  },
  rating: {
    label: 'Minimum Rating',
    key: 'minRating',
    type: 'select',
    options: [
      { id: '', name: 'Any Rating', value: null },
      { id: '4', name: '4.0+ Stars', value: 4.0 },
      { id: '4.5', name: '4.5+ Stars', value: 4.5 },
    ],
  },
};

export const SORT_OPTIONS = [
  { id: 'relevance', name: 'Most Relevant' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'time-asc', name: 'Quickest First' },
  { id: 'time-desc', name: 'Longest First' },
  { id: 'newest', name: 'Newest' },
];

export const DEFAULT_FILTERS = {
  search: '',
  cuisine: '',
  category: '',
  mealType: '',
  dietType: '',
  difficulty: '',
  maxTime: '',
  minRating: '',
  sort: 'relevance',
  page: 1,
};

export const FILTER_KEYS = Object.keys(DEFAULT_FILTERS);

export function getActiveFilterCount(filters) {
  let count = 0;
  if (filters.cuisine) count++;
  if (filters.category) count++;
  if (filters.mealType) count++;
  if (filters.dietType) count++;
  if (filters.difficulty) count++;
  if (filters.maxTime) count++;
  if (filters.minRating) count++;
  return count;
}

export function filtersToSearchParams(filters) {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== DEFAULT_FILTERS[key]) {
      params.set(key, value);
    }
  });
  
  return params.toString();
}

export function searchParamsToFilters(searchParams) {
  const filters = { ...DEFAULT_FILTERS };
  
  FILTER_KEYS.forEach(key => {
    const value = searchParams.get(key);
    if (value !== null) {
      filters[key] = value;
    }
  });
  
  return filters;
}