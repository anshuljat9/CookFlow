import { AlertCircle, RotateCcw, Upload, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import Button from './Button';

/**
 * ExtractionError component for showing extraction errors
 * @param {Object} props
 * @param {string} props.error - Error message
 * @param {Function} [props.onRetry] - Retry callback
 * @param {Function} [props.onUploadInstead] - Upload instead callback
 * @param {Function} [props.onBack] - Back callback
 * @param {boolean} [props.isLoading=false] - Whether retry is in progress
 */
export default function ExtractionError({
  error,
  onRetry,
  onUploadInstead,
  onBack,
  isLoading = false,
}) {
  const isUnsupportedUrl = error.toLowerCase().includes('unsupported') || 
                           error.toLowerCase().includes('not accessible') ||
                           error.toLowerCase().includes('requires') ||
                           error.toLowerCase().includes('login') ||
                           error.toLowerCase().includes('private') ||
                           error.toLowerCase().includes('region');

  const isNoRecipe = error.toLowerCase().includes('not a cooking') ||
                     error.toLowerCase().includes('no recipe') ||
                     error.toLowerCase().includes('not appear');

  const isLowConfidence = error.toLowerCase().includes('confidence') ||
                          error.toLowerCase().includes('not confident');

  return (
    <div className="card p-8 animate-fade-in text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
        {isLoading ? (
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        ) : isUnsupportedUrl ? (
          <Upload className="h-8 w-8 text-amber-500" />
        ) : isNoRecipe ? (
          <Sparkles className="h-8 w-8 text-amber-500" />
        ) : (
          <AlertCircle className="h-8 w-8 text-red-500" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-charcoal-900 dark:text-warm-100 mb-2">
        {isUnsupportedUrl ? "Can't Access This Video" : 
         isNoRecipe ? "Not a Cooking Video" :
         isLowConfidence ? "Low Confidence Extraction" :
         "Extraction Failed"}
      </h3>

      <p className="text-charcoal-500 dark:text-charcoal-400 mb-6 max-w-sm mx-auto">
        {error}
      </p>

      <div className="space-y-3">
        {isUnsupportedUrl && onUploadInstead && (
          <Button 
            variant="primary" 
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={onUploadInstead}
            className="w-full"
            disabled={isLoading}
          >
            Upload Video Instead
          </Button>
        )}

        {(onRetry || onBack) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <Button 
                variant={isUnsupportedUrl || isNoRecipe ? 'outline' : 'primary'}
                leftIcon={<RotateCcw className="h-4 w-4" />}
                onClick={onRetry}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Retrying...' : 'Try Again'}
              </Button>
            )}
            {onBack && (
              <Button 
                variant="ghost" 
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={onBack}
                className="flex-1"
                disabled={isLoading}
              >
                Back to Import
              </Button>
            )}
          </div>
        )}

        {!onRetry && !onBack && !onUploadInstead && (
          <Button variant="outline" onClick={() => window.location.reload()} disabled={isLoading}>
            Refresh Page
          </Button>
        )}
      </div>

      <p className="mt-6 text-xs text-charcoal-400 dark:text-charcoal-500">
        Tip: For best results, use clear cooking videos with visible ingredients and spoken instructions.
      </p>
    </div>
  );
}