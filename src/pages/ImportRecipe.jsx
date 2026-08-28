import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Image, Upload, Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import VideoUpload from '../components/VideoUpload';
import AnalysisProgress from '../components/AnalysisProgress';
import RecipePreview from '../components/RecipePreview';
import ExtractionError from '../components/ExtractionError';
import { aiRecipeExtractionService } from '../services/aiRecipeExtractionService';
import { detectVideoPlatform, validateVideoUrl } from '../utils/videoPlatformDetector';

const importSteps = [
  { id: 'fetching', label: 'Fetching video data', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'extracting_audio', label: 'Extracting audio transcript', icon: <Film className="h-5 w-5" /> },
  { id: 'extracting_frames', label: 'Analyzing video frames', icon: <Image className="h-5 w-5" /> },
  { id: 'analyzing', label: 'AI recipe analysis', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'validating', label: 'Validating extraction', icon: <Upload className="h-5 w-5" /> },
];

export default function ImportRecipe() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('url');
  const [url, setUrl] = useState('');
  const [stage, setStage] = useState('input');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [extractedRecipe, setExtractedRecipe] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentStageLabel, setCurrentStageLabel] = useState('');
  const isPollingRef = useRef(false);

  // Platform detection for URL
  const platformInfo = detectVideoPlatform(url);
  const urlValidation = validateVideoUrl(url);

  // Listen for job updates from localStorage (polled by service)
  useEffect(() => {
    if (!jobId || stage !== 'analyzing') return;

    const checkJobStatus = () => {
      const job = aiRecipeExtractionService.loadJob(jobId);
      if (job) {
        setProgressPercent(job.progressPercent || 0);
        setCurrentStageLabel(job.currentStage || 'Processing...');
        
        if (job.status === 'completed' && job.extractedData) {
          setExtractedRecipe(job.extractedData);
          setStage('result');
          isPollingRef.current = false;
        } else if (job.status === 'failed') {
          setError(job.errorMessage || 'Failed to extract recipe from video');
          setStage('error');
          isPollingRef.current = false;
        } else if (job.status === 'cancelled') {
          handleRetry();
          isPollingRef.current = false;
        }
      }
    };

    // Initial check
    checkJobStatus();

    // Poll for updates
    const interval = setInterval(checkJobStatus, 1000);
    
    return () => clearInterval(interval);
  }, [jobId, stage, handleRetry]);

  const handleAnalyzeUrl = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    const validation = validateVideoUrl(url.trim());
    if (!validation.valid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    if (!validation.platformInfo?.supported) {
      setError(validation.platformInfo?.reason || 'This platform is not supported for URL extraction. Please upload the video directly.');
      return;
    }

    setError('');
    setStage('analyzing');
    setCurrentStep(0);
    setProgressPercent(0);
    setCurrentStageLabel('Starting analysis...');
    isPollingRef.current = true;

    // Create extraction job
    const job = aiRecipeExtractionService.createJob({
      sourceType: 'url',
      sourceUrl: url.trim(),
      sourcePlatform: validation.platformInfo?.platform,
    });
    setJobId(job.id);

    try {
      // Start async processing (service handles polling internally)
      const result = await aiRecipeExtractionService.processUrlExtraction(
        job.id,
        url.trim(),
        validation.platformInfo?.platform || 'unknown'
      );

      if (result) {
        setExtractedRecipe(result);
        setStage('result');
      } else {
        const failedJob = aiRecipeExtractionService.loadJob(job.id);
        setError(failedJob?.errorMessage || 'Failed to extract recipe from video');
        setStage('error');
      }
    } catch (err) {
      console.error('URL extraction error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStage('error');
    } finally {
      isPollingRef.current = false;
    }
  }, [url]);

  const handleFileSelect = useCallback((file, type) => {
    setSelectedFile(file);
    setSelectedFileType(type);
    setError('');
  }, []);

  const handleAnalyzeFile = useCallback(async () => {
    if (!selectedFile || !selectedFileType) {
      setError('Please select a file first');
      return;
    }

    setError('');
    setStage('analyzing');
    setCurrentStep(0);
    setProgressPercent(0);
    setCurrentStageLabel('Starting analysis...');
    isPollingRef.current = true;

    // Create extraction job
    const job = aiRecipeExtractionService.createJob({
      sourceType: 'upload',
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
    });
    setJobId(job.id);

    try {
      let result = null;
      
      if (selectedFileType === 'video') {
        result = await aiRecipeExtractionService.processVideoUpload(job.id, selectedFile);
      } else {
        result = await aiRecipeExtractionService.processImageUpload(job.id, selectedFile);
      }

      if (result) {
        setExtractedRecipe(result);
        setStage('result');
      } else {
        const failedJob = aiRecipeExtractionService.loadJob(job.id);
        setError(failedJob?.errorMessage || 'Failed to extract recipe');
        setStage('error');
      }
    } catch (err) {
      console.error('File extraction error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStage('error');
    } finally {
      isPollingRef.current = false;
    }
  }, [selectedFile, selectedFileType]);

  const handleRetry = useCallback(() => {
    setStage('input');
    setUrl('');
    setSelectedFile(null);
    setSelectedFileType(null);
    setError('');
    setExtractedRecipe(null);
    setJobId(null);
    setProgressPercent(0);
    setCurrentStageLabel('');
    setCurrentStep(0);
    isPollingRef.current = false;
  }, []);

  const handleBackToInput = useCallback(() => {
    handleRetry();
  }, [handleRetry]);

  const handleUploadInstead = useCallback(() => {
    setMode('video');
    setStage('input');
    setUrl('');
    setError('');
  }, []);

  const handleSaveRecipe = useCallback(async (updatedData) => {
    try {
      const converted = aiRecipeExtractionService.convertToRecipeFormat(updatedData, {
        sourceType: selectedFile ? 'upload' : 'url',
        sourceUrl: url || undefined,
        sourcePlatform: platformInfo.platform !== 'unknown' ? platformInfo.platform : undefined,
        jobId,
      });

      const recipeId = await aiRecipeExtractionService.saveExtractedRecipe(converted);
      
      if (recipeId && jobId) {
        aiRecipeExtractionService.updateJob(jobId, { 
          recipeId, 
          status: 'completed',
          extractedData: updatedData,
        });
      }

      navigate(`/recipe/${recipeId}`);
    } catch (err) {
      console.error('Failed to save recipe:', err);
      setError('Failed to save recipe. Please try again.');
      setStage('error');
    }
  }, [selectedFile, url, platformInfo.platform, jobId, navigate]);

  const handleAnalyzeAgain = useCallback(() => {
    if (selectedFile) {
      handleAnalyzeFile();
    } else if (url) {
      handleAnalyzeUrl();
    }
  }, [selectedFile, url, handleAnalyzeFile, handleAnalyzeUrl]);

  const handleCancel = useCallback(() => {
    if (jobId) {
      aiRecipeExtractionService.updateJob(jobId, { status: 'cancelled' });
    }
    handleRetry();
  }, [jobId, handleRetry]);

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
              Turn food videos into recipes
            </h1>
            <p className="text-lg text-charcoal-600 dark:text-charcoal-300 max-w-2xl mx-auto">
              Paste a supported video link or upload a cooking video/image. CookFlow's AI will analyze it and create a detailed recipe for you.
            </p>
          </header>

          {stage === 'input' && (
            <div className="card p-6 sm:p-8 animate-slide-up">
              <div className="flex gap-2 mb-6" role="tablist">
                <button
                  role="tab"
                  aria-selected={mode === 'url'}
                  onClick={() => { setMode('url'); setError(''); }}
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
                  onClick={() => { setMode('image'); setError(''); }}
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
                  onClick={() => { setMode('video'); setError(''); }}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                    mode === 'video'
                      ? 'bg-primary-600 text-white'
                      : 'text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800'
                  }`}
                >
                  <Upload className="h-4 w-4 mr-2 inline" />
                  Upload Video
                </button>
              </div>

              {mode === 'url' && (
                <div>
                  <label htmlFor="video-url" className="label">Paste YouTube or Direct Video URL</label>
                  <div className="relative">
                    <input
                      id="video-url"
                      type="url"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError(''); }}
                      placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                      className="input pr-12"
                      disabled={stage === 'analyzing'}
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
                  
                  {/* Platform detection feedback */}
                  {url && (
                    <div className="mt-3 p-3 rounded-xl text-sm">
                      {urlValidation.valid ? (
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Supported: {platformInfo.platform ? platformInfo.platform.charAt(0).toUpperCase() + platformInfo.platform.slice(1) : 'Direct video'}</span>
                        </div>
                      ) : urlValidation.platformInfo && !urlValidation.valid ? (
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                          <AlertCircle className="h-4 w-4" />
                          <span>{urlValidation.error}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                          <AlertCircle className="h-4 w-4" />
                          <span>Invalid URL format</span>
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  )}

                  <p className="mt-3 text-sm text-charcoal-500 dark:text-charcoal-400">
                    Currently supported: YouTube (public videos), Direct video files (.mp4, .webm, .mov)
                    <br />
                    <span className="text-amber-600 dark:text-amber-400">Note:</span> Instagram, TikTok, Facebook require login - please upload the video file directly instead.
                  </p>

                  <Button 
                    className="w-full mt-6" 
                    size="lg" 
                    leftIcon={<Sparkles className="h-5 w-5" />}
                    onClick={handleAnalyzeUrl}
                    disabled={!url.trim() || !urlValidation.valid || stage === 'analyzing'}
                  >
                    Analyze Recipe
                  </Button>
                </div>
              )}

              {(mode === 'image' || mode === 'video') && (
                <div>
                  <VideoUpload
                    onFileSelect={handleFileSelect}
                    disabled={stage === 'analyzing'}
                    maxVideoSizeMB={100}
                    maxImageSizeMB={10}
                  />
                  
                  {selectedFile && (
                    <div className="mt-6">
                      <Button 
                        className="w-full" 
                        size="lg" 
                        leftIcon={<Sparkles className="h-5 w-5" />}
                        onClick={handleAnalyzeFile}
                        disabled={stage === 'analyzing'}
                      >
                        {mode === 'video' ? 'Analyze Video' : 'Analyze Image'}
                      </Button>
                    </div>
                  )}

                  <p className="mt-3 text-xs text-charcoal-400 dark:text-charcoal-500 text-center">
                    {mode === 'image' ? 'JPG, PNG, WebP up to 10MB' : 'MP4, WebM, MOV up to 100MB, max 5 minutes'}
                  </p>
                </div>
              )}
            </div>
          )}

          {stage === 'analyzing' && (
            <AnalysisProgress
              currentStage={currentStageLabel}
              progressPercent={progressPercent}
              stages={importSteps}
              onCancel={handleCancel}
              showCancel={true}
            />
          )}

          {stage === 'result' && extractedRecipe && (
            <RecipePreview
              data={extractedRecipe}
              onSave={handleSaveRecipe}
              onCancel={handleBackToInput}
              onAnalyzeAgain={handleAnalyzeAgain}
              isSaving={false}
            />
          )}

          {stage === 'error' && (
            <ExtractionError
              error={error}
              onRetry={selectedFile ? handleAnalyzeFile : handleAnalyzeUrl}
              onUploadInstead={handleUploadInstead}
              onBack={handleBackToInput}
              isLoading={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}