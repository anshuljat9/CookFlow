export default function RecipeCardSkeleton({ variant = 'default', className = '' }) {
  return (
    <article className={`card ${variant === 'compact' ? 'flex flex-col sm:flex-row' : 'flex flex-col'} ${className}`} aria-busy="true" aria-label="Loading recipe">
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden flex-shrink-0">
        <div className="animate-pulse h-full w-full bg-warm-200 dark:bg-charcoal-700" />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <div className="h-10 w-10 rounded-xl bg-warm-200 dark:bg-charcoal-700 animate-pulse" />
          <div className="h-6 w-16 rounded-full bg-warm-200 dark:bg-charcoal-700 animate-pulse" />
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <div className="h-6 w-20 rounded-full bg-warm-200 dark:bg-charcoal-700 animate-pulse" />
          <div className="h-6 w-16 rounded-full bg-warm-200 dark:bg-charcoal-700 animate-pulse" />
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-5 flex flex-col">
        <div className="flex items-start gap-2 mb-2">
          <div className="h-6 w-20 rounded-full bg-warm-200 dark:bg-charcoal-700 animate-pulse flex-shrink-0" />
          <div className="flex-1 flex items-center gap-1.5">
            <div className="h-4 w-24 rounded bg-warm-200 dark:bg-charcoal-700 animate-pulse" />
            <div className="h-4 w-20 rounded bg-warm-200 dark:bg-charcoal-700 animate-pulse" />
          </div>
        </div>
        <div className="h-6 w-3/4 rounded bg-warm-200 dark:bg-charcoal-700 animate-pulse mb-2" />
        <div className="h-4 w-full rounded bg-warm-200 dark:bg-charcoal-700 animate-pulse mb-2" />
        <div className="h-4 w-2/3 rounded bg-warm-200 dark:bg-charcoal-700 animate-pulse mb-3" />
        <div className="flex flex-wrap gap-1.5">
          <div className="h-6 w-16 rounded-full bg-warm-200 dark:bg-charcoal-700 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-warm-200 dark:bg-charcoal-700 animate-pulse" />
          <div className="h-6 w-16 rounded-full bg-warm-200 dark:bg-charcoal-700 animate-pulse" />
        </div>
      </div>
    </article>
  );
}