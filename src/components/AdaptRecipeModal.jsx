import { useState, useEffect, useCallback } from 'react';
import { X, Check, AlertTriangle, Loader2, Sparkles, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import SubstitutionOptionCard from './SubstitutionOptionCard';
import ConfidenceBadge from './ConfidenceBadge';
import { substitutionService } from '../services/substitutionService';
import { validateAllSubstitutions } from '../utils/substitutionValidator';

export default function AdaptRecipeModal({
  isOpen,
  onClose,
  recipe,
  missingIngredients,
  kitchenIngredients,
  servings,
  originalServings,
  onAdaptComplete,
}) {
  const [currentStep, setCurrentStep] = useState('loading');
  const [substitutionResults, setSubstitutionResults] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adaptedRecipe, setAdaptedRecipe] = useState(null);

  const kitchenIngredientNames = kitchenIngredients.map(k => k.name);

  const fetchSubstitutions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await substitutionService.getAllSubstitutions(
        missingIngredients,
        recipe,
        kitchenIngredients,
        servings,
        originalServings
      );
      
      const validatedResults = results.map(result => {
        const { valid, invalid, allWarnings } = validateAllSubstitutions(result.options, kitchenIngredientNames);
        
        if (invalid.length > 0) {
          console.warn('Invalid substitutions filtered out:', invalid);
        }
        
        return {
          ...result,
          options: valid,
        };
      }).filter(r => r.options.length > 0);

      if (validatedResults.length === 0) {
        setError('No reliable substitutions found for your missing ingredients with your current kitchen.');
      } else {
        setSubstitutionResults(validatedResults);
        
        // Auto-select first option for each missing ingredient
        const initialSelections = {};
        validatedResults.forEach(result => {
          if (result.options.length > 0) {
            initialSelections[result.missingIngredient.ingredientId] = result.options[0].id;
          }
        });
        setSelectedOptions(initialSelections);
      }
      
      setCurrentStep('selecting');
    } catch (err) {
      console.error('Substitution fetch error:', err);
      setError('Failed to generate substitutions. Please try again.');
      setCurrentStep('selecting');
    } finally {
      setIsLoading(false);
    }
  }, [missingIngredients, recipe, kitchenIngredients, servings, originalServings, kitchenIngredientNames]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('loading');
      setSubstitutionResults([]);
      setSelectedOptions({});
      setError(null);
      setAdaptedRecipe(null);
      fetchSubstitutions();
    }
  }, [isOpen, fetchSubstitutions]);

  const handleOptionSelect = (missingIngredientId, optionId) => {
    setSelectedOptions(prev => ({ ...prev, [missingIngredientId]: optionId }));
  };

  const generateAdaptedRecipe = () => {
    const selectedSubstitutions = substitutionResults.map(result => {
      const selectedOptionId = selectedOptions[result.missingIngredient.ingredientId];
      const selectedOption = result.options.find(o => o.id === selectedOptionId);
      return { ...result, selectedOption };
    }).filter(r => r.selectedOption);

    // Build adapted ingredients
    const originalIngredients = recipe.recipe_ingredients || [];
    const adaptedIngredients = originalIngredients.map(ri => {
      const ingredientId = ri.ingredient?.id || ri.ingredient_id;
      const substitution = selectedSubstitutions.find(s => s.missingIngredient.ingredientId === ingredientId);
      
      if (substitution && substitution.selectedOption) {
        const opt = substitution.selectedOption;
        return {
          ...ri,
          isSubstituted: true,
          originalIngredient: {
            name: ri.ingredient?.name || ri.name,
            quantity: ri.quantity,
            unit: ri.unit,
          },
          substitutedWith: opt.ingredients,
          substitutionReason: opt.reason,
          confidence: opt.confidence,
        };
      }
      
      const isMissing = missingIngredients.some(m => m.ingredientId === ingredientId);
      return {
        ...ri,
        isMissing: isMissing && !substitution,
      };
    });

    // Build adapted steps (for now, mark affected steps)
    const originalSteps = recipe.recipe_steps || [];
    const affectedIngredients = selectedSubstitutions.map(s => s.missingIngredient.ingredientId);
    
    const adaptedSteps = originalSteps.map(step => {
      const affectsSubstituted = affectedIngredients.some(id => 
        step.instruction.toLowerCase().includes(
          missingIngredients.find(m => m.ingredientId === id)?.name.toLowerCase() || ''
        )
      );
      
      return {
        ...step,
        isAdapted: affectsSubstituted,
        originalInstruction: affectsSubstituted ? step.instruction : undefined,
        adaptedInstruction: affectsSubstituted 
          ? generateAdaptedInstruction(step.instruction, selectedSubstitutions)
          : step.instruction,
      };
    });

    const adapted = {
      ...recipe,
      adaptedIngredients,
      adaptedSteps,
      substitutions: selectedSubstitutions,
      servings,
      adaptedAt: new Date().toISOString(),
    };

    setAdaptedRecipe(adapted);
    setCurrentStep('review');
  };

  function generateAdaptedInstruction(original, substitutions) {
    let adapted = original;
    substitutions.forEach(sub => {
      const missingName = sub.missingIngredient.name;
      const replacementNames = sub.selectedOption.ingredients.map(i => i.name).join(' + ');
      const regex = new RegExp(`\\b${missingName}\\b`, 'gi');
      adapted = adapted.replace(regex, `${replacementNames} (substituted for ${missingName})`);
    });
    return adapted;
  }

  const handleApplyAdaptations = () => {
    if (!adaptedRecipe) return;
    
    const adaptedState = {
      recipeId: recipe.id,
      originalRecipe: recipe,
      substitutions: adaptedRecipe.substitutions,
      adaptedIngredients: adaptedRecipe.adaptedIngredients,
      adaptedSteps: adaptedRecipe.adaptedSteps,
      servings,
      updatedAt: new Date().toISOString(),
    };

    substitutionService.saveAdaptedRecipe(adaptedState);
    onAdaptComplete(adaptedState);
    onClose();
    setCurrentStep('complete');
  };

  const handleReset = () => {
    substitutionService.clearAdaptedRecipe(recipe.id);
    setCurrentStep('selecting');
    setAdaptedRecipe(null);
  };

  if (!isOpen) return null;

  const totalMissing = missingIngredients.length;
  const substitutedCount = Object.keys(selectedOptions).length;
  const allHaveOptions = substitutionResults.length === missingIngredients.filter(m => !m.isOptional).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" className="max-h-[90vh]">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-warm-200 dark:border-charcoal-800 sticky top-0 bg-white/95 dark:bg-charcoal-950/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900 dark:text-warm-100">Adapt Recipe</h2>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-400">{recipe.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Step {currentStep === 'loading' ? 1 : currentStep === 'selecting' ? 2 : currentStep === 'review' ? 3 : 4} of 3
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {currentStep === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
              <p className="mt-4 text-charcoal-600 dark:text-charcoal-400">Analyzing your kitchen...</p>
              <p className="text-sm text-charcoal-400 dark:text-charcoal-500 mt-1">Finding the best substitutions</p>
            </div>
          )}

          {currentStep === 'selecting' && !isLoading && (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                  <Button variant="outline" leftIcon={<RefreshCw className="h-4 w-4" />} className="mt-3" onClick={fetchSubstitutions}>
                    Try Again
                  </Button>
                </div>
              )}

              {!error && substitutionResults.length === 0 && (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal-900 dark:text-warm-100 mb-2">
                    No Reliable Substitutions Found
                  </h3>
                  <p className="text-charcoal-500 dark:text-charcoal-400 mb-4 max-w-md mx-auto">
                    We couldn't find safe substitutions for your missing ingredients with what you have in your kitchen.
                  </p>
                  <Button variant="primary" onClick={onClose}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Recipe
                  </Button>
                </div>
              )}

              {substitutionResults.length > 0 && (
                <div className="space-y-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-2">
                      Missing Ingredients ({missingIngredients.filter(m => !m.isOptional).length})
                    </h3>
                    <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                      Select a substitution for each missing ingredient. We'll show you the best options based on what you have.
                    </p>
                  </div>

                  {substitutionResults.map((result, index) => (
                    <div key={result.missingIngredient.ingredientId} className="card p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-charcoal-900 dark:text-warm-100">
                              {result.missingIngredient.name}
                            </p>
                            <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                              Needed: {result.missingIngredient.quantity} {result.missingIngredient.unit}
                              {result.missingIngredient.preparation && ` (${result.missingIngredient.preparation})`}
                            </p>
                          </div>
                        </div>
                        {result.options.length > 1 && (
                          <span className="text-xs text-charcoal-500 dark:text-charcoal-400">
                            {result.options.length} option{result.options.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {result.options.map(option => (
                          <SubstitutionOptionCard
                            key={option.id}
                            option={option}
                            isSelected={selectedOptions[result.missingIngredient.ingredientId] === option.id}
                            onSelect={() => handleOptionSelect(result.missingIngredient.ingredientId, option.id)}
                            missingIngredientName={result.missingIngredient.name}
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-4 border-t border-warm-200 dark:border-charcoal-800 sticky bottom-0 bg-white/95 dark:bg-charcoal-950/95 backdrop-blur">
                    <div className="text-sm text-charcoal-500 dark:text-charcoal-400">
                      {substitutedCount}/{missingIngredients.filter(m => !m.isOptional).length} ingredients substituted
                    </div>
                    <Button 
                      size="lg"
                      onClick={generateAdaptedRecipe}
                      disabled={!allHaveOptions || substitutedCount === 0}
                    >
                      <ArrowRight className="h-4 w-4" />
                      Review Adapted Recipe
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {currentStep === 'review' && adaptedRecipe && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-300">
                  Your adapted recipe is ready!
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-3">Adapted Ingredients</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {adaptedRecipe.adaptedIngredients.map((ing, index) => (
                    <div 
                      key={ing.id || index} 
                      className={`p-3 rounded-xl flex items-center gap-3 transition-colors ${
                        ing.isSubstituted 
                          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                          : ing.isMissing
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                          : 'bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700'
                      }`}
                    >
                      {ing.isSubstituted && (
                        <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold">
                          🔄
                        </span>
                      )}
                      {ing.isMissing && !ing.isSubstituted && (
                        <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                          <X className="h-4 w-4" />
                        </span>
                      )}
                      {!ing.isSubstituted && !ing.isMissing && (
                        <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal-900 dark:text-warm-100 truncate">
                          {ing.isSubstituted 
                            ? `${ing.substitutedWith?.map((s) => `${s.quantity} ${s.unit} ${s.name}`).join(' + ')}`
                            : `${ing.quantity} ${ing.unit} ${ing.ingredient?.name || ing.name}`}
                        </p>
                        {ing.isSubstituted && (
                          <p className="text-xs text-primary-600 dark:text-primary-400">
                            Replaces: {ing.originalIngredient?.quantity} {ing.originalIngredient?.unit} {ing.originalIngredient?.name}
                          </p>
                        )}
                        {ing.isMissing && !ing.isSubstituted && (
                          <p className="text-xs text-red-600 dark:text-red-400">Still missing - no substitution selected</p>
                        )}
                      </div>
                      {ing.isSubstituted && (
                        <ConfidenceBadge 
                          confidence={ing.confidence} 
                          confidenceScore={ing.confidence === 'high' ? 0.9 : ing.confidence === 'medium' ? 0.7 : 0.5}
                          size="sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-3">Adapted Steps</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {adaptedRecipe.adaptedSteps.map((step, index) => (
                    <div 
                      key={step.id || index} 
                      className={`p-3 rounded-xl flex gap-3 ${
                        step.isAdapted 
                          ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                          : 'bg-warm-50 dark:bg-charcoal-800'
                      }`}
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                        {step.step_number || index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-charcoal-700 dark:text-warm-200">
                          {step.adaptedInstruction || step.instruction}
                        </p>
                        {step.isAdapted && step.originalInstruction && (
                          <details className="mt-2">
                            <summary className="text-xs text-charcoal-500 dark:text-charcoal-400 cursor-pointer">
                              Show original instruction
                            </summary>
                            <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1 line-through">
                              {step.originalInstruction}
                            </p>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {adaptedRecipe.substitutions.some((s) => s.selectedOption.confidence === 'low') && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Some substitutions have low confidence</span>
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    The dish may turn out differently than the original. Consider getting the exact ingredients for best results.
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal-900 dark:text-warm-100 mb-2">
                Recipe Adapted Successfully!
              </h3>
              <p className="text-charcoal-500 dark:text-charcoal-400 mb-6">
                Your adapted recipe has been saved. You can now cook with your substitutions.
              </p>
              <Button size="lg" onClick={onClose}>
                Start Cooking
              </Button>
            </div>
          )}
        </div>

        {currentStep !== 'loading' && currentStep !== 'complete' && (
          <div className="flex items-center justify-between p-4 border-t border-warm-200 dark:border-charcoal-800 sticky bottom-0 bg-white/95 dark:bg-charcoal-950/95 backdrop-blur">
            <Button variant="ghost" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            {currentStep === 'review' && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset} leftIcon={<RefreshCw className="h-4 w-4" />}>
                  Reset
                </Button>
                <Button size="lg" onClick={handleApplyAdaptations}>
                  <Check className="h-4 w-4" />
                  Apply Adaptations
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}