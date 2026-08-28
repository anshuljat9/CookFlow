import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat, Zap, Search, Truck, Heart, Sparkles, Clock, Loader2, Utensils, MapPin, Zap as ZapIcon, Leaf, RotateCcw, Music, Brain, Flame, Truck as TruckIcon, Clock as ClockIcon, Heart as HeartIcon, Sparkles as SparklesIcon } from 'lucide-react';
import { usePopularRecipes, useQuickRecipes, useTrendingRecipes } from '../hooks/useRecipes';
import { categoryService } from '../services/categoryService';
import { recommendationService } from '../services/recommendationService';
import { preferenceService } from '../services/preferenceService';
import { cookingSessionService } from '../services/cookingSessionService';
import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import LoadingState from '../components/LoadingState';
import CuisineCard from '../components/CuisineCard';
import CategoryCard from '../components/CategoryCard';
import EmptyState from '../components/EmptyState';

const howItWorks = [
  {
    step: '01',
    icon: Search,
    title: 'Discover',
    description: 'Find recipes from videos, search by ingredients, or browse curated collections.'
  },
  {
    step: '02',
    icon: Sparkles,
    title: 'Adapt',
    description: 'Get smart substitutions, scale servings, and customize to your dietary needs.'
  },
  {
    step: '03',
    icon: ChefHat,
    title: 'Cook',
    description: 'Follow step-by-step cooking mode with timers, voice control, and music.'
  }
];

const features = [
  { icon: Zap, title: 'Quick Recipes', description: 'Meals ready in under 30 minutes' },
  { icon: Heart, title: 'Personalized', description: 'Recipes tailored to your pantry' },
  { icon: Truck, title: 'Smart Shopping', description: 'Generate grocery lists instantly' },
  { icon: Clock, title: 'Cooking Mode', description: 'Hands-free step-by-step guidance' },
];

