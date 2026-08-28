import { CheckCircle2, ChefHat, RotateCcw, Eye, Plus } from 'lucide-react';
import Button from './Button';

export default function CompletionScreen({
  recipeTitle,
  totalSteps,
  completedSteps,
  isAdapted,
  adaptationsUsed,
  note,
  onDone,
  onCookAgain,
  onViewRecipe,
  onAddNote,
  totalTimeSpent,
}) {
  const formatTotalTime = (ms) => {
    if (!ms) return '—';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">You did it! 🎉</h1>
          <p className="text-lg text-charcoal-300">Your <span className="text-white font-medium">{recipeTitle}</span> is ready.</p>
        </div>

        <div className="card bg-charcoal-900 border-charcoal-800 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary-500" />
            Cooking Summary
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal-400">Steps Completed</dt>
              <dd className="font-medium text-white">{completedSteps.length} / {totalSteps}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal-400">Total Time</dt>
              <dd className="font-medium text-white">{formatTotalTime(totalTimeSpent)}</dd>
            </div>
            {isAdapted && adaptationsUsed > 0 && (
              <div className="flex justify-between">
                <dt className="text-charcoal-400 flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-primary-500" />
                  Adaptations Used
                </dt>
                <dd className="font-medium text-primary-300">{adaptationsUsed}</dd>
              </div>
            )}
          </dl>

          {note && (
            <div className="mt-4 p-3 rounded-xl bg-charcoal-800 border-l-4 border-primary-500">
              <p className="text-sm text-charcoal-300">Your note: <span className="text-white">"{note}"</span></p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button size="lg" onClick={onDone} className="w-full">
            Done
          </Button>
          <Button variant="secondary" onClick={onCookAgain} className="w-full">
            <RotateCcw className="h-5 w-5 mr-2" />
            Cook Again
          </Button>
          <Button variant="outline" onClick={onViewRecipe} className="w-full">
            <Eye className="h-5 w-5 mr-2" />
            View Recipe
          </Button>
          {!note && (
            <Button variant="ghost" onClick={onAddNote} className="w-full">
              <Plus className="h-5 w-5 mr-2" />
              Add a Note
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}