import { useState, useEffect, useCallback, useRef } from 'react';

function useTimer(initialDuration = 0) {
  const [duration, setDuration] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);

  const calculateRemaining = useCallback((currentEndTime) => {
    if (!currentEndTime) return 0;
    const remaining = Math.max(0, Math.ceil((currentEndTime - Date.now()) / 1000));
    return remaining;
  }, []);

  const tick = useCallback(() => {
    if (endTimeRef.current) {
      const remaining = calculateRemaining(endTimeRef.current);
      setDuration(remaining);
      
      if (remaining <= 0) {
        setIsRunning(false);
        setIsComplete(true);
        setDuration(0);
        endTimeRef.current = null;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }
  }, [calculateRemaining]);

  useEffect(() => {
    if (isRunning && endTimeRef.current) {
      tick();
      intervalRef.current = setInterval(tick, 200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  const start = useCallback((presetDuration = null) => {
    const newDuration = presetDuration !== null ? presetDuration : duration;
    if (newDuration <= 0) return;
    
    const newEndTime = Date.now() + newDuration * 1000;
    endTimeRef.current = newEndTime;
    setEndTime(newEndTime);
    setDuration(newDuration);
    setIsRunning(true);
    setIsComplete(false);
  }, [duration]);

  const pause = useCallback(() => {
    if (isRunning && endTimeRef.current) {
      const remaining = calculateRemaining(endTimeRef.current);
      setDuration(remaining);
      setIsRunning(false);
      endTimeRef.current = null;
      setEndTime(null);
    }
  }, [isRunning, calculateRemaining]);

  const resume = useCallback(() => {
    if (!isRunning && duration > 0) {
      const newEndTime = Date.now() + duration * 1000;
      endTimeRef.current = newEndTime;
      setEndTime(newEndTime);
      setIsRunning(true);
      setIsComplete(false);
    }
  }, [isRunning, duration]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setDuration(0);
    setEndTime(null);
    setIsComplete(false);
    endTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setTimerDuration = useCallback((newDuration) => {
    if (!isRunning) {
      setDuration(newDuration);
    } else {
      const newEndTime = Date.now() + newDuration * 1000;
      endTimeRef.current = newEndTime;
      setEndTime(newEndTime);
      setDuration(newDuration);
    }
  }, [isRunning]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    duration,
    isRunning,
    isComplete,
    start,
    pause,
    resume,
    reset,
    setTimerDuration,
    formatTime,
    remaining: duration,
  };
}

function useMultipleTimers() {
  const [timers, setTimers] = useState([]);
  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    setTimers(prev => {
      let hasChanges = false;
      const updated = prev.map(timer => {
        if (timer.paused || timer.isComplete) return timer;
        
        const remaining = Math.max(0, Math.ceil((timer.endTime - Date.now()) / 1000));
        
        if (remaining <= 0) {
          hasChanges = true;
          return { ...timer, duration: 0, isComplete: true, isRunning: false };
        }
        
        if (remaining !== timer.duration) {
          hasChanges = true;
          return { ...timer, duration: remaining };
        }
        
        return timer;
      });
      
      return hasChanges ? updated : prev;
    });
  }, []);

  useEffect(() => {
    const hasActiveTimers = timers.some(t => t.isRunning && !t.isComplete);
    
    if (hasActiveTimers) {
      tick();
      intervalRef.current = setInterval(tick, 200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timers, tick]);

  const addTimer = useCallback((timer) => {
    const newTimer = {
      id: `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...timer,
      endTime: Date.now() + timer.duration * 1000,
      startedAt: Date.now(),
      paused: false,
      pausedAt: null,
      isComplete: false,
      isRunning: true,
    };
    
    setTimers(prev => [...prev, newTimer]);
    return newTimer.id;
  }, []);

  const pauseTimer = useCallback((timerId) => {
    setTimers(prev => prev.map(timer => {
      if (timer.id !== timerId || timer.paused || timer.isComplete) return timer;
      
      const remaining = Math.max(0, Math.ceil((timer.endTime - Date.now()) / 1000));
      return {
        ...timer,
        duration: remaining,
        paused: true,
        pausedAt: Date.now(),
        isRunning: false,
      };
    }));
  }, []);

  const resumeTimer = useCallback((timerId) => {
    setTimers(prev => prev.map(timer => {
      if (timer.id !== timerId || !timer.paused || timer.isComplete) return timer;
      
      const pauseDuration = Date.now() - timer.pausedAt;
      const newEndTime = timer.endTime + pauseDuration;
      
      return {
        ...timer,
        endTime: newEndTime,
        paused: false,
        pausedAt: null,
        isRunning: true,
      };
    }));
  }, []);

  const cancelTimer = useCallback((timerId) => {
    setTimers(prev => prev.filter(timer => timer.id !== timerId));
  }, []);

  const resetTimer = useCallback((timerId) => {
    setTimers(prev => prev.map(timer => {
      if (timer.id !== timerId) return timer;
      return {
        ...timer,
        duration: timer.originalDuration,
        endTime: Date.now() + timer.originalDuration * 1000,
        paused: false,
        pausedAt: null,
        isComplete: false,
        isRunning: false,
      };
    }));
  }, []);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const activeTimers = timers.filter(t => !t.isComplete);
  const completedTimers = timers.filter(t => t.isComplete);

  return {
    timers,
    activeTimers,
    completedTimers,
    addTimer,
    pauseTimer,
    resumeTimer,
    cancelTimer,
    resetTimer,
    formatTime,
  };
}

export { useTimer, useMultipleTimers };