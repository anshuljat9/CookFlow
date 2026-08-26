import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, Clock, ChefHat, Users, AlertCircle, ArrowLeft, Sparkles, Check, X, RotateCcw } from 'lucide-react';
import { useRecipe } from '../hooks/useRecipes';
import { useKitchen } from '../hooks/useKitchen';
import { useRecipeMatch } from '../hooks/useKitchenRecipes';
import { recipeService } from '../services/recipeService';
import { formatTime, formatIngredient } from '../utils/recipeUtils';
import Button from '../components/Button';
import RecipeDetailSkeleton from '../components/RecipeDetailSkeleton';
import IngredientMatchBadge from '../components/IngredientMatchBadge';

export default function RecipeDetails() {
  const { id } = useParams();
  const { recipe, loading, error } = useRecipe(id);
  const { selectedIngredientIds } = useKitchen();
  const match = useRecipeMatch(recipe, selectedIngredientIds);
  const [isFavorite, setIsFavorite] = useState(false);
  const [servings, setServings] = useState(1);
  const [showSubstitutions, setShowSubstitutions] = useState(false);

  useEffect(() => {
    if (recipe) {
      setIsFavorite(recipe.isFavorite || false);
      setServings(recipe.servings || 1);
    }
  }, [recipe]);

  const handleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  const handleShare = async () => {
    if (!recipe) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href
        });
      } catch (e) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  const handleServingsChange = (newServings) => {
    if (newServings >= 1 && newServings <= 20) {
      setServings(newServings);
    }
  };

  if (loading) {
    return <RecipeDetailSkeleton />;
  }

  if (error || !recipe) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="card p-8 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-charcoal-900 dark:text-warm-100 mb-2">
            Recipe not found
          </h3>
          <p className="text-charcoal-500 dark:text-charcoal-400 mb-4">
            {error || 'This recipe doesn\'t exist or has been removed.'}
          </p>
          <Link to="/explore">
            <Button variant="primary" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Explore
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cuisine = recipe.cuisine;
  const difficulty = recipe.difficulty;
  const tags = recipe.recipe_tags?.map(rt => rt.tag?.name).filter(Boolean) || [];
  const ingredients = recipe.recipe_ingredients || [];
  const steps = recipe.recipe_steps || [];
  const imageUrl = recipe.image_url || recipe.image;
  const prepTime = recipe.prep_time_minutes || 0;
  const cookTime = recipe.cook_time_minutes || 0;
  const totalTime = recipe.total_time_minutes || 0;

  const isVegetarian = recipe.is_vegetarian || tags.includes('vegetarian');
  const isVegan = recipe.is_vegan || tags.includes('vegan');
  const isGlutenFree = recipe.is_gluten_free || tags.includes('gluten-free');

  const availableIngredients = match?.availableIngredients || [];
  const missingIngredients = match?.missingIngredients || [];
  const matchPercentage = match?.matchPercentage || 0;
  const hasKitchenContext = selectedIngredientIds.length > 0;

  return (
    <div className="animate-fade-in">
      <div className="container-custom py-6 sm:py-8">
        <Link to="/explore" className="inline-flex items-center gap-2 text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-700 dark:hover:text-warm-200 text-sm font-medium mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        <article>
          <header className="mb-8">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6">
              <img
                src={imageUrl}
                alt={`${recipe.title} - ${recipe.description}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'; }}
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleFavorite}
                  className={`p-2 rounded-xl transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-charcoal-600 hover:bg-white dark:bg-charcoal-800/90 dark:text-warm-300'}`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  aria-pressed={isFavorite}
                >
                  <Heart className={`${isFavorite ? 'fill-current' : ''} h-5 w-5`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-white/90 text-charcoal-600 hover:bg-white dark:bg-charcoal-800/90 dark:text-warm-300 transition-colors"
                  aria-label="Share recipe"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              {cuisine && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${cuisine.color_class}`}>
                  {cuisine.icon} {cuisine.name}
                </span>
              )}
              {difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficulty.color_class}`}>
                  {difficulty.name}
                </span>
              )}
              {isVegetarian && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  🌱 Vegetarian
                </span>
              )}
              {isVegan && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  🌿 Vegan
                </span>
              )}
              {isGlutenFree && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  🌾 Gluten Free
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-warm-100 mb-3">{recipe.title}</h1>
            <p className="text-lg text-charcoal-600 dark:text-charcoal-300 max-w-2xl">{recipe.description}</p>

            {hasKitchenContext && match && (
              <div className="mt-6 p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-charcoal-900 dark:text-warm-100">Your Kitchen Match</h3>
                  <IngredientMatchBadge matchPercentage={matchPercentage} size="lg" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-300 mb-1">✓ Available ({availableIngredients.filter(i => !i.isOptional).length})</p>
                    <div className="flex flex-wrap gap-1">
                      {availableIngredients.filter(i => !i.isOptional).slice(0, 5).map(ing => (
                        <span key={ing.ingredientId} className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          {ing.name}
                        </span>
                      ))}
                      {availableIngredients.filter(i => !i.isOptional).length > 5 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-warm-100 text-charcoal-500 dark:bg-charcoal-800 dark:text-charcoal-400">
                          +{availableIngredients.filter(i => !i.isOptional).length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-300 mb-1">✕ Missing ({missingIngredients.filter(i => !i.isOptional).length})</p>
                    <div className="flex flex-wrap gap-1">
                      {missingIngredients.filter(i => !i.isOptional).slice(0, 5).map(ing => (
                        <span key={ing.ingredientId} className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                          {ing.name}
                        </span>
                      ))}
                      {missingIngredients.filter(i => !i.isOptional).length > 5 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-warm-100 text-charcoal-500 dark:bg-charcoal-800 dark:text-charcoal-400">
                          +{missingIngredients.filter(i => !i.isOptional).length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {missingIngredients.filter(i => !i.isOptional).length > 0 && (
                  <Button 
                    variant="outline" 
                    leftIcon={<Sparkles className="h-4 w-4" />}
                    className="mt-3"
                    disabled
                  >
                    <RotateCcw className="h-4 w-4" />
                    Adapt This Recipe (Coming Soon)
                  </Button>
                )}
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-5 md:col-span-1">
              <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary-600" />
                Details
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Prep Time</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">{formatTime(prepTime)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Cook Time</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">{formatTime(cookTime)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Total Time</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">{formatTime(totalTime)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Servings</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">
                    <div className="flex items-center gap-2">
                      <span>{recipe.servings} people</span>
                      <div className="flex items-center gap-1 border border-warm-300 dark:border-charcoal-600 rounded-lg px-2 py-1">
                        <button
                          onClick={() => handleServingsChange(servings - 1)}
                          disabled={servings <= 1}
                          className="p-1 text-charcoal-500 hover:text-charcoal-700 dark:text-charcoal-400 dark:hover:text-warm-200 disabled:opacity-50"
                          aria-label="Decrease servings"
                        >−</button>
                        <span className="w-8 text-center font-medium text-charcoal-900 dark:text-warm-100">{servings}</span>
                        <button
                          onClick={() => handleServingsChange(servings + 1)}
                          disabled={servings >= 20}
                          className="p-1 text-charcoal-500 hover:text-charcoal-700 dark:text-charcoal-400 dark:hover:text-warm-200 disabled:opacity-50"
                          aria-label="Increase servings"
                        >+</button>
                      </div>
                    </div>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Difficulty</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">{difficulty?.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Rating</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100 flex items-center gap-1">
                    <span className="text-amber-500">★</span> {recipe.rating?.toFixed(1) || '—'}/5
                    {recipe.rating_count && (
                      <span className="text-charcoal-400 dark:text-charcoal-500">({recipe.rating_count})</span>
                    )}
                  </dd>
                </div>
                {recipe.calories && (
                  <div className="flex justify-between">
                    <dt className="text-charcoal-500 dark:text-charcoal-400">Calories (per serving)</dt>
                    <dd className="font-medium text-charcoal-900 dark:text-warm-100">{recipe.calories} kcal</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="card p-5 md:col-span-2">
              <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary-600" />
                Instructions
              </h2>
              <ol className="space-y-4">
                {steps.length > 0 ? (
                  steps.map((step, index) => (
                    <li key={step.id || index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                        {step.step_number || index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-charcoal-700 dark:text-warm-200 pt-1 leading-relaxed">{step.instruction}</p>
                        {(step.duration_seconds || step.temperature || step.tip) && (
                          <div className="flex flex-wrap gap-4 mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
                            {step.duration_seconds && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatTime(Math.round(step.duration_seconds / 60))}
                              </span>
                            )}
                            {step.temperature && (
                              <span className="flex items-center gap-1">🌡 {step.temperature}</span>
                            )}
                            {step.tip && (
                              <span className="flex items-center gap-1">💡 {step.tip}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-charcoal-500 dark:text-charcoal-400 text-center py-8">
                    No instructions available
                  </li>
                )}
              </ol>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <section className="card p-5">
              <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-600" />
                Ingredients ({ingredients.length})
              </h2>
              <ul className="space-y-2" role="list">
                {ingredients.length > 0 ? (
                  ingredients.map((ri, index) => {
                    const ingredientId = ri.ingredient?.id || ri.ingredient_id;
                    const isAvailable = selectedIngredientIds.includes(ingredientId);
                    const isMissing = !isAvailable;
                    
                    return (
                      <li key={ri.id || index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-warm-50 dark:hover:bg-charcoal-800 transition-colors">
                        <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                          {isAvailable ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                        </span>
                        <span className={`text-charcoal-700 dark:text-warm-200 flex-1 ${isMissing ? 'line-through text-charcoal-400 dark:text-charcoal-500' : ''}`}>
                          {formatIngredient(ri, servings)}
                        </span>
                        {ri.is_optional && (
                          <span className="text-xs text-charcoal-400 dark:text-charcoal-500 px-2 py-0.5 rounded bg-warm-100 dark:bg-charcoal-800">
                            Optional
                          </span>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="text-charcoal-500 dark:text-charcoal-400 text-center py-8">
                    No ingredients listed
                  </li>
                )}
              </ul>
            </section>

            <section className="card p-5 bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/50">
              <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Need an ingredient?
              </h2>
              <p className="text-charcoal-600 dark:text-charcoal-300 mb-4">
                Don't have certain ingredients? AI will suggest smart substitutions based on what you have in your kitchen.
              </p>
              <Button variant="outline" leftIcon={<Sparkles className="h-4 w-4" />} disabled>
                Find Substitutions (Coming Soon)
              </Button>
            </section>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to={`/cook/${recipe.id}`}>
              <Button size="lg" leftIcon={<ChefHat className="h-5 w-5" />} className="flex-1 sm:flex-none">
                Start Cooking
              </Button>
            </Link>
            <Button variant="secondary" onClick={handleFavorite} leftIcon={isFavorite ? <Heart className="h-5 w-5 fill-current" /> : <Heart className="h-5 w-5" />}>
              {isFavorite ? 'Saved' : 'Save Recipe'}
            </Button>
            <Button variant="outline" onClick={handleShare} leftIcon={<Share2 className="h-5 w-5" />}>
              Share
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}