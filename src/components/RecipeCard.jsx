import { Heart, Clock, ChefHat, Star } from 'lucide-react';
import { difficulties, cuisines } from '../data/categories';

export default function RecipeCard({ 
  recipe, 
  onClick, 
  onFavoriteClick,
  variant = 'default',
  className = '' 
}) {
  const cuisine = cuisines.find(c => c.id === recipe.cuisine);
  const difficulty = difficulties.find(d => d.id === recipe.difficulty);
  
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

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
          src={recipe.image}
          alt={`${recipe.title} - ${recipe.description}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onFavoriteClick?.(recipe.id); }}
            className={`p-2 rounded-xl transition-all duration-200 ${recipe.isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-charcoal-600 hover:bg-white dark:bg-charcoal-800/90 dark:text-warm-300'} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
            aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={recipe.isFavorite}
          >
            <Heart className={`${recipe.isFavorite ? 'fill-current' : ''} h-5 w-5`} aria-hidden="true" />
          </button>
          {recipe.tags?.includes('popular') && (
            <span className="px-2 py-1 rounded-full bg-primary-600 text-white text-xs font-medium">Popular</span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="px-2 py-1 rounded-full bg-white/90 text-charcoal-700 text-xs font-medium dark:bg-charcoal-800/90 dark:text-warm-200 flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {formatTime(recipe.cookingTime)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty?.color}`}>
            {difficulty?.name}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-5 flex flex-col">
        <div className="flex items-start gap-2 mb-2">
          {cuisine && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cuisine.color} flex-shrink-0`}>
              {cuisine.icon} {cuisine.name}
            </span>
          )}
          <div className="flex-1 flex items-center gap-1.5 text-sm text-charcoal-500 dark:text-charcoal-400">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current text-amber-500" aria-hidden="true" />
              {recipe.rating}
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="h-3.5 w-3.5" aria-hidden="true" />
              {recipe.servings} servings
            </span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-charcoal-900 dark:text-warm-100 line-clamp-1 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {recipe.title}
        </h3>

        <p className="text-sm text-charcoal-500 dark:text-charcoal-400 line-clamp-2 flex-1 mb-3">
          {recipe.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {recipe.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-warm-100 text-charcoal-600 text-xs font-medium dark:bg-charcoal-800 dark:text-warm-300">
              {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}