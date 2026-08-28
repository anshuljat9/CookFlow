import { X, Pause, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function CookModeHeader({
  recipeTitle,
  currentStep,
  totalSteps,
  progress,
  onExit,
  onPause,
  onResume,
  paused,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-charcoal-950/95 backdrop-blur-sm border-b border-charcoal-800">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-2 rounded-xl text-charcoal-300 hover:text-white hover:bg-charcoal-800 transition-colors lg:p-3"
              aria-label="Exit cooking mode"
            >
              <X className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>
            
            <div className="hidden lg:block">
              <h1 className="text-lg lg:text-xl font-semibold truncate max-w-md">{recipeTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center gap-2">
              <div className="w-32 h-2 bg-charcoal-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Cooking progress"
                />
              </div>
              <span className="text-sm text-charcoal-400 w-20 text-right font-mono">
                {currentStep + 1} / {totalSteps}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {paused ? (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                  onClick={onResume}
                  className="lg:hidden"
                >
                  Resume
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPause}
                  className="p-2 rounded-xl text-charcoal-300 hover:text-white hover:bg-charcoal-800"
                  aria-label="Pause cooking"
                >
                  <Pause className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:hidden border-t border-charcoal-800 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="text-sm font-medium text-white truncate">{recipeTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-charcoal-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-charcoal-400 font-mono w-16 text-right">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}