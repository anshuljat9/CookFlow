import { Clock, Loader2, AlertTriangle } from 'lucide-react';
import { formatDuration } from '../utils/recipeUtils';
import Button from './Button';

export default function CurrentStep({
  step,
  stepNumber,
  totalSteps,
  duration,
  temperature,
  tip,
  onTimerStart,
  onReadStep,
  isTimerRunning,
  timerDuration,
  isReading,
  formatTime,
}) {
  const hasTimer = duration && duration > 0;
  
  return (
    <section className="card bg-charcoal-900 border-charcoal-800" aria-labelledby="instruction-heading">
      <div className="p-6 lg:p-8">
        <div className="text-center mb-6 lg:mb-8">
          <p className="text-sm text-charcoal-400 uppercase tracking-wider mb-2">
            Step {stepNumber + 1} of {totalSteps}
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-relaxed whitespace-pre-wrap">
            {step.instruction}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          {hasTimer && (
            <div className="relative w-full sm:w-auto flex-1">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button
                  variant={isTimerRunning ? 'danger' : 'secondary'}
                  size="lg"
                  leftIcon={isTimerRunning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Clock className="h-5 w-5" />}
                  onClick={() => onTimerStart(duration)}
                  className="w-24 sm:w-28"
                >
                  {isTimerRunning ? 'Pause' : `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`}
                </Button>
                
                <div className="text-center flex-1">
                  <p 
                    className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold tabular-nums text-white" 
                    aria-live="polite"
                    role="timer"
                  >
                    {isTimerRunning ? formatTime(timerDuration) : formatDuration(duration)}
                  </p>
                  <p className="text-xs text-charcoal-400">Timer</p>
                </div>

                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<Loader2 className="h-5 w-5" />}
                  onClick={() => onTimerStart(0)}
                  disabled={!isTimerRunning && timerDuration === 0}
                  className="w-20 sm:w-24"
                >
                  Reset
                </Button>
              </div>

              <div className="flex justify-center gap-2 flex-wrap">
                {[30, 60, 120, 180, 300, 600].map(seconds => (
                  <button
                    key={seconds}
                    onClick={() => onTimerStart(seconds)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      timerDuration === seconds && isTimerRunning
                        ? 'bg-primary-600 text-white'
                        : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'
                    }`}
                  >
                    {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasTimer && (
            <div className="w-full sm:w-auto text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal-800 text-charcoal-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm">No timer required</span>
              </div>
            </div>
          )}

          {tip && (
            <div className="w-full sm:w-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-900/30 border border-amber-800/50 text-amber-300">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm max-w-xs truncate">{tip}</span>
              </div>
            </div>
          )}

          {temperature && (
            <div className="w-full sm:w-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal-800 border border-charcoal-700">
                <span className="text-sm text-charcoal-400">🌡</span>
                <span className="text-sm font-medium text-white">{temperature}</span>
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="lg"
          leftIcon={<Loader2 className="h-5 w-5 animate-spin" />}
          onClick={onReadStep}
          disabled={isReading}
          className="w-full sm:w-auto mt-4"
        >
          {isReading ? 'Reading...' : '🔊 Read Step'}
        </Button>
      </div>
    </section>
  );
}