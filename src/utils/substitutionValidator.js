const VALID_CONFIDENCES = ['high', 'medium', 'low'];

export function validateSubstitutionOption(option, availableIngredientNames) {
  const errors = [];
  const warnings = [];

  if (!option) {
    return { isValid: false, errors: ['Option is null or undefined'], warnings: [] };
  }

  if (!option.id) {
    errors.push('Missing option id');
  }

  if (!Array.isArray(option.ingredients) || option.ingredients.length === 0) {
    errors.push('Ingredients must be a non-empty array');
  } else {
    option.ingredients.forEach((ing, index) => {
      if (!ing.name || typeof ing.name !== 'string') {
        errors.push(`Ingredient ${index}: missing or invalid name`);
      } else if (!availableIngredientNames.some(avail => avail.toLowerCase() === ing.name.toLowerCase())) {
        errors.push(`Ingredient "${ing.name}" not found in user's kitchen`);
      }
      if (typeof ing.quantity !== 'number' || ing.quantity <= 0) {
        errors.push(`Ingredient "${ing.name}": quantity must be a positive number`);
      }
      if (!ing.unit || typeof ing.unit !== 'string') {
        errors.push(`Ingredient "${ing.name}": missing unit`);
      }
    });
  }

  if (!VALID_CONFIDENCES.includes(option.confidence)) {
    errors.push(`Invalid confidence: "${option.confidence}". Must be one of: ${VALID_CONFIDENCES.join(', ')}`);
  }

  if (typeof option.confidenceScore !== 'number' || option.confidenceScore < 0 || option.confidenceScore > 1) {
    errors.push('confidenceScore must be a number between 0 and 1');
  }

  if (!option.reason || typeof option.reason !== 'string' || option.reason.trim().length < 10) {
    errors.push('Reason must be a descriptive string (at least 10 characters)');
  }

  if (!option.tasteImpact || typeof option.tasteImpact !== 'string' || option.tasteImpact.trim().length === 0) {
    errors.push('tasteImpact is required');
  }

  if (!option.textureImpact || typeof option.textureImpact !== 'string' || option.textureImpact.trim().length === 0) {
    errors.push('textureImpact is required');
  }

  if (!Array.isArray(option.warnings)) {
    errors.push('warnings must be an array');
  }

  if (option.source && !['database', 'ai'].includes(option.source)) {
    warnings.push(`Unknown source: "${option.source}". Expected 'database' or 'ai'`);
  }

  if (option.confidence === 'high' && option.confidenceScore < 0.8) {
    warnings.push('High confidence but score below 0.80');
  }

  if (option.confidence === 'medium' && (option.confidenceScore < 0.6 || option.confidenceScore >= 0.8)) {
    warnings.push('Medium confidence but score outside 0.60-0.79 range');
  }

  if (option.confidence === 'low' && option.confidenceScore >= 0.6) {
    warnings.push('Low confidence but score 0.60 or above');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateAllSubstitutions(options, availableIngredientNames) {
  const valid = [];
  const invalid = [];
  const allWarnings = [];

  for (const option of options) {
    const result = validateSubstitutionOption(option, availableIngredientNames);
    allWarnings.push(...result.warnings);
    
    if (result.isValid) {
      valid.push(option);
    } else {
      invalid.push({ option, errors: result.errors });
    }
  }

  return { valid, invalid, allWarnings };
}

export function sanitizeSubstitutionOption(option) {
  return {
    ...option,
    ingredients: option.ingredients.map(ing => ({
      name: ing.name?.trim() || '',
      quantity: Math.max(0.01, Number(ing.quantity) || 0.01),
      unit: ing.unit?.trim() || 'unit',
      preparation: ing.preparation?.trim(),
      ingredientId: ing.ingredientId?.trim(),
    })).filter(ing => ing.name),
    confidence: VALID_CONFIDENCES.includes(option.confidence) ? option.confidence : 'low',
    confidenceScore: Math.max(0, Math.min(1, Number(option.confidenceScore) || 0.5)),
    reason: option.reason?.trim() || 'No reason provided',
    tasteImpact: option.tasteImpact?.trim() || 'Impact unknown',
    textureImpact: option.textureImpact?.trim() || 'Impact unknown',
    warnings: Array.isArray(option.warnings) ? option.warnings.map(w => w?.trim()).filter(Boolean) : [],
    source: ['database', 'ai'].includes(option.source) ? option.source : 'unknown',
  };
}