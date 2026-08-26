import { Check, X, RotateCcw, Sparkles } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import Button from './Button';

export default function AdaptedIngredientList({ 
  adaptedIngredients, 
  onReset,
  showConfidence = true,
}) {
  const substituted = adaptedIngredients.filter(i => i.isSubstituted);
  const missing = adaptedIngredients.filter(i => i.isMissing && !i.isSubstituted);
  const available = adaptedIngredients.filter(i => !i.isSubstituted && !i.isMissing);

  return (
    <div className="space-y-4">
      {onReset && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-charcoal-900 dark:text-warm-100">Your Adapted Ingredients</h3>
          <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset to Original
          </Button>
        </div>
      )}

      {substituted.length > 0 && (
        <section className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-300">
            <Sparkles className="h-4 w-4" />
            Substituted ({substituted.length})
          </h4>
          <div className="space-y-2">
            {substituted.map((ing, index) => (
              <div 
                key={ing.id || index} 
                className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold flex-shrink-0">
                    🔄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal-900 dark:text-warm-100">
                      {ing.substitutedWith?.map((s) => `${s.quantity} ${s.unit} ${s.name}`).join(' + ')}
                    </p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">
                      Replaces: {ing.originalIngredient?.quantity} {ing.originalIngredient?.unit} {ing.originalIngredient?.name}
                    </p>
                    {showConfidence && ing.confidence && (
                      <ConfidenceBadge 
                        confidence={ing.confidence} 
                        confidenceScore={ing.confidence === 'high' ? 0.9 : ing.confidence === 'medium' ? 0.7 : 0.5}
                        size="sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {missing.length > 0 && (
        <section className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300">
            <X className="h-4 w-4" />
            Still Missing ({missing.length})
          </h4>
          <div className="space-y-2">
            {missing.map((ing, index) => (
              <div 
                key={ing.id || index} 
                className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                    <X className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-900 dark:text-warm-100">
                      {ing.quantity} {ing.unit} {ing.ingredient?.name || ing.name}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">No substitution available with current kitchen</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {available.length > 0 && (
        <section className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300">
            <Check className="h-4 w-4" />
            Available ({available.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {available.slice(0, 10).map((ing, index) => (
              <span 
                key={ing.id || index}
                className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              >
                {ing.ingredient?.name || ing.name}
              </span>
            ))}
            {available.length > 10 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warm-100 text-charcoal-500 dark:bg-charcoal-800 dark:text-charcoal-400">
                +{available.length - 10} more
              </span>
            )}
          </div>
        </section>
      )}
    </div>
  );
}