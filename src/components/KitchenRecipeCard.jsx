import { Check, X } from 'lucide-react';
import IngredientMatchBadge from './IngredientMatchBadge';

export function AvailableIngredients({ ingredients, maxVisible = 6 }) {
  if (!ingredients || ingredients.length === 0) return null;
  
  const visible = ingredients.slice(0, maxVisible);
  const remaining = ingredients.length - maxVisible;
  
  return (
    <div className="space-y-1.5">
      <h4 className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider mb-1.5">
        ✓ Available ({ingredients.length})
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {visible.map(ing => (
          <span 
            key={`${ing.ingredientId}-${ing.name}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          >
            <Check className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            {ing.name}
          </span>
        ))}
        {remaining > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warm-100 text-charcoal-500 dark:bg-charcoal-800 dark:text-charcoal-400">
            +{remaining} more
          </span>
        )}
      </div>
    </div>
  );
}

export function MissingIngredients({ ingredients, maxVisible = 4 }) {
  if (!ingredients || ingredients.length === 0) return null;
  
  const required = ingredients.filter(ing => !ing.isOptional);
  const optional = ingredients.filter(ing => ing.isOptional);
  
  const visibleRequired = required.slice(0, maxVisible);
  const remainingRequired = required.length - maxVisible;
  const visibleOptional = optional.slice(0, maxVisible - visibleRequired.length);
  const remainingOptional = optional.length - visibleOptional.length;
  
  return (
    <div className="space-y-1.5">
      {(required.length > 0 || optional.length > 0) && (
        <h4 className="text-xs font-medium text-red-700 dark:text-red-300 uppercase tracking-wider mb-1.5">
          ✕ Missing ({required.length} required{optional.length > 0 ? `, ${optional.length} optional` : ''})
        </h4>
      )}
      <div className="flex flex-wrap gap-1.5">
        {visibleRequired.map(ing => (
          <span 
            key={`${ing.ingredientId}-${ing.name}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
          >
            <X className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            {ing.name}
          </span>
        ))}
        {visibleOptional.map(ing => (
          <span 
            key={`${ing.ingredientId}-${ing.name}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
          >
            <X className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            {ing.name} (opt)
          </span>
        ))}
        {(remainingRequired > 0 || remainingOptional > 0) && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warm-100 text-charcoal-500 dark:bg-charcoal-800 dark:text-charcoal-400">
            +{remainingRequired + remainingOptional} more
          </span>
        )}
      </div>
    </div>
  );
}

export function KitchenRecipeCard({ recipe, match, onClick, variant = 'default' }) {
  const { matchPercentage, availableIngredients, missingIngredients } = match || {};
  
  const cuisine = recipe.cuisine;
  const difficulty = recipe.difficulty;
  const tags = recipe.recipe_tags?.map(rt => rt.tag?.name).filter(Boolean) || [];
  const imageUrl = recipe.image_url || recipe.image;
  const totalTime = recipe.total_time_minutes || 0;
  const rating = recipe.rating || 0;
  
  const formatTime = (minutes) => {
    if (!minutes && minutes !== 0) return '—';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  return (
    <article 
      className={`card-interactive group flex flex-col ${variant === 'compact' ? 'flex-row' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }}}
      tabIndex={0}
      role="button"
      aria-label={`View recipe: ${recipe.title}, ${matchPercentage}% match`}
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={`${recipe.title} - ${recipe.description}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'; }}
        />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <IngredientMatchBadge matchPercentage={matchPercentage} size="sm" />
          {tags.includes('popular') && (
            <span className="px-2 py-1 rounded-full bg-primary-600 text-white text-xs font-medium">Popular</span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="px-2 py-1 rounded-full bg-white/90 text-charcoal-700 text-xs font-medium dark:bg-charcoal-800/90 dark:text-warm-200 flex items-center gap-1">
            <span className="h-3 w-3" aria-hidden="true">⏱</span>
            {formatTime(totalTime)}
          </span>
          {difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulty.color_class}`}>
              {difficulty.name}
            </span>
          )}
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
              <span className="h-3.5 w-3.5 fill-current text-amber-500" aria-hidden="true">★</span>
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-charcoal-900 dark:text-warm-100 line-clamp-1 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {recipe.title}
        </h3>

        <p className="text-sm text-charcoal-500 dark:text-charcoal-400 line-clamp-2 flex-1 mb-3">
          {recipe.description}
        </p>

        <AvailableIngredients ingredients={availableIngredients} maxVisible={4} />
        <MissingIngredients ingredients={missingIngredients} maxVisible={3} />
      </div>
    </article>
  );
}

export default KitchenRecipeCard;