const PREFERENCES_KEY = 'cookflow_user_preferences';

const DEFAULT_PREFERENCES = {
  favoriteCuisines: [],
  dietaryPreferences: [],
  spiceLevel: 'medium',
  cookingSkill: 'beginner',
  favoriteIngredients: [],
  dislikedIngredients: [],
  preferredMusicMood: 'chill',
  preferredMusicPlatform: 'spotify',
  recentlyViewedRecipes: [],
  recipeFeedback: {},
  musicPreferences: {
    mood: 'chill',
    platform: 'spotify',
  },
};

export const preferenceService = {
  getPreferences() {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
      return { ...DEFAULT_PREFERENCES };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  },

  savePreferences(preferences) {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Failed to save preferences:', error);
      return null;
    }
  },

  updatePreferences(updates) {
    return this.savePreferences(updates);
  },

  resetPreferences() {
    try {
      localStorage.removeItem(PREFERENCES_KEY);
      return { ...DEFAULT_PREFERENCES };
    } catch {
      return { ...DEFAULT_PREFERENCES };
    }
  },

  addFavoriteCuisine(cuisineId) {
    const prefs = this.getPreferences();
    if (!prefs.favoriteCuisines.includes(cuisineId)) {
      prefs.favoriteCuisines.push(cuisineId);
      this.savePreferences(prefs);
    }
    return prefs;
  },

  removeFavoriteCuisine(cuisineId) {
    const prefs = this.getPreferences();
    prefs.favoriteCuisines = prefs.favoriteCuisines.filter(c => c !== cuisineId);
    this.savePreferences(prefs);
    return prefs;
  },

  setDietaryPreferences(dietaryIds) {
    const prefs = this.getPreferences();
    prefs.dietaryPreferences = dietaryIds;
    this.savePreferences(prefs);
    return prefs;
  },

  setSpiceLevel(level) {
    const prefs = this.getPreferences();
    prefs.spiceLevel = level;
    this.savePreferences(prefs);
    return prefs;
  },

  setCookingSkill(skill) {
    const prefs = this.getPreferences();
    prefs.cookingSkill = skill;
    this.savePreferences(prefs);
    return prefs;
  },

  addFavoriteIngredient(ingredientId) {
    const prefs = this.getPreferences();
    if (!prefs.favoriteIngredients.includes(ingredientId)) {
      prefs.favoriteIngredients.push(ingredientId);
      this.savePreferences(prefs);
    }
    return prefs;
  },

  removeFavoriteIngredient(ingredientId) {
    const prefs = this.getPreferences();
    prefs.favoriteIngredients = prefs.favoriteIngredients.filter(i => i !== ingredientId);
    this.savePreferences(prefs);
    return prefs;
  },

  addDislikedIngredient(ingredientId) {
    const prefs = this.getPreferences();
    if (!prefs.dislikedIngredients.includes(ingredientId)) {
      prefs.dislikedIngredients.push(ingredientId);
      this.savePreferences(prefs);
    }
    return prefs;
  },

  removeDislikedIngredient(ingredientId) {
    const prefs = this.getPreferences();
    prefs.dislikedIngredients = prefs.dislikedIngredients.filter(i => i !== ingredientId);
    this.savePreferences(prefs);
    return prefs;
  },

  setMusicMood(mood) {
    const prefs = this.getPreferences();
    prefs.musicPreferences.mood = mood;
    this.savePreferences(prefs);
    return prefs;
  },

  setMusicPlatform(platform) {
    const prefs = this.getPreferences();
    prefs.musicPreferences.platform = platform;
    this.savePreferences(prefs);
    return prefs;
  },

  addRecentlyViewed(recipeId) {
    const prefs = this.getPreferences();
    prefs.recentlyViewedRecipes = [recipeId, ...prefs.recentlyViewedRecipes.filter(id => id !== recipeId)].slice(0, 20);
    this.savePreferences(prefs);
    return prefs;
  },

  getRecentlyViewed(limit = 10) {
    const prefs = this.getPreferences();
    return prefs.recentlyViewedRecipes.slice(0, limit);
  },

  setRecipeFeedback(recipeId, feedback) {
    const prefs = this.getPreferences();
    prefs.recipeFeedback[recipeId] = {
      ...prefs.recipeFeedback[recipeId],
      ...feedback,
      timestamp: Date.now(),
    };
    this.savePreferences(prefs);
    return prefs;
  },

  getRecipeFeedback(recipeId) {
    const prefs = this.getPreferences();
    return prefs.recipeFeedback[recipeId] || null;
  },
};

export default preferenceService;