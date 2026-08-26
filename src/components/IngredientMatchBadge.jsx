import { getMatchQualityColor, getMatchQualityLabel } from '../utils/ingredientMatcher';

export default function IngredientMatchBadge({ matchPercentage, size = 'md', showLabel = true }) {
  if (matchPercentage === undefined || matchPercentage === null) {
    return null;
  }
  
  const colorClass = getMatchQualityColor(matchPercentage);
  const label = getMatchQualityLabel(matchPercentage);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  
  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-semibold rounded-xl ${colorClass} ${sizeClasses[size]}`}
      role="status"
      aria-label={`${matchPercentage}% match, ${label}`}
    >
      <span aria-hidden="true">{matchPercentage}%</span>
      {showLabel && <span>Match</span>}
    </span>
  );
}