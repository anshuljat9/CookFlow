import { RotateCcw, AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ExitConfirmDialog({
  isOpen,
  onClose,
  onPauseExit,
  onExit,
  currentStep,
  totalSteps,
  recipeTitle,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="card bg-charcoal-900 border-charcoal-800 w-full max-w-md p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-900/30 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Exit Cooking Mode?</h2>
            <p className="text-charcoal-400 text-sm">{recipeTitle} — Step {currentStep + 1} of {totalSteps}</p>
          </div>
        </div>

        <p className="text-charcoal-300 mb-6">
          Your cooking progress will be saved automatically. You can resume from step {currentStep + 1} later.
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            variant="primary" 
            size="lg"
            onClick={onPauseExit}
            className="w-full"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Pause & Exit
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onExit}
            className="w-full"
          >
            Exit Without Saving
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="w-full"
          >
            Keep Cooking
          </Button>
        </div>
      </div>
    </div>
  );
}