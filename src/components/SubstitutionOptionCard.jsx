import { Check, AlertTriangle, Info } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

export default function SubstitutionOptionCard({ 
  option, 
  isSelected, 
  onSelect, 
  missingIngredientName 
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
        isSelected 
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500/20' 
          : 'border-warm-200 dark:border-charcoal-700 hover:border-primary-300 dark:hover:border-primary-700'
      }`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-charcoal-900 dark:text-warm-100">
              Replace {missingIngredientName} with:
            </span>
            <ConfidenceBadge 
              confidence={option.confidence} 
              confidenceScore={option.confidenceScore} 
              size="sm" 
            />
            {option.source === 'ai' && (
              <span className="px-1.5 py-0.5 text-xs rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                AI
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {option.ingredients.map((ing, index) => (
              <span 
                key={`${ing.name}-${index}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-sm font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
              >
                <span className="font-semibold">{ing.quantity} {ing.unit}</span>
                <span>{ing.name}</span>
                {ing.preparation && <span className="text-xs opacity-75">({ing.preparation})</span>}
              </span>
            ))}
          </div>

          <p className="text-sm text-charcoal-600 dark:text-charcoal-400 mb-2">{option.reason}</p>

          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="font-medium text-green-700 dark:text-green-300 flex items-center gap-1">
                <Info className="h-3 w-3" aria-hidden="true" />
                Taste
              </div>
              <div className="text-green-600 dark:text-green-400 mt-0.5">{option.tasteImpact}</div>
            </div>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                <Info className="h-3 w-3" aria-hidden="true" />
                Texture
              </div>
              <div className="text-blue-600 dark:text-blue-400 mt-0.5">{option.textureImpact}</div>
            </div>
          </div>

          {option.warnings.length > 0 && (
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <div className="font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1 mb-1">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                Notes
              </div>
              <ul className="text-amber-600 dark:text-amber-400 space-y-0.5 text-xs">
                {option.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="flex-shrink-0">•</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          {isSelected && (
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
              <Check className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center border-2 border-white dark:border-charcoal-950">
          <Check className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
      )}
    </button>
  );
}