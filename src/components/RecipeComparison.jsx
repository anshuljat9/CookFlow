import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, RotateCcw, Sparkles, ChefHat } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import AdaptedIngredientList from './AdaptedIngredientList';
import Button from './Button';

export default function RecipeComparison({ 
  originalRecipe, 
  adaptedRecipe, 
  onReset, 
  _onStartCooking 
}) {
  const [view, setView] = useState('adapted');

  const originalIngredients = originalRecipe.recipe_ingredients || [];
  const adaptedIngredients = adaptedRecipe.adaptedIngredients || [];

  const substitutedCount = adaptedIngredients.filter(i => i.isSubstituted).length;
  const missingCount = adaptedIngredients.filter(i => i.isMissing && !i.isSubstituted).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-charcoal-900 dark:text-warm-100">
            {view === 'adapted' ? 'Adapted Recipe' : view === 'original' ? 'Original Recipe' : 'Comparison'}
          </h2>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
            {view === 'adapted' && `${substitutedCount} substitution${substitutedCount !== 1 ? 's' : ''} applied${missingCount > 0 ? `, ${missingCount} still missing` : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={view === 'adapted' ? 'primary' : 'ghost'} 
            onClick={() => setView('adapted')}
            className="hidden sm:block"
          >
            <Sparkles className="h-4 w-4" />
            Adapted
          </Button>
          <Button 
            variant={view === 'comparison' ? 'primary' : 'ghost'} 
            onClick={() => setView('comparison')}
            className="hidden sm:block"
          >
            Compare
          </Button>
          <Button 
            variant={view === 'original' ? 'primary' : 'ghost'} 
            onClick={() => setView('original')}
            className="hidden sm:block"
          >
            Original
          </Button>
          {view !== 'original' && onReset && (
            <Button variant="outline" size="sm" onClick={onReset} leftIcon={<RotateCcw className="h-4 w-4" />}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 sm:hidden">
        <Button variant={view === 'adapted' ? 'primary' : 'ghost'} onClick={() => setView('adapted')} className="whitespace-nowrap">
          <Sparkles className="h-4 w-4" /> Adapted
        </Button>
        <Button variant={view === 'comparison' ? 'primary' : 'ghost'} onClick={() => setView('comparison')} className="whitespace-nowrap">
          Compare
        </Button>
        <Button variant={view === 'original' ? 'primary' : 'ghost'} onClick={() => setView('original')} className="whitespace-nowrap">
          Original
        </Button>
      </div>

      {view === 'adapted' && (
        <AdaptedIngredientList 
          adaptedIngredients={adaptedIngredients} 
          onReset={onReset}
          showConfidence={true}
        />
      )}

      {view === 'original' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-charcoal-900 dark:text-warm-100">Original Ingredients</h3>
          <div className="space-y-2">
            {originalIngredients.map((ing, index) => (
              <div key={ing.id || index} className="p-3 rounded-xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-900 dark:text-warm-100">
                      {ing.quantity} {ing.unit} {ing.ingredient?.name || ing.name}
                    </p>
                    {ing.is_optional && <span className="text-xs text-charcoal-400 dark:text-charcoal-500">Optional</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'comparison' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-3 flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-charcoal-500" />
                Original
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {originalIngredients.map((ing, index) => {
                  const adapted = adaptedIngredients.find(a => 
                    (a.ingredient?.id || a.ingredient_id) === (ing.ingredient?.id || ing.ingredient_id)
                  );
                  const isSubstituted = adapted?.isSubstituted;
                  const isMissing = adapted?.isMissing && !adapted?.isSubstituted;
                  
                  return (
                    <div 
                      key={ing.id || index} 
                      className={`p-3 rounded-xl flex items-center gap-3 ${
                        isSubstituted ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' :
                        isMissing ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                        'bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700'
                      }`}
                    >
                      {isSubstituted && <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold">🔄</span>}
                      {isMissing && !isSubstituted && <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400"><X className="h-4 w-4" /></span>}
                      {!isSubstituted && !isMissing && <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><Check className="h-4 w-4" /></span>}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal-900 dark:text-warm-100 truncate">
                          {ing.quantity} {ing.unit} {ing.ingredient?.name || ing.name}
                        </p>
                        {isSubstituted && adapted?.substitutedWith && (
                          <p className="text-xs text-primary-600 dark:text-primary-400">
                            → {adapted.substitutedWith.map((s) => `${s.quantity} ${s.unit} ${s.name}`).join(' + ')}
                          </p>
                        )}
                        {isMissing && !isSubstituted && (
                          <p className="text-xs text-red-600 dark:text-red-400">No substitution</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-500" />
                Adapted
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {adaptedIngredients.map((ing, index) => (
                  <div 
                    key={ing.id || index} 
                    className={`p-3 rounded-xl flex items-center gap-3 ${
                      ing.isSubstituted ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' :
                      ing.isMissing && !ing.isSubstituted ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                      'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    }`}
                  >
                    {ing.isSubstituted && <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold">🔄</span>}
                    {ing.isMissing && !ing.isSubstituted && <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400"><X className="h-4 w-4" /></span>}
                    {!ing.isSubstituted && !ing.isMissing && <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><Check className="h-4 w-4" /></span>}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal-900 dark:text-warm-100 truncate">
                        {ing.isSubstituted 
                          ? ing.substitutedWith?.map((s) => `${s.quantity} ${s.unit} ${s.name}`).join(' + ')
                          : `${ing.quantity} ${ing.unit} ${ing.ingredient?.name || ing.name}`}
                      </p>
                      {ing.isSubstituted && (
                        <p className="text-xs text-primary-600 dark:text-primary-400">
                          Replaces: {ing.originalIngredient?.quantity} {ing.originalIngredient?.unit} {ing.originalIngredient?.name}
                        </p>
                      )}
                      {ing.isMissing && !ing.isSubstituted && (
                        <p className="text-xs text-red-600 dark:text-red-400">Still missing</p>
                      )}
                    </div>
                    {ing.isSubstituted && ing.confidence && (
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
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-warm-200 dark:border-charcoal-800">
        <Button 
          variant="outline" 
          onClick={onReset}
          leftIcon={<RotateCcw className="h-4 w-4" />}
          className="flex-1"
        >
          Reset to Original
        </Button>
        <Link to={`/cook/${adaptedRecipe.id || originalRecipe.id}`}>
          <Button size="lg" leftIcon={<ChefHat className="h-5 w-5" />} className="flex-1 sm:flex-none">
            Start Cooking
          </Button>
        </Link>
      </div>
    </div>
  );
}