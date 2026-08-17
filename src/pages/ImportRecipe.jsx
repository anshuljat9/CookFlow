import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, Image, Upload, Loader2, CheckCircle2, AlertCircle, Circle, Sparkles, ArrowRight, X } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

const importSteps = [
  { id: 'finding', label: 'Finding the dish', icon: Sparkles },
  { id: 'reading', label: 'Reading ingredients', icon: Film },
  { id: 'understanding', label: 'Understanding cooking steps', icon: Image },
  { id: 'creating', label: 'Creating recipe', icon: Upload },
];

const mockResult = {
  dish: 'Korean Garlic Noodles',
  confidence: 87,
  ingredients: [
    '200g spaghetti or wheat noodles',
    '4 tbsp butter',
    '8 garlic cloves, minced',
    '2 tbsp soy sauce',
    '1 tbsp gochugaru (Korean chili flakes)',
    '1 tbsp honey',
    '1 tsp sesame oil',
    'Green onions, chopped',
    'Sesame seeds',
    'Optional: fried egg'
  ],
  steps: [
    'Cook noodles al dente, reserve 1/2 cup pasta water',
    'Melt butter in large pan over medium heat',
    'Add garlic, cook until golden and fragrant',
    'Add soy sauce, gochugaru, honey, sesame oil',
    'Toss in noodles with pasta water to create emulsion',
    'Top with green onions, sesame seeds, and fried egg'
  ],
  prepTime: 5,
  cookTime: 10,
  servings: 2,
  cuisine: 'korean',
  difficulty: 'easy',
  tags: ['quick', 'vegetarian']
};

