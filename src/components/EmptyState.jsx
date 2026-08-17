import { Search, Utensils, Heart, Film, Plus, ArrowRight } from 'lucide-react';
import Button from './Button';

const emptyStates = {
  search: {
    icon: Search,
    title: 'No recipes found',
    description: 'Try adjusting your search or filters to discover something delicious.',
    action: { label: 'Clear filters', variant: 'ghost' }
  },
  favorites: {
    icon: Heart,
    title: 'No favorites yet',
    description: 'Start exploring recipes and tap the heart icon to save your favorites.',
    action: { label: 'Explore recipes', variant: 'primary' }
  },
  kitchen: {
    icon: Utensils,
    title: 'Your kitchen is empty',
    description: 'Add ingredients you have on hand to find recipes you can make right now.',
    action: { label: 'Add ingredients', variant: 'primary' }
  },
  import: {
    icon: Film,
    title: 'No imported recipes',
    description: 'Paste a video URL or upload an image to extract a recipe with AI.',
    action: { label: 'Import recipe', variant: 'primary' }
  },
  history: {
    icon: Utensils,
    title: 'No cooking history',
    description: 'Your recently cooked recipes will appear here.',
    action: { label: 'Start cooking', variant: 'primary' }
  },
  default: {
    icon: Search,
    title: 'Nothing here yet',
    description: 'Try adjusting your search or browse our recipes to get started.',
    action: null
  }
};

export default function EmptyState({ 
  type = 'default', 
  title, 
  description, 
  action,
  className = '',
  onActionClick
}) {
  const config = emptyStates[type] || emptyStates.default;
  const Icon = config.icon;
  
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayAction = action || config.action;

  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`} role="status">
      <div className="w-20 h-20 rounded-2xl bg-warm-100 dark:bg-charcoal-800 flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-charcoal-400 dark:text-charcoal-500" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-charcoal-900 dark:text-warm-100 mb-2">{displayTitle}</h3>
      <p className="text-charcoal-500 dark:text-charcoal-400 max-w-sm mb-6">{displayDescription}</p>
      {displayAction && (
        <Button
          variant={displayAction.variant}
          onClick={onActionClick}
          leftIcon={displayAction.variant === 'primary' ? <ArrowRight className="h-4 w-4" /> : undefined}
        >
          {displayAction.label}
        </Button>
      )}
    </div>
  );
}