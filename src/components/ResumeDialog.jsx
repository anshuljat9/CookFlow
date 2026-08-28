import { RotateCcw, Clock, AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ResumeDialog({
  isOpen,
  onClose,
  onResume,
  onStartOver,
  currentStep,
  totalSteps,
  pausedAt,
}) {
  if (!isOpen) return null;

  const pauseDuration = pausedAt ? Date.now() - pausedAt : 0;
  const pauseMinutes = Math.floor(pauseDuration / 60000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="card bg-charcoal-900 border-charcoal-800 w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-900/30 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Cooking Paused</h2>
            <p className="text-charcoal-400 text-sm">You were on step {currentStep + 1} of {totalSteps}</p>
          </div>
        </div>

        <p className="text-charcoal-300 mb-6">
          Your progress has been saved. You can resume from where you left off or start over.
        </p>

        {pauseMinutes > 0 && (
          <div className="mb-6 p-3 rounded-xl bg-charcoal-800 flex items-center gap-2">
            <Clock className="h-5 w-5 text-charcoal-400" />
            <span className="text-sm text-charcoal-300">
              Paused for {pauseMinutes} minute{pauseMinutes !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            variant="primary" 
            size="lg"
            leftIcon={<RotateCcw className="h-5 w-5" />}
            onClick={onResume}
            className="w-full"
          >
            Resume Cooking
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onStartOver}
            className="w-full"
          >
            Start Over
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="w-full text-charcoal-400 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}