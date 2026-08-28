import { Check, ChefHat, RotateCcw, AlertTriangle } from 'lucide-react';
import { formatQuantity } from '../utils/recipeUtils';
import Button from './Button';

export default function IngredientChecklist({
  ingredients,
  adaptedIngredients,
  isAdapted,
  servings,
  originalServings,
  checks,
  onToggle,
  onViewChanges,
}) {
  const displayIngredients = isAdapted ? adaptedIngredients : ingredients;
  const isScaled = servings !== originalServings;

  return (
    <section className="card bg-charcoal-900 border-charcoal-800" aria-labelledby="ingredients-heading">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="ingredients-heading" className="text-lg font-semibold flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary-500" />
            Ingredient Checklist
          </h2>
          
          {isAdapted && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={onViewChanges}
              className="text-primary-300 hover:text-primary-200"
            >
              View Changes
            </Button>
          )}
          
          {isScaled && (
            <span className="px-2 py-1 text-xs rounded-full bg-amber-900/30 text-amber-300 border border-amber-800/50">
              Scaled to {servings} servings
            </span>
          )}
        </div>

        <ul className="space-y-2" role="list">
          {displayIngredients.length > 0 ? (
            displayIngredients.map((ing, index) => {
              const isSubstituted = isAdapted && ing.isSubstituted;
              const originalIng = isSubstituted ? ing.originalIngredient : null;
              const substitutedWith = isSubstituted ? ing.substitutedWith : null;
              
              const quantity = ing.quantity;
              const unit = ing.unit;
              const preparation = ing.preparation;
              const name = ing.ingredient?.name || ing.name;
              const isOptional = ing.isOptional || ing.is_optional;
              
              const displayQty = quantity !== null && quantity !== undefined ? quantity : '';
              
              return (
                <li key={ing.id || index}>
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 cursor-pointer transition-colors group">
                    <input
                      type="checkbox"
                      checked={checks[index]}
                      onChange={() => onToggle(index)}
                      className="w-5 h-5 mt-0.5 rounded text-primary-600 border-charcoal-600 focus:ring-primary-500 bg-charcoal-700 flex-shrink-0"
                      aria-label={`Mark ${name} as ready`}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`${checks[index] ? 'line-through text-charcoal-500' : 'text-white'} font-medium`}>
                          {isSubstituted ? (
                            <>
                              <span className="line-through text-charcoal-500">
                                {originalIng ? formatQuantity(originalIng.quantity, originalIng.unit) : ''} {originalIng?.name || name}
                              </span>
                              <span className="text-primary-300">→</span>
                              <span className="text-green-400">
                                {substitutedWith?.map((s, si) => (
                                  <span key={si}>
                                    {formatQuantity(s.quantity, s.unit)} {s.name}
                                    {si < (substitutedWith?.length || 0) - 1 && ' + '}
                                  </span>
                                ))}
                              </span>
                            </>
                          ) : (
                            <>
                              {displayQty && <span className="font-mono text-primary-300">{formatQuantity(displayQty, unit)}</span>}
                              {preparation && <span className="text-charcoal-300">({preparation})</span>}
                              <span>{name}</span>
                            </>
                          )}
                        </span>
                        
                        {isOptional && (
                          <span className="text-xs text-charcoal-400 px-2 py-0.5 rounded bg-charcoal-700">
                            Optional
                          </span>
                        )}
                      </div>
                      
                      {isSubstituted && originalIng && (
                        <p className="mt-1 text-xs text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Adapted from {formatQuantity(originalIng.quantity, originalIng.unit)} {originalIng.name}
                        </p>
                      )}
                    </div>
                    
                    {checks[index] && (
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                  </label>
                </li>
              );
            })
          ) : (
            <li className="text-charcoal-400 text-center py-8">No ingredients listed</li>
          )}
        </ul>
      </div>
    </section>
  );
}