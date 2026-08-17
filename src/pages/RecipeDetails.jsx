import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Share2, Clock, ChefHat, Users, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { getRecipeById } from '../data/recipes';
import { cuisines, difficulties } from '../data/categories';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';

export default function RecipeDetails() {
  const { id } = useParams();
  const recipe = getRecipeById(parseInt(id));
  const [isFavorite, setIsFavorite] = useState(recipe?.isFavorite || false);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (!recipe) {
    return (
      <div className="container-custom py-16 text-center">
        <LoadingState variant="card" size="lg" text="Recipe not found" />
      </div>
    );
  }

  const cuisine = cuisines.find(c => c.id === recipe.cuisine);
  const difficulty = difficulties.find(d => d.id === recipe.difficulty);

  const handleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  const handleShare = async () => {
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
                src={recipe.image}
                alt={`${recipe.title} - ${recipe.description}`}
                className="w-full h-full object-cover"
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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${cuisine.color}`}>
                  {cuisine.icon} {cuisine.name}
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficulty?.color}`}>
                {difficulty?.name}
              </span>
              {recipe.tags?.includes('vegetarian') && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  🌱 Vegetarian
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-warm-100 mb-3">{recipe.title}</h1>
            <p className="text-lg text-charcoal-600 dark:text-charcoal-300 max-w-2xl">{recipe.description}</p>
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
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">{formatTime(Math.round(recipe.cookingTime * 0.3))}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Cook Time</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">{formatTime(Math.round(recipe.cookingTime * 0.7))}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Total Time</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">{formatTime(recipe.cookingTime)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Servings</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">{recipe.servings} people</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Difficulty</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100">{difficulty?.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-500 dark:text-charcoal-400">Rating</dt>
                  <dd className="font-medium text-charcoal-900 dark:text-warm-100 flex items-center gap-1">
                    <span className="text-amber-500">★</span> {recipe.rating}/5
                  </dd>
                </div>
              </dl>
            </div>

            <div className="card p-5 md:col-span-2">
              <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary-600" />
                Instructions
              </h2>
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </span>
                    <p className="text-charcoal-700 dark:text-warm-200 pt-1 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <section className="card p-5">
              <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-600" />
                Ingredients ({recipe.ingredients.length})
              </h2>
              <ul className="space-y-2" role="list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-warm-50 dark:hover:bg-charcoal-800 transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-primary-600 border-warm-300 rounded focus:ring-primary-500" />
                    <span className="text-charcoal-700 dark:text-warm-200 flex-1">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="card p-5 bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/50">
              <h2 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Need an ingredient?
              </h2>
              <p className="text-charcoal-600 dark:text-charcoal-300 mb-4">
                Don't have <strong>heavy cream</strong> or <strong>fresh basil</strong>?
              </p>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-4">
                AI will suggest smart substitutions based on what you have in your kitchen.
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