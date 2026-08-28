const COOKING_SESSION_KEY = 'cookflow_cooking_session_';
const COOKING_HISTORY_KEY = 'cookflow_cooking_history';
const COOKING_NOTES_KEY = 'cookflow_cooking_notes_';

function getSessionKey(recipeId) {
  return `${COOKING_SESSION_KEY}${recipeId}`;
}

function getNotesKey(recipeId) {
  return `${COOKING_NOTES_KEY}${recipeId}`;
}

export const cookingSessionService = {
  createSession(recipeId, recipeData, servings, adaptedState = null) {
    const session = {
      recipeId,
      recipeTitle: recipeData.title,
      recipeVersion: recipeData.updated_at || recipeData.created_at || Date.now(),
      startedAt: Date.now(),
      currentStep: 0,
      completedSteps: [],
      activeTimers: [],
      servings,
      originalServings: recipeData.servings,
      isAdapted: !!adaptedState,
      adaptedState: adaptedState ? JSON.parse(JSON.stringify(adaptedState)) : null,
      paused: false,
      pausedAt: null,
      completed: false,
      completedAt: null,
      totalTimeSpent: 0,
    };
    
    this.saveSession(session);
    return session;
  },

  saveSession(session) {
    try {
      localStorage.setItem(getSessionKey(session.recipeId), JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save cooking session:', error);
    }
  },

  getSession(recipeId) {
    try {
      const stored = localStorage.getItem(getSessionKey(recipeId));
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  clearSession(recipeId) {
    try {
      localStorage.removeItem(getSessionKey(recipeId));
    } catch {
      // Ignore
    }
  },

  updateCurrentStep(recipeId, stepIndex) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    session.currentStep = stepIndex;
    this.saveSession(session);
    return session;
  },

  completeStep(recipeId, stepIndex) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    if (!session.completedSteps.includes(stepIndex)) {
      session.completedSteps.push(stepIndex);
    }
    this.saveSession(session);
    return session;
  },

  uncompleteStep(recipeId, stepIndex) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    session.completedSteps = session.completedSteps.filter(s => s !== stepIndex);
    this.saveSession(session);
    return session;
  },

  pauseSession(recipeId) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    session.paused = true;
    session.pausedAt = Date.now();
    this.saveSession(session);
    return session;
  },

  resumeSession(recipeId) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    if (session.pausedAt) {
      const pauseDuration = Date.now() - session.pausedAt;
      session.totalTimeSpent += pauseDuration;
    }
    session.paused = false;
    session.pausedAt = null;
    this.saveSession(session);
    return session;
  },

  addTimer(recipeId, timer) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    const newTimer = {
      id: `timer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...timer,
      endTime: timer.endTime || (Date.now() + timer.duration * 1000),
      startedAt: Date.now(),
      paused: false,
      pausedAt: null,
    };
    
    session.activeTimers.push(newTimer);
    this.saveSession(session);
    return session;
  },

  updateTimer(recipeId, timerId, updates) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    const timerIndex = session.activeTimers.findIndex(t => t.id === timerId);
    if (timerIndex !== -1) {
      session.activeTimers[timerIndex] = { ...session.activeTimers[timerIndex], ...updates };
      this.saveSession(session);
    }
    return session;
  },

  removeTimer(recipeId, timerId) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    session.activeTimers = session.activeTimers.filter(t => t.id !== timerId);
    this.saveSession(session);
    return session;
  },

  clearTimers(recipeId) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    session.activeTimers = [];
    this.saveSession(session);
    return session;
  },

  completeSession(recipeId) {
    const session = this.getSession(recipeId);
    if (!session) return null;
    
    session.completed = true;
    session.completedAt = Date.now();
    session.currentStep = session.completedSteps.length > 0 
      ? Math.max(...session.completedSteps) 
      : session.currentStep;
    
    this.saveToHistory(session);
    this.saveSession(session);
    return session;
  },

  saveToHistory(session) {
    try {
      const history = this.getHistory();
      const historyEntry = {
        recipeId: session.recipeId,
        recipeTitle: session.recipeTitle,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        servings: session.servings,
        isAdapted: session.isAdapted,
        totalSteps: session.completedSteps.length,
        totalTimeSpent: session.totalTimeSpent,
      };
      
      history.unshift(historyEntry);
      if (history.length > 50) history.pop();
      
      localStorage.setItem(COOKING_HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  },

  getHistory() {
    try {
      const stored = localStorage.getItem(COOKING_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(COOKING_HISTORY_KEY);
    } catch {
      // Ignore
    }
  },

  getRecentHistory(limit = 5) {
    return this.getHistory().slice(0, limit);
  },

  saveNote(recipeId, note) {
    try {
      const key = getNotesKey(recipeId);
      const notes = this.getNotes(recipeId);
      notes.push({
        id: `note_${Date.now()}`,
        stepIndex: note.stepIndex,
        text: note.text,
        createdAt: Date.now(),
      });
      localStorage.setItem(key, JSON.stringify(notes));
    } catch {
      // Ignore
    }
  },

  getNotes(recipeId) {
    try {
      const stored = localStorage.getItem(getNotesKey(recipeId));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  deleteNote(recipeId, noteId) {
    try {
      const key = getNotesKey(recipeId);
      const notes = this.getNotes(recipeId).filter(n => n.id !== noteId);
      localStorage.setItem(key, JSON.stringify(notes));
    } catch {
      // Ignore
    }
  },

  hasActiveSession(recipeId) {
    const session = this.getSession(recipeId);
    return session && !session.completed;
  },

  isSessionValid(session, recipeData) {
    if (!session) return false;
    if (session.completed) return false;
    if (session.recipeVersion !== (recipeData.updated_at || recipeData.created_at)) {
      return false;
    }
    return true;
  },
};

export default cookingSessionService;