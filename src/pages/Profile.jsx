import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Heart, Clock, Settings, Bell, 
  Shield, Moon, Palette, Utensils, Flame, 
  Globe, ChevronRight, Edit, Camera, Music, 
  Flame as FlameIcon, Globe as GlobeIcon,
  Zap, Leaf, WheatOff, Brain, ChefHat,
  RotateCcw, AlertTriangle
} from 'lucide-react';
import { recipeService } from '../services/recipeService';
import { categoryService } from '../services/categoryService';
import { preferenceService } from '../services/preferenceService';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import Button from '../components/Button';
import CategoryChip from '../components/CategoryChip';
import EmptyState from '../components/EmptyState';
import { ingredients } from '../data/ingredients';

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🌱' },
  { id: 'vegan', label: 'Vegan', icon: '🌿' },
  { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
  { id: 'dairy-free', label: 'Dairy Free', icon: '🥛' },
  { id: 'keto', label: 'Keto', icon: '🥑' },
  { id: 'halal', label: 'Halal', icon: '☪️' },
];

const spiceLevels = [
  { id: 'mild', label: 'Mild', icon: '🌶️' },
  { id: 'medium', label: 'Medium', icon: '🌶️🌶️' },
  { id: 'hot', label: 'Hot', icon: '🌶️🌶️🌶️' },
  { id: 'extra-hot', label: 'Extra Hot', icon: '🌶️🌶️🌶️🌶️' },
];

const skillLevels = [
  { id: 'beginner', label: 'Beginner', description: 'Simple recipes, minimal techniques', icon: '🌱' },
  { id: 'intermediate', label: 'Intermediate', description: 'Comfortable with most techniques', icon: '👨‍🍳' },
  { id: 'advanced', label: 'Advanced', description: 'Complex recipes, advanced skills', icon: '🏆' },
];

const musicMoods = [
  { id: 'chill', label: 'Chill', icon: '😌' },
  { id: 'energetic', label: 'Energetic', icon: '🔥' },
  { id: 'lofi', label: 'Lo-fi', icon: '🌙' },
  { id: 'romantic', label: 'Romantic', icon: '❤️' },
  { id: 'bollywood', label: 'Bollywood', icon: '🇮🇳' },
  { id: 'rock', label: 'Rock', icon: '🎸' },
  { id: 'jazz', label: 'Jazz', icon: '🎷' },
  { id: 'classical', label: 'Classical', icon: '🎼' },
];

const musicPlatforms = [
  { id: 'spotify', label: 'Spotify', icon: '🎵' },
  { id: 'youtube', label: 'YouTube Music', icon: '▶️' },
];

