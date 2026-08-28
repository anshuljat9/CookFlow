import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Button from './Button';

export default function StepNavigation({
  currentStep,
  totalSteps,
  completedSteps,
  onPrevious,
  onNext,
  onFinish,
  isLastStep,
}) {
  const isFirstStep = currentStep === 0;
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-charcoal-800">
      <Button
        variant="ghost"
        size="lg"
        leftIcon={<ChevronLeft className="h-5 w-5" />}
        onClick={onPrevious}
        disabled={isFirstStep}
        className="w-full sm:w-auto"
        aria-label="Previous step"
      >
        Previous
      </Button>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
        {Array.from({ length: totalSteps }, (_, i) => (
          <button
            key={i}
            onClick={() => {}}
            disabled
            className={`w-2 h-2 rounded-full transition-colors ${
              i < currentStep
                ? 'bg-green-500'
                : i === currentStep
                ? 'bg-primary-500 animate-pulse'
                : i <= currentStep + 1 && completedSteps.includes(i)
                ? 'bg-green-500'
                : 'bg-charcoal-700'
            }`}
            aria-label={`Step ${i + 1} ${i < currentStep ? 'completed' : i === currentStep ? 'current' : 'upcoming'}`}
          />
        ))}
      </div>

      {isLastStep ? (
        <Button
          variant="primary"
          size="lg"
          onClick={onFinish}
          className="w-full sm:w-auto"
        >
          Finish Cooking
          <CheckCircle2 className="h-5 w-5 ml-2" />
        </Button>
      ) : (
        <Button
          variant={nextStepCompleted ? 'secondary' : 'primary'}
          size="lg"
          rightIcon={<ChevronRight className="h-5 w-5" />}
          onClick={onNext}
          className="w-full sm:w-auto"
          aria-label="Next step"
        >
          Next
        </Button>
      )}
    </div>
  );
}