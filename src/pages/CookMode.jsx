import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Play, Pause, Check, 
  Mic, Music, X, Loader2, AlertTriangle, 
  ChefHat, Clock, Volume2, VolumeX
} from 'lucide-react';
import { getRecipeById } from '../data/recipes';
import Button from '../components/Button';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function CookMode() {
  const { id } = useParams();
  const recipe = getRecipeById(parseInt(id));
  const [currentStep, setCurrentStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [ingredientChecks, setIngredientChecks] = useState({});

  const totalSteps = recipe?.instructions.length || 0;
  const currentInstruction = recipe?.instructions[currentStep] || '';
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  useEffect(() => {
    let interval;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      setTimerSeconds(0);
      setIsTimerRunning(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setTimerSeconds(0);
      setIsTimerRunning(false);
    }
  };

  const handleTimerStart = (presetSeconds) => {
    if (presetSeconds) {
      setTimerSeconds(presetSeconds);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleTimerReset = () => {
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const handleIngredientToggle = (index) => {
    setIngredientChecks(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (isVoiceActive) {
      console.log('Voice control deactivated');
    } else {
      console.log('Voice control activated - listening for commands');
    }
  };

  const handleMusicToggle = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    window.history.back();
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary-500" />
          <p>Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-950 text-white">
      <div className="fixed top-0 left-0 right-0 z-30 bg-charcoal-950/95 backdrop-blur-sm border-b border-charcoal-800">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleExit}
              className="p-2 rounded-xl text-charcoal-300 hover:text-white hover:bg-charcoal-800 transition-colors"
              aria-label="Exit cooking mode"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold truncate px-4">{recipe.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-charcoal-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Cooking progress"
                />
              </div>
              <span className="text-sm text-charcoal-400 w-14 text-right">
                {currentStep + 1} / {totalSteps}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="container-custom pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="card bg-charcoal-900 border-charcoal-800" aria-labelledby="instruction-heading">
              <div className="p-6 sm:p-8">
                <h2 id="instruction-heading" className="sr-only">Current Step</h2>
                <div className="text-center mb-6">
                  <p className="text-sm text-charcoal-400 uppercase tracking-wider mb-1">Step {currentStep + 1} of {totalSteps}</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white leading-relaxed whitespace-pre-wrap">
                    {currentInstruction}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="lg"
                    leftIcon={<ChevronLeft className="h-5 w-5" />}
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    className="w-full sm:w-auto"
                  >
                    Previous
                  </Button>

                  <div className="relative w-full sm:w-auto">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Button
                        variant={isTimerRunning ? 'danger' : 'secondary'}
                        size="lg"
                        leftIcon={isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        onClick={() => handleTimerStart(30)}
                        className="w-20"
                      >
                        {isTimerRunning ? 'Pause' : '30s'}
                      </Button>
                      
                      <div className="text-center">
                        <p className="text-4xl sm:text-5xl font-mono font-bold tabular-nums text-white" aria-live="polite">
                          {formatTime(timerSeconds)}
                        </p>
                        <p className="text-xs text-charcoal-400">Timer</p>
                      </div>

                      <Button
                        variant="secondary"
                        size="lg"
                        leftIcon={<Loader2 className="h-5 w-5" />}
                        onClick={handleTimerReset}
                        disabled={timerSeconds === 0 && !isTimerRunning}
                        className="w-20"
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="flex justify-center gap-2 flex-wrap">
                      {[30, 60, 180, 300, 600].map(seconds => (
                        <button
                          key={seconds}
                          onClick={() => handleTimerStart(seconds)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                            timerSeconds === seconds && isTimerRunning
                              ? 'bg-primary-600 text-white'
                              : 'bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700'
                          }`}
                        >
                          {formatTime(seconds)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant={currentStep === totalSteps - 1 ? 'primary' : 'secondary'} 
                    size="lg"
                    rightIcon={<ChevronRight className="h-5 w-5" />}
                    onClick={handleNextStep}
                    className="w-full sm:w-auto"
                  >
                    {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </section>

            <section className="card bg-charcoal-900 border-charcoal-800" aria-labelledby="ingredients-heading">
              <div className="p-6">
                <h2 id="ingredients-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary-500" />
                  Ingredient Checklist
                </h2>
                <ul className="space-y-2" role="list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={ingredientChecks[index]}
                          onChange={() => handleIngredientToggle(index)}
                          className="w-5 h-5 rounded text-primary-600 border-charcoal-600 focus:ring-primary-500 bg-charcoal-700"
                          aria-label={`Mark ${ingredient} as ready`}
                        />
                        <span className={`${ingredientChecks[index] ? 'line-through text-charcoal-500' : 'text-white'} flex-1`}>
                          {ingredient}
                        </span>
                        {ingredientChecks[index] && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <section className="card bg-charcoal-900 border-charcoal-800 p-6" aria-labelledby="recipe-info-heading">
              <h2 id="recipe-info-heading" className="font-semibold mb-4">Recipe Info</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-charcoal-400">Total Time</dt>
                  <dd className="font-medium">{recipe.cookingTime}m</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-400">Servings</dt>
                  <dd className="font-medium">{recipe.servings}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-400">Difficulty</dt>
                  <dd className="font-medium capitalize">{recipe.difficulty}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-400">Cuisine</dt>
                  <dd className="font-medium capitalize">{recipe.cuisine}</dd>
                </div>
              </dl>
            </section>

            <section className="card bg-charcoal-900 border-charcoal-800 p-6" aria-labelledby="voice-heading">
              <h2 id="voice-heading" className="font-semibold mb-4 flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary-500" />
                Voice Control
              </h2>
              <Button
                variant={isVoiceActive ? 'primary' : 'outline'}
                className="w-full mb-3"
                leftIcon={<Mic className="h-5 w-5" />}
                onClick={handleVoiceToggle}
              >
                {isVoiceActive ? 'Listening...' : 'Activate Voice Control'}
              </Button>
              <p className="text-sm text-charcoal-400">
                {isVoiceActive 
                  ? 'Say "next step", "repeat", "timer 2 minutes", "pause"'
                  : 'Tap to enable hands-free cooking commands'}
              </p>
            </section>

            <section className="card bg-charcoal-900 border-charcoal-800 p-6" aria-labelledby="music-heading">
              <h2 id="music-heading" className="font-semibold mb-4 flex items-center gap-2">
                <Music className="h-5 w-5 text-primary-500" />
                Cooking Music
              </h2>
              <Button
                variant={isMusicPlaying ? 'primary' : 'outline'}
                className="w-full mb-3"
                leftIcon={isMusicPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                onClick={handleMusicToggle}
              >
                {isMusicPlaying ? 'Playing Focus Playlist' : 'Play Cooking Music'}
              </Button>
              <p className="text-sm text-charcoal-400">
                {isMusicPlaying 
                  ? '🎵 Lo-fi beats for cooking focus'
                  : 'Curated playlists for your cooking session'}
              </p>
            </section>

            <section className="card bg-charcoal-900 border-charcoal-800 p-6 bg-amber-900/20 border-amber-800/50" aria-labelledby="tips-heading">
              <h2 id="tips-heading" className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Cooking Tips
              </h2>
              <ul className="text-sm text-charcoal-300 space-y-2">
                <li className="flex gap-2"><span className="text-amber-400">•</span> Prep all ingredients before starting</li>
                <li className="flex gap-2"><span className="text-amber-400">•</span> Keep a bowl for scraps nearby</li>
                <li className="flex gap-2"><span className="text-amber-400">•</span> Taste and adjust seasoning as you go</li>
                <li className="flex gap-2"><span className="text-amber-400">•</span> Clean as you cook for easier cleanup</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="card bg-charcoal-900 border-charcoal-800 w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-2">Exit Cooking Mode?</h2>
            <p className="text-charcoal-400 mb-6">Your progress will be saved. You can resume from step {currentStep + 1} later.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowExitConfirm(false)}>
                Stay Cooking
              </Button>
              <Button variant="outline" className="flex-1" onClick={confirmExit}>
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}

      {isVoiceActive && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary-600 text-white shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="font-medium">Listening... Say a command</span>
          </div>
        </div>
      )}
    </div>
  );
}