const mockUser = {
  name: 'Alex Chen',
  email: 'alex@cookflow.app',
  avatar: null,
  joinedDate: 'January 2024',
  stats: {
    recipesCooked: 47,
    favorites: 23,
    hoursCooked: 156,
  },
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [cuisinesLoading, setCuisinesLoading] = useState(true);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const prefs = preferenceService.getPreferences();
    setPreferences(prefs);
    setIngredientsList(ingredients);
  }, []);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const data = await categoryService.getCuisines();
        setCuisines(data);
      } catch (err) {
        console.error('Failed to load cuisines:', err);
      } finally {
        setCuisinesLoading(false);
      }
    };
    fetchCuisines();
  }, []);

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab]);

  const fetchFavorites = async () => {
    setFavoritesLoading(true);
    setFavoritesError(null);
    try {
      const data = await recipeService.getPopularRecipes(12);
      setFavoriteRecipes(data);
    } catch (err) {
      setFavoritesError(err.message);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const updatePreferences = (updates) => {
    const newPrefs = preferenceService.updatePreferences(updates);
    setPreferences(newPrefs);
  };

  const handleDietaryToggle = (id) => {
    if (!preferences) return;
    const current = preferences.dietaryPreferences || [];
    const updated = current.includes(id) 
      ? current.filter(d => d !== id)
      : [...current, id];
    updatePreferences({ dietaryPreferences: updated });
  };

  const handleSpiceSelect = (id) => {
    updatePreferences({ spiceLevel: id });
  };

  const handleSkillSelect = (id) => {
    updatePreferences({ cookingSkill: id });
  };

  const handleCuisineToggle = (id) => {
    if (!preferences) return;
    const current = preferences.favoriteCuisines || [];
    const updated = current.includes(id) 
      ? current.filter(c => c !== id)
      : [...current, id];
    updatePreferences({ favoriteCuisines: updated });
  };

  const handleIngredientToggle = (type, id) => {
    if (!preferences) return;
    const current = preferences[type] || [];
    const updated = current.includes(id) 
      ? current.filter(i => i !== id)
      : [...current, id];
    updatePreferences({ [type]: updated });
  };

  const handleMusicMoodSelect = (id) => {
    updatePreferences({ musicPreferences: { ...preferences.musicPreferences, mood: id } });
  };

  const handleMusicPlatformSelect = (id) => {
    updatePreferences({ musicPreferences: { ...preferences.musicPreferences, platform: id } });
  };

  const handleResetPreferences = () => {
    preferenceService.resetPreferences();
    const newPrefs = preferenceService.getPreferences();
    setPreferences(newPrefs);
    setShowResetConfirm(false);
  };

  if (!preferences) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950">
        <div className="text-center text-white">
          <div className="h-12 w-12 animate-spin mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full" />
          <p>Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in min-h-[calc(100vh-200px)]">
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <header className="card p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-4xl">
                  {mockUser.avatar ? (
                    <img src={mockUser.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <span>👨‍🍳</span>
                  )}
                </div>
                {editMode && (
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-charcoal-800 shadow-lg">
                    <Camera className="h-5 w-5 text-charcoal-600 dark:text-warm-300" />
                  </button>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-warm-100">{mockUser.name}</h1>
                <p className="text-charcoal-500 dark:text-charcoal-400 mt-1">{mockUser.email}</p>
                <p className="text-sm text-charcoal-400 dark:text-charcoal-500 mt-2">Member since {mockUser.joinedDate}</p>
              </div>
              <Button variant="outline" leftIcon={<Edit className="h-4 w-4" />} onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Done' : 'Edit Profile'}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-warm-200 dark:border-charcoal-800">
              <div className="text-center">
                <p className="text-2xl font-bold text-charcoal-900 dark:text-warm-100">{mockUser.stats.recipesCooked}</p>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Recipes Cooked</p>
              </div>
              <div className="text-center border-x border-warm-200 dark:border-charcoal-800">
                <p className="text-2xl font-bold text-charcoal-900 dark:text-warm-100">{mockUser.stats.favorites}</p>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Favorites</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-charcoal-900 dark:text-warm-100">{mockUser.stats.hoursCooked}h</p>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400">Hours Cooked</p>
              </div>
            </div>
          </header>

          <nav className="flex gap-2 mb-8 overflow-x-auto pb-2" role="tablist" aria-label="Profile sections">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'favorites', label: 'Favorites', icon: Heart },
              { id: 'history', label: 'Cooking History', icon: Clock },
              { id: 'preferences', label: 'Cooking Preferences', icon: Settings },
              { id: 'music', label: 'Music', icon: Music },
            ].map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary-600" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Link to="/import">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">📹</span>
                      <span>Import Recipe</span>
                    </Button>
                  </Link>
                  <Link to="/kitchen">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">🥘</span>
                      <span>My Kitchen</span>
                    </Button>
                  </Link>
                  <Link to="/explore">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">🔍</span>
                      <span>Explore</span>
                    </Button>
                  </Link>
                  <Link to="/explore?favorites=true">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">❤️</span>
                      <span>Saved Recipes</span>
                    </Button>
                  </Link>
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary-600" />
                  Account Settings
                </h2>
                <div className="space-y-3">
                  {[
                    { icon: Bell, label: 'Notifications', desc: 'Manage email and push notifications' },
                    { icon: Shield, label: 'Privacy & Security', desc: 'Password, two-factor authentication' },
                    { icon: Palette, label: 'Appearance', desc: 'Theme, font size, language' },
                    { icon: Globe, label: 'Units & Region', desc: 'Metric/Imperial, timezone' },
                  ].map(item => (
                    <Link key={item.label} to="#" className="flex items-center gap-4 p-3 rounded-xl hover:bg-warm-50 dark:hover:bg-charcoal-800 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-charcoal-900 dark:text-warm-100">{item.label}</p>
                        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-charcoal-400" />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100">Favorite Recipes</h2>
                <span className="text-sm text-charcoal-500 dark:text-charcoal-400">{favoriteRecipes.length} recipes</span>
              </div>
              {favoritesError ? (
                <div className="card p-8 text-center" role="alert">
                  <p className="text-charcoal-500 dark:text-charcoal-400 mb-4">Unable to load favorites</p>
                  <Button variant="outline" onClick={fetchFavorites}>
                    Try Again
                  </Button>
                </div>
              ) : favoritesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading favorites">
                  {[...Array(6)].map((_, i) => <RecipeCardSkeleton key={i} />)}
                </div>
              ) : favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteRecipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <EmptyState type="favorites" onActionClick={() => setActiveTab('explore')} />
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100">Recently Cooked</h2>
                <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Last 30 days</span>
              </div>
              <EmptyState type="history" onActionClick={() => setActiveTab('explore')} />
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <FlameIcon className="h-5 w-5 text-primary-600" />
                  Dietary Preferences
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  Select all that apply. We'll use this to filter recipes and suggest substitutions.
                </p>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map(opt => (
                    <CategoryChip
                      key={opt.id}
                      label={opt.label}
                      icon={opt.icon}
                      selected={preferences.dietaryPreferences?.includes(opt.id) || false}
                      onClick={() => handleDietaryToggle(opt.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <FlameIcon className="h-5 w-5 text-primary-600" />
                  Spice Level
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  How spicy do you like your food?
                </p>
                <div className="flex flex-wrap gap-2">
                  {spiceLevels.map(level => (
                    <CategoryChip
                      key={level.id}
                      label={level.label}
                      icon={level.icon}
                      selected={preferences.spiceLevel === level.id}
                      onClick={() => handleSpiceSelect(level.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary-600" />
                  Cooking Skill
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  Your skill level helps us recommend appropriate recipes.
                </p>
                <div className="flex flex-wrap gap-2">
                  {skillLevels.map(level => (
                    <CategoryChip
                      key={level.id}
                      label={level.label}
                      icon={level.icon}
                      selected={preferences.cookingSkill === level.id}
                      onClick={() => handleSkillSelect(level.id)}
                      className="max-w-xs"
                    />
                  ))}
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <GlobeIcon className="h-5 w-5 text-primary-600" />
                  Favorite Cuisines
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  We'll prioritize these cuisines in your recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  {cuisinesLoading ? (
                    [...Array(8)].map((_, i) => (
                      <CategoryChip key={i} label="Loading..." disabled />
                    ))
                  ) : (
                    cuisines.map(cuisine => (
                      <CategoryChip
                        key={cuisine.id}
                        label={cuisine.name}
                        icon={cuisine.icon}
                        selected={preferences.favoriteCuisines?.includes(cuisine.id) || false}
                        onClick={() => handleCuisineToggle(cuisine.id)}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary-600" />
                  Favorite Ingredients
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  Ingredients you love. We'll boost recipes containing these.
                </p>
                <div className="flex flex-wrap gap-2">
                  {ingredientsList.slice(0, 30).map(ing => (
                    <CategoryChip
                      key={ing.id}
                      label={ing.name}
                      icon={ing.icon}
                      selected={preferences.favoriteIngredients?.includes(ing.id) || false}
                      onClick={() => handleIngredientToggle('favoriteIngredients', ing.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="card p-6 bg-red-50/50 dark:bg-red-900/10 border-red-200/50 dark:border-red-800/50">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Disliked Ingredients
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  Ingredients you don't want in your recommendations. We'll reduce recipes containing these.
                </p>
                <div className="flex flex-wrap gap-2">
                  {ingredientsList.slice(0, 30).map(ing => (
                    <CategoryChip
                      key={ing.id}
                      label={ing.name}
                      icon={ing.icon}
                      selected={preferences.dislikedIngredients?.includes(ing.id) || false}
                      onClick={() => handleIngredientToggle('dislikedIngredients', ing.id)}
                      variant="outline"
                    />
                  ))}
                </div>
              </section>

              <section className="card p-6 bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/50">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-amber-600" />
                  Reset Preferences
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  This will clear all your cooking preferences, dietary settings, favorite ingredients, and music preferences.
                </p>
                <Button 
                  variant="outline" 
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                  onClick={() => setShowResetConfirm(true)}
                >
                  Reset All Preferences
                </Button>
              </section>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="space-y-6">
              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary-600" />
                  Cooking Music Preferences
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  Choose your preferred music mood and platform for cooking sessions.
                </p>

                <div className="mb-6">
                  <h3 className="font-medium text-charcoal-900 dark:text-warm-100 mb-3">Preferred Mood</h3>
                  <div className="flex flex-wrap gap-2">
                    {musicMoods.map(mood => (
                      <CategoryChip
                        key={mood.id}
                        label={mood.label}
                        icon={mood.icon}
                        selected={preferences.musicPreferences?.mood === mood.id}
                        onClick={() => handleMusicMoodSelect(mood.id)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-charcoal-900 dark:text-warm-100 mb-3">Preferred Platform</h3>
                  <div className="flex flex-wrap gap-2">
                    {musicPlatforms.map(platform => (
                      <CategoryChip
                        key={platform.id}
                        label={platform.label}
                        icon={platform.icon}
                        selected={preferences.musicPreferences?.platform === platform.id}
                        onClick={() => handleMusicPlatformSelect(platform.id)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {showResetConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="card bg-charcoal-900 border-charcoal-800 w-full max-w-md p-6 animate-slide-up">
                <h2 className="text-xl font-bold text-white mb-2">Reset All Preferences?</h2>
                <p className="text-charcoal-400 mb-6">
                  This will clear all your cooking preferences, dietary settings, favorite ingredients, disliked ingredients, 
                  music preferences, and recipe feedback. This action cannot be undone.
                </p>
                <div className="flex flex-col gap-3">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleResetPreferences}
                    className="w-full"
                  >
                    Yes, Reset Everything
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}