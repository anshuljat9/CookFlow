import { Heart, Clock, ChefHat, Star } from 'lucide-react';

const formatTime = (minutes) => {
  if (!minutes && minutes !== 0) return '—';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const getCuisineInfo = (recipe) => {
  if (recipe.cuisine?.name) return recipe.cuisine;
  if (recipe.cuisineName) return { name: recipe.cuisineName, icon: recipe.cuisineIcon, color_class: recipe.cuisineColor };
  return null;
};

const getDifficultyInfo = (recipe) => {
  if (recipe.difficulty?.name) return recipe.difficulty;
  if (recipe.difficultyName) return { name: recipe.difficultyName, color_class: recipe.difficultyColor };
  if (typeof recipe.difficulty === 'string') {
    const colors = {
      easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };
    return { name: recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1), color_class: colors[recipe.difficulty] };
  }
  return null;
};

const getTags = (recipe) => {
  if (recipe.tags) return recipe.tags;
  if (recipe.recipe_tags) return recipe.recipe_tags.map(rt => rt.tag?.name).filter(Boolean);
  return [];
};

const getImageUrl = (recipe) => {
  return recipe.image_url || recipe.image;
};

const getCookingTime = (recipe) => {
  return recipe.total_time_minutes || recipe.cookingTime || recipe.cook_time_minutes || 0;
};

const getRating = (recipe) => {
  return recipe.rating || 0;
};

const getServings = (recipe) => {
  return recipe.servings || 1;
};

const getIsFavorite = (recipe) => {
  return recipe.isFavorite || false;
};

const getDescription = (recipe) => {
  return recipe.description || '';
};

export default function RecipeCard({ 
  recipe, 
  onClick, 
  onFavoriteClick,
  variant = 'default',
  className = '' 
}) {
  const cuisine = getCuisineInfo(recipe);
  const difficulty = getDifficultyInfo(recipe);
  const tags = getTags(recipe);
  const imageUrl = getImageUrl(recipe);
  const cookingTime = getCookingTime(recipe);
  const rating = getRating(recipe);
  const servings = getServings(recipe);
  const isFavorite = getIsFavorite(recipe);
  const description = getDescription(recipe);

  return (
    <article 
      className={`card-interactive group ${variant === 'compact' ? 'flex flex-col sm:flex-row' : 'flex flex-col'} ${className}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }}}
      tabIndex={0}
      role="button"
      aria-label={`View recipe: ${recipe.title}`}
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={`${recipe.title} - ${description}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'; }}
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onFavoriteClick?.(recipe.id); }}
            className={`p-2 rounded-xl transition-all duration-200 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-charcoal-600 hover:bg-white dark:bg-charcoal-800/90 dark:text-warm-300'} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
          >
            <Heart className={`${isFavorite ? 'fill-current' : ''} h-5 w-5`} aria-hidden="true" />
          </button>
          {tags.includes('popular') && (
            <span className="px-2 py-1 rounded-full bg-primary-600 text-white text-xs font-medium">Popular</span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="px-2 py-1 rounded-full bg-white/90 text-charcoal-700 text-xs font-medium dark:bg-charcoal-800/90 dark:text-warm-200 flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {formatTime(cookingTime)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty?.color_class}`}>
            {difficulty?.name}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-5 flex flex-col">
        <div className="flex items-start gap-2 mb-2">
          {cuisine && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cuisine.color_class} flex-shrink-0`}>
              {cuisine.icon} {cuisine.name}
            </span>
          )}
          <div className="flex-1 flex items-center gap-1.5 text-sm text-charcoal-500 dark:text-charcoal-400">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" aria-hidden="true" />
              {rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="h-3.5 w-3.5" aria-hidden="true" />
              {servings} servings
            </span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-charcoal-900 dark:text-warm-100 line-clamp-1 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {recipe.title}
        </h3>

        <p className="text-sm text-charcoal-500 dark:text-charcoal-400 line-clamp-2 flex-1 mb-3">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-warm-100 text-charcoal-600 text-xs font-medium dark:bg-charcoal-800 dark:text-warm-300">
              {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}