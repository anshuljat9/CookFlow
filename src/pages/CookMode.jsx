import { useState, useEffect, useCallback, useMemo } from 'react';
import { Music } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipes';
import { useRecipeAdaptation } from '../hooks/useRecipeAdaptation';
import { cookingSessionService } from '../services/cookingSessionService';
import { useCookingSession } from '../hooks/useCookingSession';
import { preferenceService } from '../services/preferenceService';
import CookModeHeader from '../components/CookModeHeader';
import CurrentStep from '../components/CurrentStep';
import StepNavigation from '../components/StepNavigation';
import ActiveTimers from '../components/ActiveTimers';
import IngredientChecklist from '../components/IngredientChecklist';
import VoiceAssistant from '../components/VoiceAssistant';
import CookingNotes from '../components/CookingNotes';
import CompletionScreen from '../components/CompletionScreen';
import ResumeDialog from '../components/ResumeDialog';
import ViewChangesDialog from '../components/ViewChangesDialog';
import ExitConfirmDialog from '../components/ExitConfirmDialog';
import MusicMiniPlayer from '../components/MusicMiniPlayer';
import Button from '../components/Button';

export default function CookMode() {
  const { id } = useParams();
  const { recipe, loading, error } = useRecipe(id);
  const { adaptedState, hasAdaptation, isLoading: adaptationLoading } = useRecipeAdaptation(id);
  const [servings, setServings] = useState(1);
  const [showViewChanges, setShowViewChanges] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [finalNote, setFinalNote] = useState('');
  const [showMusic, setShowMusic] = useState(false);

  const { 
    session,
    isLoading: sessionLoading,
    error: sessionError,
    showResumeDialog,
    setShowResumeDialog,
    currentStep,
    completedSteps,
    isPaused,
    isCompleted,
    nextStep,
    prevStep,
    completeStep,
    uncompleteStep,
    isStepComplete,
    pauseSession,
    resumeSession,
    completeCooking,
    addNote,
    deleteNote,
    notes,
    readStep,
    activeStepTimer,
    timers,
    activeTimers,
    startStepTimer,
    pauseTimer,
    resumeTimer,
    cancelTimer,
    resetTimer,
    formatTimerTime,
    isSpeechSupported,
    isListening,
    startListening,
    stopListening,
    speak,
    progress,
  } = useCookingSession(id, recipe, servings, adaptedState);

  const steps = useMemo(() => {
    if (hasAdaptation && adaptedState?.adaptedSteps) {
      return adaptedState.adaptedSteps;
    }
    return recipe?.recipe_steps || [];
  }, [hasAdaptation, adaptedState, recipe]);

  const ingredients = useMemo(() => {
    if (hasAdaptation && adaptedState?.adaptedIngredients) {
      return adaptedState.adaptedIngredients;
    }
    return recipe?.recipe_ingredients || [];
  }, [hasAdaptation, adaptedState, recipe]);

  const originalSteps = recipe?.recipe_steps || [];
  const originalIngredients = recipe?.recipe_ingredients || [];

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings || 1);
    }
  }, [recipe]);

  useEffect(() => {
    if (recipe && !showMusic) {
      const prefs = preferenceService.getPreferences();
      if (prefs.musicPreferences?.mood) {
        setShowMusic(true);
      }
    }
  }, [recipe]);

  const handleNextStep = useCallback(() => {
    if (isCompleted) {
      completeCooking();
    } else {
      completeStep(currentStep);
      nextStep();
    }
  }, [isCompleted, currentStep, completeStep, nextStep, completeCooking]);

  const handlePrevStep = useCallback(() => {
    if (isStepComplete(currentStep - 1)) {
      uncompleteStep(currentStep - 1);
    }
    prevStep();
  }, [currentStep, isStepComplete, uncompleteStep, prevStep]);

  const handleTimerStart = useCallback((duration) => {
    if (duration && duration > 0) {
      startStepTimer(duration);
    } else {
      resetTimer(activeStepTimer?.id);
    }
  }, [startStepTimer, activeStepTimer, resetTimer]);

  const handleExit = useCallback(() => {
    setShowExitConfirm(true);
  }, []);

  const handlePauseExit = useCallback(() => {
    pauseSession();
    setShowExitConfirm(false);
    window.history.back();
  }, [pauseSession]);

  const handleExitConfirm = useCallback(() => {
    cookingSessionService.clearSession(id);
    setShowExitConfirm(false);
    window.history.back();
  }, [id]);

  const handleResume = useCallback(() => {
    resumeSession();
    setShowResumeDialog(false);
  }, [resumeSession, setShowResumeDialog]);

  const handleStartOver = useCallback(() => {
    cookingSessionService.clearSession(id);
    setShowResumeDialog(false);
    if (session) {
      cookingSessionService.createSession(id, recipe, servings, adaptedState);
    }
  }, [id, recipe, servings, adaptedState, session, setShowResumeDialog]);

  const handleComplete = useCallback(() => {
    completeCooking();
  }, [completeCooking]);

  const handleAddFinalNote = useCallback(() => {
    if (finalNote.trim()) {
      addNote(currentStep, finalNote.trim());
      setFinalNote('');
    }
  }, [currentStep, addNote, finalNote]);

  if (loading || adaptationLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950">
        <div className="text-center text-white">
          <div className="h-12 w-12 animate-spin mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full" />
          <p>Loading cooking session...</p>
        </div>
      </div>
    );
  }

  if (error || sessionError || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="h-12 w-12 text-red-500 mx-auto mb-4">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Unable to Start Cooking</h2>
          <p className="text-charcoal-400 mb-6">{error || sessionError || 'This recipe doesn\'t exist or has been removed.'}</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const adaptationsUsed = adaptedState?.adaptedIngredients?.filter(i => i.isSubstituted).length || 0;
    const totalTimeSpent = session?.completedAt ? session.completedAt - session.startedAt : 0;
    
    return (
      <CompletionScreen
        recipeTitle={recipe.title}
        totalSteps={steps.length}
        completedSteps={completedSteps}
        isAdapted={hasAdaptation}
        adaptationsUsed={adaptationsUsed}
        note={finalNote}
        onDone={() => window.history.back()}
        onCookAgain={handleStartOver}
        onViewRecipe={() => window.location.href = `/recipe/${id}`}
        onAddNote={handleAddFinalNote}
        totalTimeSpent={totalTimeSpent}
      />
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-charcoal-950 text-white">
      <CookModeHeader
        recipeTitle={recipe.title}
        currentStep={currentStep}
        totalSteps={steps.length}
        progress={progress}
        isPaused={isPaused}
        onExit={handleExit}
        onPause={pauseSession}
        onResume={resumeSession}
        paused={isPaused}
      />

      <main className="container-custom pt-20 lg:pt-16 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <CurrentStep
              step={currentStepData}
              stepNumber={currentStep}
              totalSteps={steps.length}
              isComplete={isStepComplete(currentStep)}
              duration={currentStepData?.duration_seconds}
              temperature={currentStepData?.temperature}
              tip={currentStepData?.tip}
              onTimerStart={handleTimerStart}
              onReadStep={readStep}
              isTimerRunning={activeTimers.some(t => t.id === activeStepTimer?.id && t.isRunning && !t.isComplete)}
              timerDuration={activeStepTimer?.duration || 0}
              isReading={isSpeaking}
              formatTime={formatTimerTime}
            />

            <StepNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              completedSteps={completedSteps}
              onPrevious={handlePrevStep}
              onNext={handleNextStep}
              onFinish={handleComplete}
              isLastStep={currentStep === steps.length - 1}
            />
          </div>

          <aside className="lg:col-span-1 space-y-4 lg:space-y-6">
            <div className="sticky top-20 lg:top-24 space-y-4">
              <ActiveTimers
                timers={timers}
                activeTimers={activeTimers}
                formatTime={formatTimerTime}
                onPause={pauseTimer}
                onResume={resumeTimer}
                onCancel={cancelTimer}
                onReset={resetTimer}
                activeStepTimerId={activeStepTimer?.id}
              />

              <IngredientChecklist
                ingredients={originalIngredients}
                adaptedIngredients={ingredients}
                isAdapted={hasAdaptation}
                servings={servings}
                originalServings={recipe.servings || 1}
                checks={Object.fromEntries(
                  ingredients.map((_, i) => [i, isStepComplete(i)])
                )}
                onToggle={(index) => {
                  if (isStepComplete(index)) {
                    uncompleteStep(index);
                  } else {
                    completeStep(index);
                  }
                }}
                onViewChanges={() => setShowViewChanges(true)}
              />

              <VoiceAssistant
                isSupported={isSpeechSupported}
                isListening={isListening}
                transcript={''}
                isSpeaking={isSpeaking}
                startListening={startListening}
                stopListening={stopListening}
                speak={speak}
                stopSpeaking={stopSpeaking}
                onCommand={(_cmd) => {}}
                isEnabled={voiceEnabled}
                onToggleEnabled={setVoiceEnabled}
              />

              <CookingNotes
                notes={notes}
                currentStep={currentStep}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
              />

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Music className="h-4 w-4" />}
                onClick={() => setShowMusic(!showMusic)}
                className="w-full"
              >
                {showMusic ? 'Hide Music' : '🎵 Cooking Music'}
              </Button>

              {showMusic && (
                <MusicMiniPlayer
                  recipe={recipe}
                  isOpen={true}
                  onClose={() => setShowMusic(false)}
                />
              )}
            </div>
          </aside>
        </div>
      </main>

      <ResumeDialog
        isOpen={showResumeDialog}
        onClose={() => setShowResumeDialog(false)}
        onResume={handleResume}
        onStartOver={handleStartOver}
        currentStep={currentStep}
        totalSteps={steps.length}
        recipeTitle={recipe.title}
        pausedAt={session?.pausedAt}
      />

      <ViewChangesDialog
        isOpen={showViewChanges}
        onClose={() => setShowViewChanges(false)}
        adaptedIngredients={ingredients}
        adaptedSteps={steps}
        originalIngredients={originalIngredients}
        originalSteps={originalSteps}
      />

      <ExitConfirmDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onPauseExit={handlePauseExit}
        onExit={handleExitConfirm}
        currentStep={currentStep}
        totalSteps={steps.length}
        recipeTitle={recipe.title}
      />
    </div>
  );
}