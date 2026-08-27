import { Sparkles, Film, Image, Upload, Loader2, CheckCircle2, AlertCircle, Circle, RotateCcw } from 'lucide-react';

/**
 * AnalysisProgress component for showing extraction progress
 * @param {Object} props
 * @param {string} props.currentStage - Current stage label
 * @param {number} props.progressPercent - Progress percentage (0-100)
 * @param {Array} [props.stages] - Array of stage objects
 * @param {Function} [props.onCancel] - Cancel callback
 * @param {boolean} [props.showCancel=true] - Show cancel button
 */
const DEFAULT_STAGES = [
  { id: 'fetching', label: 'Fetching video data', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'extracting_audio', label: 'Extracting audio transcript', icon: <Film className="h-5 w-5" /> },
  { id: 'extracting_frames', label: 'Analyzing video frames', icon: <Image className="h-5 w-5" /> },
  { id: 'analyzing', label: 'AI recipe analysis', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'validating', label: 'Validating extraction', icon: <Upload className="h-5 w-5" /> },
];

export default function AnalysisProgress({
  currentStage,
  progressPercent,
  stages = DEFAULT_STAGES,
  onCancel,
  showCancel = true,
}) {
  return (
    <div className="card p-6 sm:p-8 animate-slide-up" role="status" aria-live="polite">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal-900 dark:text-warm-100 mb-2">Analyzing your recipe...</h2>
        <p className="text-charcoal-500 dark:text-charcoal-400">{currentStage}</p>
        <div className="mt-4 h-2 bg-warm-200 dark:bg-charcoal-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Analysis progress"
          />
        </div>
        <p className="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400 font-mono">{progressPercent}%</p>
      </div>

      <div className="space-y-3" role="list" aria-label="Analysis progress steps">
        {stages.map((stage, index) => {
          const isComplete = stages.findIndex(s => s.id === currentStage) > index;
          const isCurrent = stage.id === currentStage;
          
          let status = 'pending';
          if (isComplete) status = 'complete';
          else if (isCurrent) status = 'current';

          return (
            <div key={stage.id} className="flex items-center gap-4 p-3 rounded-xl transition-colors" role="listitem">
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                status === 'complete' ? 'bg-green-100 dark:bg-green-900/30' :
                status === 'current' ? 'bg-primary-100 dark:bg-primary-900/30 animate-pulse' :
                'bg-warm-100 dark:bg-charcoal-800'
              }`}>
                {status === 'complete' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : status === 'current' ? (
                  <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                ) : (
                  <span className="text-charcoal-300 dark:text-charcoal-600">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${status === 'current' ? 'text-charcoal-900 dark:text-warm-100' : 'text-charcoal-700 dark:text-warm-200'}`}>
                  {stage.label}
                </p>
                <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
                  {status === 'complete' ? 'Completed' : status === 'current' ? 'In progress...' : 'Waiting'}
                </p>
              </div>
              <span className={`text-sm font-medium ${status === 'complete' ? 'text-green-600' : status === 'current' ? 'text-primary-600' : 'text-charcoal-400'}`}>
                {status === 'complete' ? '✓' : status === 'current' ? '●' : '○'}
              </span>
            </div>
          );
        })}
      </div>

      {showCancel && onCancel && (
        <div className="mt-6 pt-6 border-t border-warm-200 dark:border-charcoal-800 text-center">
          <button
            onClick={onCancel}
            className="text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-700 dark:hover:text-warm-200 font-medium text-sm flex items-center justify-center gap-1 mx-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Cancel Analysis
          </button>
        </div>
      )}
    </div>
  );
}