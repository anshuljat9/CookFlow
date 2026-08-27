import { useState, useCallback, useMemo } from 'react';
import { Check, AlertTriangle, AlertCircle, Info, Sparkles, Utensils, Clock, Users, RotateCcw, Trash2, Plus, Minus, GripVertical, ChevronDown, ChevronUp, Eye, Edit2, Save, X } from 'lucide-react';
import Button from './Button';
import ConfidenceBadge from './ConfidenceBadge';

/**
 * RecipePreview component for reviewing and editing extracted recipes
 * @param {Object} props
 * @param {Object} props.data - Extracted recipe data
 * @param {Function} props.onSave - Save callback
 * @param {Function} props.onCancel - Cancel callback
 * @param {Function} [props.onAnalyzeAgain] - Re-analyze callback
 * @param {boolean} [props.isSaving=false] - Whether saving is in progress
 */
const SOURCE_LABELS = {
  transcript: 'Spoken',
  ocr: 'On-screen text',
  visual: 'Visual',
  caption: 'Caption',
  inferred: 'Inferred',
};

const SOURCE_ICONS = {
  transcript: '🎤',
  ocr: '📝',
  visual: '👁️',
  caption: '📄',
  inferred: '🤖',
};

const CONFIDENCE_THRESHOLDS = {
  high: 0.80,
  medium: 0.60,
  low: 0,
};

function getConfidenceLevel(score) {
  if (score >= CONFIDENCE_THRESHOLDS.high) return 'high';
  if (score >= CONFIDENCE_THRESHOLDS.medium) return 'medium';
  return 'low';
}