const mealCategories = [
  { id: 'breakfast', name: 'Breakfast', icon: '🥞' },
  { id: 'lunch', name: 'Lunch', icon: '🍱' },
  { id: 'dinner', name: 'Dinner', icon: '🍽️' },
  { id: 'snacks', name: 'Snacks', icon: '🥜' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
];

const quickTimeOptions = [
  { id: 'under-15', label: 'Under 15 min', maxTime: 15, icon: '⚡' },
  { id: '15-30', label: '15-30 min', maxTime: 30, icon: '🕐' },
  { id: '30-60', label: '30-60 min', maxTime: 60, icon: '🕑' },
];

export default function Home() {
  const [cuisines, setCuisines] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const { recipes: popularRecipes, loading: popularLoading, error: popularError } = usePopularRecipes(8);
  const { recipes: quickRecipes, loading: quickLoading, error: quickError } = useQuickRecipes(8, 30);
  const { recipes: trendingRecipes, loading: trendingLoading, error: trendingError } = useTrendingRecipes(8);
  
  const [personalizedRecipes, setPersonalizedRecipes] = useState([]);
  const [personalizedLoading, setPersonalizedLoading] = useState(true);
  const [personalizedError, setPersonalizedError] = useState(null);
  const [personalizedReason, setPersonalizedReason] = useState('');
  
  const [cookAgainRecipes, setCookAgainRecipes] = useState([]);
  const [cookAgainLoading, setCookAgainLoading] = useState(true);
  const [cookAgainError, setCookAgainError] = useState(null);
  
  const [recentlyViewedRecipes, setRecentlyViewedRecipes] = useState([]);
  const [recentlyViewedLoading, setRecentlyViewedLoading] = useState(true);
  const [recentlyViewedError, setRecentlyViewedError] = useState(null);
  
  const [showPersonalized, setShowPersonalized] = useState(false);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [cuisinesData, mealTypesData] = await Promise.all([
          categoryService.getCuisines(),
          categoryService.getMealTypes(),
        ]);
        setCuisines(cuisinesData);
        setMealTypes(mealTypesData);
      } catch (err) {
        console.error('Failed to load reference data:', err);
      }
    };
    fetchReferenceData();
  }, []);

  useEffect(() => {
    const loadPersonalized = async () => {
      setPersonalizedLoading(true);
      setPersonalizedError(null);
      try {
        const result = await recommendationService.getPersonalizedRecipes({ limit: 8 });
        setPersonalizedRecipes(result.recipes);
        setPersonalizedReason(result.reason);
      } catch (err) {
        setPersonalizedError(err.message);
      } finally {
        setPersonalizedLoading(false);
      }
    };
    loadPersonalized();
  }, []);

  useEffect(() => {
    const loadCookAgain = async () => {
      setCookAgainLoading(true);
      setCookAgainError(null);
      try {
        const result = await recommendationService.getCookAgainRecipes(8);
        setCookAgainRecipes(result.recipes);
      } catch (err) {
        setCookAgainError(err.message);
      } finally {
        setCookAgainLoading(false);
      }
    };
    loadCookAgain();
  }, []);

  useEffect(() => {
    const loadRecentlyViewed = async () => {
      setRecentlyViewedLoading(true);
      setRecentlyViewedError(null);
      try {
        const result = await recommendationService.getRecentlyViewedRecipes(8);
        setRecentlyViewedRecipes(result.recipes);
      } catch (err) {
        setRecentlyViewedError(err.message);
      } finally {
        setRecentlyViewedLoading(false);
      }
    };
    loadRecentlyViewed();
  }, []);

  const renderSection = (title, recipes, loading, error, linkText, linkPath, icon, reason = null, showReason = false) => (
    <section className="py-12 sm:py-16" aria-labelledby={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 id={title.toLowerCase().replace(/\s+/g, '-')} className="section-title">{title}</h2>
            <p className="section-subtitle">{reason || 'Curated just for you'}</p>
          </div>
          <Link to={linkPath} className="hidden sm:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
            {linkText}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {error ? (
          <div className="card p-8 text-center" role="alert">
            <p className="text-charcoal-500 dark:text-charcoal-400 mb-4">Unable to load {title.toLowerCase()}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true" aria-label={`Loading ${title}`}>
            {[...Array(4)].map((_, i) => <RecipeCardSkeleton key={i} />)}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} showReason={showReason && recipe.recommendationReason} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-charcoal-500 dark:text-charcoal-400">No recipes found</p>
          </div>
        )}
        <Link to={linkPath} className="sm:hidden mt-6 inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
          {linkText}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );

  const renderQuickSection = (title, recipes, loading, error, linkText, linkPath, icon) => (
    <section className="py-12 sm:py-16" aria-labelledby={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 id={title.toLowerCase().replace(/\s+/g, '-')} className="section-title">{title}</h2>
            <p className="section-subtitle">Ready when you are</p>
          </div>
          <Link to={linkPath} className="hidden sm:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
            {linkText}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {error ? (
          <div className="card p-8 text-center" role="alert">
            <p className="text-charcoal-500 dark:text-charcoal-400 mb-4">Unable to load {title.toLowerCase()}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true" aria-label={`Loading ${title}`}>
            {[...Array(4)].map((_, i) => <RecipeCardSkeleton key={i} />)}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-charcoal-500 dark:text-charcoal-400">No recipes found</p>
          </div>
        )}
        <Link to={linkPath} className="sm:hidden mt-6 inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
          {linkText}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );

  const hasPreferences = () => {
    const prefs = preferenceService.getPreferences();
    return prefs.favoriteCuisines?.length > 0 || 
           prefs.dietaryPreferences?.length > 0 || 
           prefs.favoriteIngredients?.length > 0 ||
           prefs.cookingSkill !== 'beginner';
  };

  return (
    <div className="animate-fade-in">
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-warm-50 to-transparent dark:from-charcoal-950 dark:to-transparent overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23dcc9a3%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="container-custom relative z-10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 animate-slide-up">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>New: Import recipes from videos with AI</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal-900 dark:text-warm-100 leading-tight mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              From Scroll{' '}
              <span className="text-primary-600 dark:text-primary-400">to Plate.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-charcoal-600 dark:text-charcoal-300 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
              Turn food inspiration into recipes you can actually cook. Discover, adapt, and cook with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link to="/import">
                <Button size="lg" leftIcon={<Sparkles className="h-5 w-5" />} className="w-full sm:w-auto">
                  Import a Recipe
                </Button>
              </Link>
              <Link to="/kitchen">
                <Button variant="outline" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />} className="w-full sm:w-auto">
                  What's in My Kitchen?
                </Button>
              </Link>
            </div>

            <div className="relative max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '400ms' }}>
              <SearchBar 
                placeholder="What are you craving? (e.g., chicken tikka, pasta carbonara...)"
                onSubmit={(q) => q && console.log('Search:', q)}
                onChange={() => {}}
                defaultValue=""
                className="w-full"
                showSuggestions={true}
              />
              <p className="mt-3 text-sm text-charcoal-500 dark:text-charcoal-400">
                Search recipes by ingredient, cuisine, or dish name
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-warm-50 dark:from-charcoal-950 to-transparent pointer-events-none" />
      </section>

      <section className="py-12 sm:py-16 bg-white dark:bg-charcoal-900" aria-labelledby="features-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="section-title">Why CookFlow?</h2>
            <p className="section-subtitle">Built for the way you actually cook</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="card p-6 text-center group hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 dark:group-hover:bg-primary-600 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal-900 dark:text-warm-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {hasPreferences() && !showPersonalized && (
        <section className="py-12 sm:py-16 bg-primary-50 dark:bg-primary-900/20" aria-labelledby="personalized-cta-heading">
          <div className="container-custom">
            <div className="card p-6 sm:p-8 max-w-3xl mx-auto text-center bg-primary-600 dark:bg-primary-700 border-0">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h2 id="personalized-cta-heading" className="text-2xl font-bold text-white mb-3">Get Personalized Recommendations</h2>
              <p className="text-primary-100 mb-6 max-w-lg mx-auto">
                Based on your preferences, cooking history, and favorite ingredients, we'll show you recipes tailored just for you.
              </p>
              <Button 
                variant="secondary" 
                size="lg" 
                leftIcon={<Sparkles className="h-5 w-5" />}
                onClick={() => setShowPersonalized(true)}
                className="w-full sm:w-auto"
              >
                Show My Recommendations
              </Button>
            </div>
          </div>
        </section>
      )}

      {showPersonalized && personalizedLoading && (
        <section className="py-12 sm:py-16" aria-labelledby="personalized-heading">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="personalized-heading" className="section-title">Recommended for You</h2>
                <p className="section-subtitle">{personalizedReason}</p>
              </div>
              <Button variant="ghost" onClick={() => setShowPersonalized(false)} className="sm:hidden">
                <RotateCcw className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-busy="true" aria-label="Loading personalized recommendations">
              {[...Array(4)].map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          </div>
        </section>
      )}

      {showPersonalized && !personalizedLoading && personalizedRecipes.length > 0 && (
        <section className="py-12 sm:py-16" aria-labelledby="personalized-heading">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="personalized-heading" className="section-title">Recommended for You</h2>
                <p className="section-subtitle">{personalizedReason}</p>
              </div>
              <Button variant="ghost" onClick={() => setShowPersonalized(false)}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Back to Home
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {personalizedRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} showReason={true} />
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/explore">
                <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View More Recommendations
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {cookAgainRecipes.length > 0 && (
        <section className="py-12 sm:py-16 bg-white dark:bg-charcoal-900" aria-labelledby="cook-again-heading">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="cook-again-heading" className="section-title flex items-center gap-2">
                  <RotateCcw className="h-6 w-6 text-primary-600" />
                  Cook Again
                </h2>
                <p className="section-subtitle">Your recently cooked recipes</p>
              </div>
              <Link to="/profile?tab=history" className="hidden sm:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
                View History
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cookAgainRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
            <Link to="/profile?tab=history" className="sm:hidden mt-6 inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:underline">
              View All History
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {recentlyViewedRecipes.length > 0 && (
        <section className="py-12 sm:py-16" aria-labelledby="recently-viewed-heading">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 id="recently-viewed-heading" className="section-title flex items-center gap-2">
                  <ClockIcon className="h-6 w-6 text-primary-600" />
                  Recently Viewed
                </h2>
                <p className="section-subtitle">Pick up where you left off</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewedRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>
      )}

      {renderSection('Popular Recipes', popularRecipes, popularLoading, popularError, 'View all popular', '/explore?sort=popular', HeartIcon)}
      {renderSection('Quick & Easy', quickRecipes, quickLoading, quickError, 'View all quick', '/explore?maxTime=30', ZapIcon)}
      {renderSection('Trending Now', trendingRecipes, trendingLoading, trendingError, 'View trending', '/explore?sort=rating', SparklesIcon)}

      <section className="py-12 sm:py-16 bg-warm-50 dark:bg-charcoal-900" aria-labelledby="cuisines-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 id="cuisines-heading" className="section-title">Explore by Cuisine</h2>
            <p className="section-subtitle">Travel the world from your kitchen</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {cuisines.length > 0 ? (
              cuisines.map(cuisine => (
                <CuisineCard key={cuisine.id} cuisine={cuisine} />
              ))
            ) : (
              [...Array(10)].map((_, i) => (
                <div key={i} className="card-interactive aspect-square relative overflow-hidden p-6 flex flex-col items-center justify-center text-center animate-pulse">
                  <div className="text-4xl sm:text-5xl mb-3" aria-hidden="true">🍳</div>
                  <div className="h-6 w-24 bg-warm-200 dark:bg-charcoal-700 rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16" aria-labelledby="meals-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 id="meals-heading" className="section-title">Browse by Meal</h2>
            <p className="section-subtitle">Find the perfect dish for any time of day</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {mealTypes.length > 0 ? (
              mealTypes.map(mealType => (
                <CategoryCard key={mealType.id} category={mealType} />
              ))
            ) : (
              mealCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white dark:bg-charcoal-900" aria-labelledby="quick-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 id="quick-heading" className="section-title">Quick Recipes</h2>
            <p className="section-subtitle">Ready when you are</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {quickTimeOptions.map(option => (
              <Link
                key={option.id}
                to={`/explore?maxTime=${option.maxTime}`}
                className="card-interactive p-6 text-center group"
              >
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                  {option.icon}
                </span>
                <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {option.label}
                </h3>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/explore?sort=time-asc">
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Quick Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16" aria-labelledby="how-it-works-heading">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 id="how-it-works-heading" className="section-title">How CookFlow Works</h2>
            <p className="section-subtitle">Three simple steps from inspiration to dinner</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {step.step}
                </div>
                <div className="pt-20">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-7 w-7 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 dark:text-warm-100 mb-2">{step.title}</h3>
                  <p className="text-charcoal-500 dark:text-charcoal-400">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+8px)] right-[calc(50%+8px)] h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 dark:bg-primary-700" aria-labelledby="cta-heading">
        <div className="container-custom text-center">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to start cooking?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of home cooks who've turned their food inspiration into delicious meals.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/import">
              <Button size="lg" variant="secondary" leftIcon={<Sparkles className="h-5 w-5" />} className="w-full sm:w-auto">
                Import Your First Recipe
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Browse Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}