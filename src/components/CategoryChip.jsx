import { forwardRef } from 'react';

const CategoryChip = forwardRef(({ 
  label, 
  icon, 
  selected = false, 
  onClick, 
  className = '',
  disabled = false,
  count,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${selected 
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700 focus-visible:ring-primary-500' 
          : 'bg-warm-100 text-charcoal-700 hover:bg-warm-200 active:bg-warm-300 focus-visible:ring-warm-400 dark:bg-charcoal-800 dark:text-warm-200 dark:hover:bg-charcoal-700 dark:active:bg-charcoal-600'
        }
        ${className}
      `}
      {...props}
    >
      {icon && <span aria-hidden="true" className="text-lg">{icon}</span>}
      {label}
      {count !== undefined && (
        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-semibold ${selected ? 'bg-white/20' : 'bg-warm-200 dark:bg-charcoal-700'}`}>
          {count}
        </span>
      )}
    </button>
  );
});

CategoryChip.displayName = 'CategoryChip';

export default CategoryChip;