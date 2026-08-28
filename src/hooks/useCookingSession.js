import { useState, useEffect, useCallback } from 'react';
import { cookingSessionService } from '../services/cookingSessionService';
import { useMultipleTimers } from './useTimer';
import { useSpeechRecognition, useSpeechSynthesis } from './useSpeech';
import { scaleQuantity } from '../utils/recipeUtils';

function useCookingSession(recipeId, recipeData, servings, adaptedState = null) {
  const [session, setSession] = useState(null);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeStepTimer, setActiveStepTimer] = useState(null);
  
  const { 
    activeTimers, 
    completedTimers,
    addTimer, 
    pauseTimer, 
    resumeTimer, 
    cancelTimer,
    resetTimer,
    formatTime: formatTimerTime,
  } = useMultipleTimers();
  
  const { 
    isSupported: isSpeechSupported, 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    clearTranscript,
  } = useSpeechRecognition();
  
  const { 
    isSupported: isTtsSupported, 
    isSpeaking, 
    speak, 
    stop: stopSpeaking,
  } = useSpeechSynthesis();

  useEffect(() => {
    if (!recipeId || !recipeData) {
      setIsLoading(false);
      return;
    }

    const loadSession = () => {
      try {
        const existing = cookingSessionService.getSession(recipeId);
        const storedNotes = cookingSessionService.getNotes(recipeId);
        
        if (existing && cookingSessionService.isSessionValid(existing, recipeData)) {
          setSession(existing);
          setNotes(storedNotes);
          
          if (existing.activeTimers && existing.activeTimers.length > 0) {
            existing.activeTimers.forEach(timer => {
              const restoredTimer = {
                ...timer,
                originalDuration: timer.duration,
              };
              addTimer(restoredTimer);
            });
          }
          
          if (existing.paused) {
            setShowResumeDialog(true);
          }
        } else if (existing) {
          cookingSessionService.clearSession(recipeId);
          const newSession = cookingSessionService.createSession(recipeId, recipeData, servings, adaptedState);
          setSession(newSession);
        } else {
          const newSession = cookingSessionService.createSession(recipeId, recipeData, servings, adaptedState);
          setSession(newSession);
        }
      } catch (err) {
        console.error('Failed to load cooking session:', err);
        setError('Unable to load cooking session');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [recipeId, recipeData, servings, adaptedState, addTimer]);

  const updateSession = useCallback((updates) => {
    if (!session) return;
    const updated = { ...session, ...updates };
    cookingSessionService.saveSession(updated);
    setSession(updated);
  }, [session]);

  const goToStep = useCallback((stepIndex) => {
    if (!session || stepIndex < 0 || stepIndex >= (session.isAdapted ? adaptedState?.adaptedSteps?.length : recipeData.recipe_steps?.length)) return;
    
    updateSession({ currentStep: stepIndex });
    setActiveStepTimer(null);
  }, [session, updateSession, adaptedState, recipeData]);

  const nextStep = useCallback(() => {
    if (!session) return;
    const totalSteps = session.isAdapted ? adaptedState?.adaptedSteps?.length : recipeData.recipe_steps?.length;
    if (session.currentStep < totalSteps - 1) {
      updateSession({ currentStep: session.currentStep + 1 });
      setActiveStepTimer(null);
    }
  }, [session, updateSession, adaptedState, recipeData]);

  const prevStep = useCallback(() => {
    if (!session || session.currentStep > 0) {
      updateSession({ currentStep: session.currentStep - 1 });
      setActiveStepTimer(null);
    }
  }, [session, updateSession]);

  const completeStep = useCallback((stepIndex) => {
    if (!session) return;
    cookingSessionService.completeStep(recipeId, stepIndex);
    updateSession({ completedSteps: [...session.completedSteps, stepIndex] });
  }, [session, recipeId, updateSession]);

  const uncompleteStep = useCallback((stepIndex) => {
    if (!session) return;
    cookingSessionService.uncompleteStep(recipeId, stepIndex);
    updateSession({ completedSteps: session.completedSteps.filter(s => s !== stepIndex) });
  }, [session, recipeId, updateSession]);

  const pauseSession = useCallback(() => {
    cookingSessionService.pauseSession(recipeId);
    updateSession({ paused: true, pausedAt: Date.now() });
    
    activeTimers.forEach(timer => {
      pauseTimer(timer.id);
    });
  }, [recipeId, updateSession, activeTimers, pauseTimer]);

  const resumeSession = useCallback(() => {
    cookingSessionService.resumeSession(recipeId);
    updateSession({ paused: false, pausedAt: null });
    setShowResumeDialog(false);
    
    activeTimers.forEach(timer => {
      if (timer.paused) {
        resumeTimer(timer.id);
      }
    });
  }, [recipeId, updateSession, activeTimers, resumeTimer]);

  const startStepTimer = useCallback((duration) => {
    if (!duration || duration <= 0) return;
    
    const timerId = addTimer({
      label: `Step ${session?.currentStep + 1}`,
      duration,
      originalDuration: duration,
      stepIndex: session?.currentStep,
      isStepTimer: true,
    });
    
    setActiveStepTimer({ id: timerId, duration });
  }, [session, addTimer]);

  const addCustomTimer = useCallback((label, duration) => {
    if (!duration || duration <= 0) return;
    return addTimer({ label, duration, originalDuration: duration, isStepTimer: false });
  }, [addTimer]);

  const handlePauseTimer = useCallback((timerId) => {
    pauseTimer(timerId);
  }, [pauseTimer]);

  const handleResumeTimer = useCallback((timerId) => {
    resumeTimer(timerId);
  }, [resumeTimer]);

  const handleCancelTimer = useCallback((timerId) => {
    cancelTimer(timerId);
    if (activeStepTimer && activeStepTimer.id === timerId) {
      setActiveStepTimer(null);
    }
  }, [cancelTimer, activeStepTimer]);

  const completeCooking = useCallback(() => {
    cookingSessionService.completeSession(recipeId);
    updateSession({ completed: true, completedAt: Date.now() });
  }, [recipeId, updateSession]);

  const addNote = useCallback((stepIndex, text) => {
    cookingSessionService.saveNote(recipeId, { stepIndex, text });
    const newNotes = cookingSessionService.getNotes(recipeId);
    setNotes(newNotes);
  }, [recipeId]);

  const deleteNote = useCallback((noteId) => {
    cookingSessionService.deleteNote(recipeId, noteId);
    const newNotes = cookingSessionService.getNotes(recipeId);
    setNotes(newNotes);
  }, [recipeId]);

  const readStep = useCallback(() => {
    if (!session || !isTtsSupported) return;
    
    const steps = session.isAdapted ? adaptedState?.adaptedSteps : recipeData.recipe_steps;
    const currentStepData = steps?.[session.currentStep];
    
    if (currentStepData) {
      let text = currentStepData.instruction;
      if (currentStepData.duration_seconds) {
        const mins = Math.floor(currentStepData.duration_seconds / 60);
        const secs = currentStepData.duration_seconds % 60;
        text += ` Timer: ${mins} minutes ${secs} seconds.`;
      }
      if (currentStepData.tip) {
        text += ` Tip: ${currentStepData.tip}`;
      }
      speak(text);
    }
  }, [session, adaptedState, recipeData, isTtsSupported, speak]);

  const handleVoiceCommand = useCallback((command) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('next') || lowerCommand.includes('forward')) {
      nextStep();
    } else if (lowerCommand.includes('previous') || lowerCommand.includes('back')) {
      prevStep();
    } else if (lowerCommand.includes('repeat') || lowerCommand.includes('read')) {
      readStep();
    } else if (lowerCommand.includes('timer') || lowerCommand.includes('start timer')) {
      const match = lowerCommand.match(/(\d+)\s*(minute|min|second|sec)/);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        const seconds = unit.startsWith('min') ? value * 60 : value;
        startStepTimer(seconds);
      } else {
        startStepTimer(30);
      }
    } else if (lowerCommand.includes('pause timer') || lowerCommand.includes('stop timer')) {
      if (activeStepTimer) {
        pauseTimer(activeStepTimer.id);
      }
    } else if (lowerCommand.includes('resume timer') || lowerCommand.includes('continue timer')) {
      if (activeStepTimer) {
        resumeTimer(activeStepTimer.id);
      }
    } else if (lowerCommand.includes('how much') || lowerCommand.includes('quantity') || lowerCommand.includes('amount')) {
      const ingredientQuery = lowerCommand.replace('how much', '').replace('quantity', '').replace('amount', '').trim();
      const ingredients = session?.isAdapted ? adaptedState?.adaptedIngredients : recipeData.recipe_ingredients;
      const found = ingredients?.find(ing => 
        ing.ingredient?.name?.toLowerCase().includes(ingredientQuery) ||
        ing.name?.toLowerCase().includes(ingredientQuery)
      );
      if (found) {
        const qty = session?.isAdapted ? found.quantity : scaleQuantity(found.quantity, recipeData.servings, servings);
        speak(`${qty} ${found.unit} ${found.preparation ? `(${found.preparation})` : ''} ${found.ingredient?.name || found.name}`);
      } else {
        speak(`I couldn't find ${ingredientQuery} in this recipe.`);
      }
    } else if (lowerCommand.includes('how long') || lowerCommand.includes('time')) {
      const steps = session?.isAdapted ? adaptedState?.adaptedSteps : recipeData.recipe_steps;
      const currentStepData = steps?.[session?.currentStep];
      if (currentStepData?.duration_seconds) {
        const mins = Math.floor(currentStepData.duration_seconds / 60);
        const secs = currentStepData.duration_seconds % 60;
        speak(`This step takes ${mins} minutes ${secs} seconds.`);
      } else {
        speak('This step does not have a specific time.');
      }
    } else {
      speak('I did not understand that command. Try "next step", "repeat", or "start timer".');
    }
  }, [session, adaptedState, recipeData, servings, nextStep, prevStep, readStep, startStepTimer, pauseTimer, resumeTimer, speak, activeStepTimer]);

  useEffect(() => {
    if (transcript && isSpeechSupported) {
      handleVoiceCommand(transcript);
      clearTranscript();
    }
  }, [transcript, isSpeechSupported, handleVoiceCommand, clearTranscript]);

  const isStepComplete = useCallback((stepIndex) => {
    return session?.completedSteps?.includes(stepIndex) || false;
  }, [session]);

  const getProgress = useCallback(() => {
    if (!session) return 0;
    const totalSteps = session.isAdapted ? adaptedState?.adaptedSteps?.length : recipeData.recipe_steps?.length;
    if (!totalSteps || totalSteps === 0) return 0;
    return ((session.currentStep + 1) / totalSteps) * 100;
  }, [session, adaptedState, recipeData]);

  return {
    session,
    isLoading,
    error,
    showResumeDialog,
    setShowResumeDialog,
    currentStep: session?.currentStep || 0,
    completedSteps: session?.completedSteps || [],
    isPaused: session?.paused || false,
    isCompleted: session?.completed || false,
    goToStep,
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
    completedTimers,
    startStepTimer,
    addCustomTimer,
    pauseTimer: handlePauseTimer,
    resumeTimer: handleResumeTimer,
    cancelTimer: handleCancelTimer,
    resetTimer,
    formatTimerTime,
    isSpeechSupported,
    isListening,
    startListening,
    stopListening,
    isTtsSupported,
    isSpeaking,
    speak,
    stopSpeaking,
    progress: getProgress(),
  };
}

export { useCookingSession };