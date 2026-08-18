export default function RecipeDetailSkeleton() {
  return (
    <div className="animate-fade-in" aria-busy="true" aria-label="Loading recipe details">
      <div className="container-custom py-6 sm:py-8">
        <div className="animate-pulse h-10 w-48 rounded bg-warm-200 dark:bg-charcoal-700 mb-6" />
        
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6">
          <div className="animate-pulse h-full w-full bg-warm-200 dark:bg-charcoal-700" />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="animate-pulse h-8 w-24 rounded-full bg-warm-200 dark:bg-charcoal-700" />
          <div className="animate-pulse h-8 w-20 rounded-full bg-warm-200 dark:bg-charcoal-700" />
          <div className="animate-pulse h-8 w-28 rounded-full bg-warm-200 dark:bg-charcoal-700" />
        </div>
        
        <div className="animate-pulse h-10 w-3/4 rounded bg-warm-200 dark:bg-charcoal-700 mb-3" />
        <div className="animate-pulse h-6 w-full rounded bg-warm-200 dark:bg-charcoal-700 mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-5 md:col-span-1">
            <div className="animate-pulse h-8 w-32 rounded bg-warm-200 dark:bg-charcoal-700 mb-4" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="animate-pulse h-4 w-24 rounded bg-warm-200 dark:bg-charcoal-700" />
                  <div className="animate-pulse h-4 w-20 rounded bg-warm-200 dark:bg-charcoal-700" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="card p-5 md:col-span-2">
            <div className="animate-pulse h-8 w-32 rounded bg-warm-200 dark:bg-charcoal-700 mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="animate-pulse h-8 w-8 rounded-full bg-warm-200 dark:bg-charcoal-700 flex-shrink-0" />
                  <div className="animate-pulse h-6 w-full rounded bg-warm-200 dark:bg-charcoal-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <section className="card p-5">
            <div className="animate-pulse h-8 w-40 rounded bg-warm-200 dark:bg-charcoal-700 mb-4" />
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl">
                  <div className="animate-pulse h-4 w-4 rounded bg-warm-200 dark:bg-charcoal-700" />
                  <div className="animate-pulse h-4 w-3/4 rounded bg-warm-200 dark:bg-charcoal-700 flex-1" />
                </div>
              ))}
            </div>
          </section>
          
          <section className="card p-5 bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-800/50">
            <div className="animate-pulse h-8 w-40 rounded bg-warm-200 dark:bg-charcoal-700 mb-4" />
            <div className="animate-pulse h-4 w-full rounded bg-warm-200 dark:bg-charcoal-700 mb-2" />
            <div className="animate-pulse h-4 w-2/3 rounded bg-warm-200 dark:bg-charcoal-700 mb-4" />
            <div className="animate-pulse h-10 w-48 rounded-xl bg-warm-200 dark:bg-charcoal-700" />
          </section>
        </div>
        
        <div className="flex flex-wrap gap-4 animate-pulse">
          <div className="h-12 w-48 rounded-xl bg-warm-200 dark:bg-charcoal-700" />
          <div className="h-12 w-32 rounded-xl bg-warm-200 dark:bg-charcoal-700" />
          <div className="h-12 w-24 rounded-xl bg-warm-200 dark:bg-charcoal-700" />
        </div>
      </div>
    </div>
  );
}