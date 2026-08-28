import { Clock, Pause, Play, X, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ActiveTimers({
  _timers,
  activeTimers,
  formatTime,
  onPause,
  onResume,
  onCancel,
  onReset,
  activeStepTimerId,
}) {
  const allActiveTimers = activeTimers.filter(t => !t.isComplete);
  
  if (allActiveTimers.length === 0) return null;

  return (
    <section className="card bg-charcoal-900 border-charcoal-800" aria-labelledby="timers-heading">
      <div className="p-4 lg:p-6">
        <h2 id="timers-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary-500" />
          Active Timers ({allActiveTimers.length})
        </h2>
        
        <div className="space-y-3">
          {allActiveTimers.map(timer => (
            <div
              key={timer.id}
              className={`p-4 rounded-xl transition-colors ${
                timer.id === activeStepTimerId
                  ? 'bg-primary-900/20 border border-primary-800/50'
                  : 'bg-charcoal-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${timer.isStepTimer ? 'text-primary-300' : 'text-white'}`}>
                    {timer.label}
                    {timer.isStepTimer && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary-900/50 text-primary-300">
                        Step
                      </span>
                    )}
                  </span>
                  {timer.isComplete && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-900/50 text-green-300">
                      Complete
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  {!timer.isComplete ? (
                    timer.paused ? (
                      <Button
                        variant="primary"
                        size="icon"
                        onClick={() => onResume(timer.id)}
                        className="p-2"
                        aria-label="Resume timer"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => onPause(timer.id)}
                        className="p-2"
                        aria-label="Pause timer"
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )
                  ) : (
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onReset(timer.id)}
                      className="p-2"
                      aria-label="Reset timer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCancel(timer.id)}
                    className="p-2 text-charcoal-400 hover:text-red-400"
                    aria-label="Cancel timer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-3xl font-mono font-bold tabular-nums text-white">
                  {timer.isComplete ? '00:00' : formatTime(timer.duration)}
                </div>
                <div className="h-2 bg-charcoal-700 rounded-full flex-1 mx-4 max-w-xs overflow-hidden">
                  {(() => {
                    const progress = timer.originalDuration > 0 
                      ? ((timer.originalDuration - timer.duration) / timer.originalDuration) * 100 
                      : 0;
                    return (
                      <div
                        className={`h-full transition-all duration-200 ${
                          timer.isComplete ? 'bg-green-500' : 'bg-primary-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}