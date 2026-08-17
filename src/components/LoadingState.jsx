export default function LoadingState({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  variant = 'spinner'
}) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  if (variant === 'skeleton') {
    return (
      <div className={`animate-pulse ${className}`} aria-busy="true" aria-label="Loading content">
        <div className="h-48 w-full rounded-2xl bg-warm-200 dark:bg-charcoal-700 mb-4" />
        <div className="h-6 w-3/4 rounded bg-warm-200 dark:bg-charcoal-700 mb-2" />
        <div className="h-4 w-1/2 rounded bg-warm-200 dark:bg-charcoal-700 mb-2" />
        <div className="h-4 w-1/3 rounded bg-warm-200 dark:bg-charcoal-700" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`card p-8 text-center ${className}`} aria-busy="true" aria-label="Loading">
        <div className={`inline-block animate-spin text-primary-600 dark:text-primary-400 mb-4 ${sizes[size]}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-full h-full">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className={`${textSizes[size]} text-charcoal-500 dark:text-charcoal-400`}>{text}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} aria-busy="true" aria-label="Loading">
      <div className={`inline-block animate-spin text-primary-600 dark:text-primary-400 ${sizes[size]}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-full h-full">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      {text && <p className={`${textSizes[size]} text-charcoal-500 dark:text-charcoal-400`}>{text}</p>}
    </div>
  );
}