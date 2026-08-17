import { X } from 'lucide-react';

export default function IngredientChip({ 
  ingredient, 
  onRemove, 
  showIcon = true,
  className = '',
  removable = true
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-100 text-charcoal-700 text-sm font-medium dark:bg-charcoal-800 dark:text-warm-200 ${className}`}>
      {showIcon && <span aria-hidden="true" className="text-base">{ingredient.icon}</span>}
      <span>{ingredient.name}</span>
      {removable && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(ingredient.id); }}
          className="p-0.5 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-warm-200 dark:hover:bg-charcoal-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label={`Remove ${ingredient.name}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}