export default function ImportRecipe() {
  const [mode, setMode] = useState('url');
  const [url, setUrl] = useState('');
  const [stage, setStage] = useState('input');
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    setError('');
    setStage('analyzing');
    setCurrentStep(0);
    simulateAnalysis();
  };

  const simulateAnalysis = () => {
    const steps = importSteps;
    let stepIndex = 0;
    
    const nextStep = () => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        stepIndex++;
        const delay = stepIndex === steps.length ? 2000 : 1500;
        setTimeout(nextStep, delay);
      } else {
        setTimeout(() => setStage('result'), 500);
      }
    };
    nextStep();
  };

  const handleRetry = () => {
    setStage('input');
    setUrl('');
    setError('');
  };

  const handleViewRecipe = () => {
    console.log('Navigate to recipe details');
  };

  return (
    <div className="animate-fade-in min-h-[calc(100vh-200px)]">
      <div className="container-custom py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/80 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>AI Recipe Extraction</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-warm-100 mb-4">
              Turn any food video into a recipe
            </h1>
            <p className="text-lg text-charcoal-600 dark:text-charcoal-300 max-w-2xl mx-auto">
              Paste a recipe video link and let CookFlow do the hard work. Our AI analyzes the video and creates a detailed recipe for you.
            </p>
          </header>

          {stage === 'input' && (
            <div className="card p-6 sm:p-8 animate-slide-up">
              <div className="flex gap-2 mb-6" role="tablist">
                <button
                  role="tab"
                  aria-selected={mode === 'url'}
                  onClick={() => setMode('url')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                    mode === 'url'
                      ? 'bg-primary-600 text-white'
                      : 'text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800'
                  }`}
                >
                  <Film className="h-4 w-4 mr-2 inline" />
                  Video URL
                </button>
                <button
                  role="tab"
                  aria-selected={mode === 'image'}
                  onClick={() => setMode('image')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                    mode === 'image'
                      ? 'bg-primary-600 text-white'
                      : 'text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800'
                  }`}
                >
                  <Image className="h-4 w-4 mr-2 inline" />
                  Upload Image
                </button>
                <button
                  role="tab"
                  aria-selected={mode === 'video'}
                  onClick={() => setMode('video')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                    mode === 'video'
                      ? 'bg-primary-600 text-white'
                      : 'text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800'
                  }`}
                  disabled
                >
                  <Upload className="h-4 w-4 mr-2 inline" />
                  Upload Video
                </button>
              </div>

              {mode === 'url' && (
                <div>
                  <label htmlFor="video-url" className="label">Paste Instagram, YouTube or Recipe Video URL</label>
                  <div className="relative">
                    <input
                      id="video-url"
                      type="url"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError(''); }}
                      placeholder="https://www.instagram.com/reel/... or https://youtube.com/watch?v=..."
                      className="input pr-12"
                    />
                    {url && (
                      <button
                        onClick={() => { setUrl(''); setError(''); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-warm-100 dark:hover:bg-charcoal-800 transition-colors"
                        aria-label="Clear URL"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-charcoal-500 dark:text-charcoal-400">
                    Supported: Instagram Reels, YouTube Shorts, TikTok, Facebook Reels
                  </p>
                  <Button 
                    className="w-full mt-6" 
                    size="lg" 
                    leftIcon={<Sparkles className="h-5 w-5" />}
                    onClick={handleAnalyze}
                    disabled={!url.trim()}
                  >
                    Analyze Recipe
                  </Button>
                </div>
              )}

              {(mode === 'image' || mode === 'video') && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-2xl bg-warm-100 dark:bg-charcoal-800 flex items-center justify-center mx-auto mb-4">
                    {mode === 'image' ? <Image className="h-10 w-10 text-charcoal-400" /> : <Upload className="h-10 w-10 text-charcoal-400" />}
                  </div>
                  <h3 className="text-lg font-medium text-charcoal-900 dark:text-warm-100 mb-2">
                    {mode === 'image' ? 'Upload Food Photo' : 'Upload Video File'}
                  </h3>
                  <p className="text-charcoal-500 dark:text-charcoal-400 mb-6">
                    Drag and drop or click to select a file
                  </p>
                  <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />}>
                    Choose File
                  </Button>
                  <p className="mt-3 text-xs text-charcoal-400 dark:text-charcoal-500">
                    {mode === 'image' ? 'JPG, PNG up to 10MB' : 'MP4, MOV up to 100MB'}
                  </p>
                </div>
              )}
            </div>
          )}

          {stage === 'analyzing' && (
            <div className="card p-8 animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-charcoal-900 dark:text-warm-100 mb-2">Analyzing your video...</h2>
                <p className="text-charcoal-500 dark:text-charcoal-400">This usually takes 15-30 seconds</p>
              </div>

              <div className="space-y-4" role="list" aria-label="Analysis progress">
                {importSteps.map((step, index) => {
                  let status = 'pending';
                  if (index < currentStep) status = 'complete';
                  else if (index === currentStep) status = 'current';

                  return (
                    <div key={step.id} className="flex items-center gap-4 p-4 rounded-xl transition-colors" role="listitem">
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
                          <Circle className="h-5 w-5 text-charcoal-300 dark:text-charcoal-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${status === 'current' ? 'text-charcoal-900 dark:text-warm-100' : 'text-charcoal-700 dark:text-warm-200'}`}>
                          {step.label}
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
            </div>
          )}

          {stage === 'result' && (
            <div className="space-y-6 animate-slide-up">
              <div className="card p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal-900 dark:text-warm-100 mb-1">{mockResult.dish}</h2>
                    <div className="flex items-center gap-4 text-sm text-charcoal-500 dark:text-charcoal-400">
                      <span className="flex items-center gap-1"><Film className="h-3.5 w-3.5" /> Video Recipe</span>
                      <span className="flex items-center gap-1">⏱ {mockResult.prepTime + mockResult.cookTime}m</span>
                      <span className="flex items-center gap-1">👥 {mockResult.servings} servings</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{mockResult.confidence}%</span>
                    </div>
                    <p className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-1">Confidence</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {mockResult.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-warm-100 text-charcoal-600 text-xs font-medium dark:bg-charcoal-800 dark:text-warm-300">
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-3 flex items-center gap-2">
                      <Film className="h-4 w-4 text-primary-600" />
                      Ingredients
                    </h3>
                    <ul className="space-y-2" role="list">
                      {mockResult.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-warm-50 dark:bg-charcoal-800 text-sm">
                          <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400 flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-charcoal-700 dark:text-warm-200">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-3 flex items-center gap-2">
                      <Upload className="h-4 w-4 text-primary-600" />
                      Steps
                    </h3>
                    <ol className="space-y-2" role="list">
                      {mockResult.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 p-2 rounded-lg bg-warm-50 dark:bg-charcoal-800 text-sm">
                          <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400 flex-shrink-0">
                            {i + 1}
                          </span>
                          <span className="text-charcoal-700 dark:text-warm-200">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-warm-200 dark:border-charcoal-800">
                  <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mb-3 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    AI-generated content. Please verify ingredients and instructions before cooking.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/cook/1`}>
                      <Button size="lg" leftIcon={<Sparkles className="h-5 w-5" />} className="flex-1 sm:flex-none">
                        Start Cooking
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={handleRetry} leftIcon={<ArrowRight className="h-4 w-4" />}>
                      Import Another
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}