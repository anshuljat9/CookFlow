import { X, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatQuantity } from '../utils/recipeUtils';
import Button from './Button';

export default function ViewChangesDialog({
  isOpen,
  onClose,
  adaptedIngredients,
  adaptedSteps,
  originalSteps,
}) {
  if (!isOpen) return null;

  const substitutedIngredients = adaptedIngredients?.filter(ing => ing.isSubstituted) || [];
  const modifiedSteps = adaptedSteps?.filter((step, i) => {
    const original = originalSteps?.[i];
    return original && step.instruction !== original.instruction;
  }) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="card bg-charcoal-900 border-charcoal-800 w-full max-w-2xl max-h-[80vh] p-6 animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary-500" />
            Recipe Adaptations
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-6">
          {substitutedIngredients.length > 0 && (
            <section>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Ingredient Substitutions ({substitutedIngredients.length})
              </h3>
              <div className="space-y-3">
                {substitutedIngredients.map((ing, i) => {
                  const original = ing.originalIngredient;
                  const subs = ing.substitutedWith || [];
                  return (
                    <div key={i} className="p-4 rounded-xl bg-charcoal-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-charcoal-400 line-through">
                          {original ? formatQuantity(original.quantity, original.unit) : ''} {original?.name || ing.name}
                        </span>
                        <span className="text-primary-300">→</span>
                        <span className="text-green-400">
                          {subs.map((s, si) => (
                            <span key={si} className="mr-1">
                              {formatQuantity(s.quantity, s.unit)} {s.name}
                              {si < subs.length - 1 && ' + '}
                            </span>
                          ))}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-400">
                        Substituted because original was not available
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {modifiedSteps.length > 0 && (
            <section>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
                Modified Steps ({modifiedSteps.length})
              </h3>
              <div className="space-y-3">
                {modifiedSteps.map((step, i) => {
                  const original = originalSteps?.[adaptedSteps?.findIndex(s => s === step)];
                  return (
                    <div key={i} className="p-4 rounded-xl bg-charcoal-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-primary-900/50 text-primary-300 text-sm font-medium">
                          Step {step.stepNumber}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="p-2 rounded bg-charcoal-700 border-l-2 border-charcoal-500">
                          <p className="text-charcoal-400">Original:</p>
                          <p className="text-charcoal-300 line-through">{original?.instruction}</p>
                        </div>
                        <div className="p-2 rounded bg-charcoal-700 border-l-2 border-green-500">
                          <p className="text-green-400">Adapted:</p>
                          <p className="text-white">{step.instruction}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {substitutedIngredients.length === 0 && modifiedSteps.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-charcoal-300">No adaptations were made to this recipe.</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-charcoal-800">
          <Button variant="primary" onClick={onClose} className="w-full">
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
}