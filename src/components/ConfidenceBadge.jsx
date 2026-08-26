export default function ConfidenceBadge({ confidence, confidenceScore, size = 'md' }) {
  const configs = {
    high: {
      label: 'High Confidence',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      icon: '✓',
    },
    medium: {
      label: 'Medium Confidence',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      icon: '○',
    },
    low: {
      label: 'Low Confidence',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      icon: '⚠',
    },
  };

  const config = configs[confidence] || configs.low;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  return (
    <span 
      className={`inline-flex items-center font-semibold rounded-xl ${config.color} ${sizeClasses[size]}`}
      title={`${config.label} (${Math.round(confidenceScore * 100)}%)`}
    >
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
      <span className="opacity-75">({Math.round(confidenceScore * 100)}%)</span>
    </span>
  );
}