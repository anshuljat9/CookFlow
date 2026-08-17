import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Heart, Clock, Settings, Bell, 
  Shield, Moon, Palette, Utensils, Flame, 
  Globe, ChevronRight, Edit, Camera
} from 'lucide-react';
import { getFavoriteRecipes, getRecipeById } from '../data/recipes';
import RecipeCard from '../components/RecipeCard';
import Button from '../components/Button';
import CategoryChip from '../components/CategoryChip';
import EmptyState from '../components/EmptyState';

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
  preferences: {
    dietary: ['vegetarian', 'gluten-free'],
    spiceLevel: 'medium',
    favoriteCuisines: ['italian', 'korean', 'mexican', 'indian'],
    allergies: ['nuts', 'shellfish'],
  },
};

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

const cuisinesList = [
  { id: 'italian', name: 'Italian', icon: '🍝' },
  { id: 'korean', name: 'Korean', icon: '🥘' },
  { id: 'mexican', name: 'Mexican', icon: '🌮' },
  { id: 'indian', name: 'Indian', icon: '🍛' },
  { id: 'chinese', name: 'Chinese', icon: '🥢' },
  { id: 'japanese', name: 'Japanese', icon: '🍣' },
  { id: 'thai', name: 'Thai', icon: '🌰' },
  { id: 'mediterranean', name: 'Mediterranean', icon: '🫒' },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const favoriteRecipes = getFavoriteRecipes();

  const handleDietaryToggle = (id) => {
    setMockUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        dietary: prev.preferences.dietary.includes(id)
          ? prev.preferences.dietary.filter(d => d !== id)
          : [...prev.preferences.dietary, id]
      }
    }));
  };

  const handleSpiceSelect = (id) => {
    setMockUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, spiceLevel: id }
    }));
  };

  const handleCuisineToggle = (id) => {
    setMockUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        favoriteCuisines: prev.preferences.favoriteCuisines.includes(id)
          ? prev.preferences.favoriteCuisines.filter(c => c !== id)
          : [...prev.preferences.favoriteCuisines, id]
      }
    }));
  };

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
              { id: 'preferences', label: 'Preferences', icon: Settings },
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
              {favoriteRecipes.length > 0 ? (
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
                  <Flame className="h-5 w-5 text-primary-600" />
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
                      selected={mockUser.preferences.dietary.includes(opt.id)}
                      onClick={() => handleDietaryToggle(opt.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary-600" />
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
                      selected={mockUser.preferences.spiceLevel === level.id}
                      onClick={() => handleSpiceSelect(level.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="card p-6">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary-600" />
                  Favorite Cuisines
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  We'll prioritize these cuisines in your recommendations.
                </p>
                <div className="flex flex-wrap gap-2">
                  {cuisinesList.map(cuisine => (
                    <CategoryChip
                      key={cuisine.id}
                      label={cuisine.name}
                      icon={cuisine.icon}
                      selected={mockUser.preferences.favoriteCuisines.includes(cuisine.id)}
                      onClick={() => handleCuisineToggle(cuisine.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="card p-6 bg-red-50/50 dark:bg-red-900/10 border-red-200/50 dark:border-red-800/50">
                <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Allergies & Intolerances
                </h2>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                  We'll flag recipes containing these ingredients and suggest alternatives.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['nuts', 'shellfish', 'dairy', 'gluten', 'soy', 'eggs'].map(allergy => (
                    <CategoryChip
                      key={allergy}
                      label={allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                      selected={mockUser.preferences.allergies.includes(allergy)}
                      onClick={() => {
                        setMockUser(prev => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            allergies: prev.preferences.allergies.includes(allergy)
                              ? prev.preferences.allergies.filter(a => a !== allergy)
                              : [...prev.preferences.allergies, allergy]
                          }
                        }));
                      }}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to simulate state updates
function setMockUser(updater) {
  console.log('Profile update:', updater);
}