function formatDuration(seconds) {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export default function RecipePreview({
  data,
  onSave,
  onCancel,
  onAnalyzeAgain,
  isSaving = false,
}) {
  const [ingredients, setIngredients] = useState(data.ingredients);
  const [steps, setSteps] = useState(data.steps);
  const [dishName, setDishName] = useState(data.dish.name);
  const [description, setDescription] = useState(data.dish.description);
  const [cuisine, setCuisine] = useState(data.dish.cuisine || '');
  const [category, setCategory] = useState(data.dish.category || '');
  const [servings, setServings] = useState(data.servings || 1);
  const [prepTime, setPrepTime] = useState(data.prepTimeMinutes || 0);
  const [cookTime, setCookTime] = useState(data.cookTimeMinutes || 0);
  const [showConflicts, setShowConflicts] = useState(data.conflicts.length > 0);
  const [showWarnings, setShowWarnings] = useState(data.warnings.length > 0);
  const [showUncertain, setShowUncertain] = useState(data.uncertainItems.length > 0);

  const overallConfidence = useMemo(() => getConfidenceLevel(data.overallConfidenceScore), [data.overallConfidenceScore]);
  const dishConfidence = useMemo(() => getConfidenceLevel(data.dish.confidenceScore), [data.dish.confidenceScore]);

  const updateIngredient = useCallback((index, updates) => {
    setIngredients(prev => prev.map((ing, i) => i === index ? { ...ing, ...updates } : ing));
  }, []);

  const updateStep = useCallback((index, updates) => {
    setSteps(prev => prev.map((step, i) => i === index ? { ...step, ...updates } : step));
  }, []);

  const addIngredient = useCallback(() => {
    setIngredients(prev => [...prev, {
      name: '',
      quantity: null,
      unit: '',
      preparation: null,
      confidenceScore: 0.5,
      source: 'inferred',
      isOptional: false,
      _editing: true,
      _tempName: '',
      _tempQuantity: '',
      _tempUnit: '',
      _tempPreparation: '',
    }]);
  }, []);

  const removeIngredient = useCallback((index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addStep = useCallback(() => {
    setSteps(prev => [...prev, {
      stepNumber: prev.length + 1,
      instruction: '',
      durationSeconds: null,
      temperature: null,
      tip: null,
      confidenceScore: 0.5,
      source: 'inferred',
      _editing: true,
      _tempInstruction: '',
      _tempDuration: '',
      _tempTemperature: '',
      _tempTip: '',
    }]);
  }, []);

  const removeStep = useCallback((index) => {
    setSteps(prev => prev.filter((_, i) => i !== index).map((step, i) => ({ ...step, stepNumber: i + 1 })));
  }, []);

  const moveStep = useCallback((fromIndex, toIndex) => {
    setSteps(prev => {
      const newSteps = [...prev];
      const [removed] = newSteps.splice(fromIndex, 1);
      newSteps.splice(toIndex, 0, removed);
      return newSteps.map((step, i) => ({ ...step, stepNumber: i + 1 }));
    });
  }, []);

  const startEditIngredient = useCallback((index) => {
    const ing = ingredients[index];
    updateIngredient(index, {
      _editing: true,
      _tempName: ing.name,
      _tempQuantity: ing.quantity?.toString() || '',
      _tempUnit: ing.unit || '',
      _tempPreparation: ing.preparation || '',
    });
  }, [ingredients, updateIngredient]);

  const saveEditIngredient = useCallback((index) => {
    const ing = ingredients[index];
    const quantity = ing._tempQuantity ? parseFloat(ing._tempQuantity) : null;
    updateIngredient(index, {
      _editing: false,
      name: ing._tempName || ing.name,
      quantity: isNaN(quantity) ? null : quantity,
      unit: ing._tempUnit || ing.unit,
      preparation: ing._tempPreparation || ing.preparation,
    });
  }, [ingredients, updateIngredient]);

  const cancelEditIngredient = useCallback((index) => {
    updateIngredient(index, { _editing: false });
  }, [updateIngredient]);

  const startEditStep = useCallback((index) => {
    const step = steps[index];
    updateStep(index, {
      _editing: true,
      _tempInstruction: step.instruction,
      _tempDuration: step.durationSeconds?.toString() || '',
      _tempTemperature: step.temperature || '',
      _tempTip: step.tip || '',
    });
  }, [steps, updateStep]);

  const saveEditStep = useCallback((index) => {
    const step = steps[index];
    const duration = step._tempDuration ? parseInt(step._tempDuration) : null;
    updateStep(index, {
      _editing: false,
      instruction: step._tempInstruction || step.instruction,
      durationSeconds: isNaN(duration) ? null : duration,
      temperature: step._tempTemperature || step.temperature,
      tip: step._tempTip || step.tip,
    });
  }, [steps, updateStep]);

  const cancelEditStep = useCallback((index) => {
    updateStep(index, { _editing: false });
  }, [updateStep]);

  const buildUpdatedData = useCallback(() => ({
    ...data,
    dish: {
      ...data.dish,
      name: dishName,
      description,
      cuisine: cuisine || null,
      category: category || null,
    },
    ingredients,
    steps,
    servings,
    prepTimeMinutes: prepTime,
    cookTimeMinutes: cookTime,
  }), [data, dishName, description, cuisine, category, ingredients, steps, servings, prepTime, cookTime]);

  const handleSave = () => {
    onSave(buildUpdatedData());
  };

  const hasLowConfidence = data.overallConfidenceScore < 0.60;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-charcoal-900 dark:text-warm-100 mb-1">{dishName}</h2>
          <div className="flex items-center gap-4 text-sm text-charcoal-500 dark:text-charcoal-400 flex-wrap">
            <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> AI-Generated Draft</span>
            <span className="flex items-center gap-1"><Utensils className="h-3.5 w-3.5" /> Recipe</span>
            <ConfidenceBadge confidence={overallConfidence} confidenceScore={data.overallConfidenceScore} size="md" />
          </div>
        </div>
        <div className="flex-shrink-0 text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${overallConfidence === 'high' ? 'bg-green-100 dark:bg-green-900/30' : overallConfidence === 'medium' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
            <span className={`text-2xl font-bold ${overallConfidence === 'high' ? 'text-green-600 dark:text-green-400' : overallConfidence === 'medium' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {Math.round(data.overallConfidenceScore * 100)}%
            </span>
          </div>
          <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1">Overall Confidence</p>
        </div>
      </div>

      {/* Warnings Banner */}
      {(data.warnings.length > 0 || data.conflicts.length > 0 || data.uncertainItems.length > 0) && (
        <div className="card p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Review Required</span>
          </div>
          <div className="space-y-2 text-sm text-amber-600 dark:text-amber-400">
            {data.warnings.map((w, i) => (
              <p key={i} className="flex items-start gap-1">{w}</p>
            ))}
            {data.conflicts.map((c, i) => (
              <div key={i} className="p-2 bg-white/50 dark:bg-charcoal-800/50 rounded">
                <p className="font-medium mb-1">⚠️ Conflicting: {c.field}</p>
                <div className="text-xs space-y-0.5">
                  {c.sources.map((s, si) => (
                    <span key={si} className="block">{s.source}: {s.value}</span>
                  ))}
                </div>
              </div>
            ))}
            {data.uncertainItems.map((u, i) => (
              <p key={i} className="flex items-start gap-1">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                <span>{u.name}: {u.reason}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Dish Info Editor */}
      <div className="card p-4">
        <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-600" />
          Dish Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Recipe Name</label>
            <input
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              className="input"
              placeholder="e.g., Korean Garlic Noodles"
            />
            <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1">
              Confidence: {Math.round(dishConfidence === 'high' ? data.dish.confidenceScore * 100 : data.dish.confidenceScore * 100)}%
            </p>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[80px]"
              rows={2}
            />
          </div>
          <div>
            <label className="label">Cuisine</label>
            <input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="input"
              placeholder="e.g., Korean, Italian, Mexican"
            />
          </div>
          <div>
            <label className="label">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
              placeholder="e.g., Main, Appetizer, Dessert"
            />
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="card p-4">
        <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary-600" />
          Cooking Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Prep Time (minutes)</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(Math.max(0, parseInt(e.target.value) || 0))}
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="label">Cook Time (minutes)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(Math.max(0, parseInt(e.target.value) || 0))}
              className="input"
              min="0"
            />
          </div>
          <div>
            <label className="label">Servings</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              className="input"
              min="1"
              max="20"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary-600" />
            Ingredients ({ingredients.length})
          </h3>
          <Button variant="outline" size="sm" onClick={addIngredient} leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Add Ingredient
          </Button>
        </div>
        
        <div className="space-y-2">
          {ingredients.map((ing, index) => (
            <div key={index} className={`p-3 rounded-xl transition-colors ${ing._editing ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'bg-warm-50 dark:bg-charcoal-800'}`}>
              {ing._editing ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={ing._tempName || ''}
                      onChange={(e) => updateIngredient(index, { _tempName: e.target.value })}
                      className="input sm:col-span-2"
                      placeholder="Ingredient name"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={ing._tempQuantity || ''}
                      onChange={(e) => updateIngredient(index, { _tempQuantity: e.target.value })}
                      className="input"
                      placeholder="Qty"
                    />
                    <input
                      type="text"
                      value={ing._tempUnit || ''}
                      onChange={(e) => updateIngredient(index, { _tempUnit: e.target.value })}
                      className="input"
                      placeholder="Unit"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={ing._tempPreparation || ''}
                      onChange={(e) => updateIngredient(index, { _tempPreparation: e.target.value })}
                      className="input sm:col-span-1"
                      placeholder="Preparation (e.g., minced, diced)"
                    />
                    <label className="flex items-center gap-2 text-sm text-charcoal-700 dark:text-warm-200">
                      <input
                        type="checkbox"
                        checked={ing.isOptional}
                        onChange={(e) => updateIngredient(index, { isOptional: e.target.checked })}
                        className="rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
                      />
                      Optional
                    </label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => cancelEditIngredient(index)} leftIcon={<X className="h-3.5 w-3.5" />}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => saveEditIngredient(index)} leftIcon={<Save className="h-3.5 w-3.5" />}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal-900 dark:text-warm-100 truncate">
                      {ing.quantity ? `${ing.quantity} ${ing.unit}` : ing.unit ? `${ing.unit}` : ''} {ing.name} {ing.preparation ? `(${ing.preparation})` : ''} {ing.isOptional ? '(optional)' : ''}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <ConfidenceBadge confidence={getConfidenceLevel(ing.confidenceScore)} confidenceScore={ing.confidenceScore} size="sm" />
                      <span className="text-xs text-charcoal-500 dark:text-charcoal-400 flex items-center gap-1">
                        {SOURCE_ICONS[ing.source]} {SOURCE_LABELS[ing.source]}
                      </span>
                      {ing.conflictingInfo && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {ing.conflictingInfo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEditIngredient(index)} aria-label="Edit ingredient">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeIngredient(index)} aria-label="Remove ingredient">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-600" />
            Steps ({steps.length})
          </h3>
          <Button variant="outline" size="sm" onClick={addStep} leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Add Step
          </Button>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className={`p-3 rounded-xl transition-colors ${step._editing ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'bg-warm-50 dark:bg-charcoal-800'}`}>
              {step._editing ? (
                <div className="space-y-2">
                  <textarea
                    value={step._tempInstruction || ''}
                    onChange={(e) => updateStep(index, { _tempInstruction: e.target.value })}
                    className="input min-h-[80px]"
                    rows={3}
                    placeholder="Step instruction"
                    autoFocus
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={step._tempDuration || ''}
                      onChange={(e) => updateStep(index, { _tempDuration: e.target.value })}
                      className="input"
                      placeholder="Duration (seconds)"
                    />
                    <input
                      type="text"
                      value={step._tempTemperature || ''}
                      onChange={(e) => updateStep(index, { _tempTemperature: e.target.value })}
                      className="input"
                      placeholder="Temperature (e.g., 180°C)"
                    />
                    <input
                      type="text"
                      value={step._tempTip || ''}
                      onChange={(e) => updateStep(index, { _tempTip: e.target.value })}
                      className="input"
                      placeholder="Tip (optional)"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => cancelEditStep(index)} leftIcon={<X className="h-3.5 w-3.5" />}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => saveEditStep(index)} leftIcon={<Save className="h-3.5 w-3.5" />}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                    {step.stepNumber}
                  </span>
                  <div className="flex-1">
                    <p className="text-charcoal-700 dark:text-warm-200">{step.instruction}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
                      {step.durationSeconds && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(step.durationSeconds)}
                        </span>
                      )}
                      {step.temperature && (
                        <span className="flex items-center gap-1">🌡 {step.temperature}</span>
                      )}
                      {step.tip && (
                        <span className="flex items-center gap-1">💡 {step.tip}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <ConfidenceBadge confidence={getConfidenceLevel(step.confidenceScore)} confidenceScore={step.confidenceScore} size="sm" />
                      <span className="text-xs text-charcoal-500 dark:text-charcoal-400 flex items-center gap-1">
                        {SOURCE_ICONS[step.source]} {SOURCE_LABELS[step.source]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEditStep(index)} aria-label="Edit step">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => index > 0 && moveStep(index, index - 1)} aria-label="Move up" disabled={index === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => index < steps.length - 1 && moveStep(index, index + 1)} aria-label="Move down" disabled={index === steps.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeStep(index)} aria-label="Remove step">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-warm-200 dark:border-charcoal-800">
        <Button 
          variant="outline" 
          onClick={onCancel}
          leftIcon={<RotateCcw className="h-4 w-4" />}
          className="flex-1 sm:flex-none"
        >
          Discard
        </Button>
        {onAnalyzeAgain && (
          <Button 
            variant="outline" 
            onClick={onAnalyzeAgain}
            leftIcon={<Sparkles className="h-4 w-4" />}
            className="flex-1 sm:flex-none"
          >
            Analyze Again
          </Button>
        )}
        <Button 
          size="lg" 
          onClick={handleSave}
          disabled={isSaving}
          leftIcon={<Save className="h-5 w-5" />}
          className="flex-1 sm:flex-none"
        >
          {isSaving ? 'Saving...' : 'Save Recipe'}
        </Button>
      </div>
    </div>
  );
}