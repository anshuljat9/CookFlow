import { useState, useCallback, useRef, useEffect } from 'react';
import { FileVideo, FileImage, Loader2, CheckCircle2, AlertCircle, X, RotateCcw, Trash2, Sparkles } from 'lucide-react';
import Button from './Button';

/**
 * VideoUpload component for uploading video or image files
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback when file is selected
 * @param {boolean} [props.disabled=false] - Whether upload is disabled
 * @param {number} [props.maxVideoSizeMB=100] - Max video size in MB
 * @param {number} [props.maxImageSizeMB=10] - Max image size in MB
 * @param {string[]} [props.acceptedVideoTypes] - Accepted video MIME types
 * @param {string[]} [props.acceptedImageTypes] - Accepted image MIME types
 */
function VideoUpload({
  onFileSelect,
  disabled = false,
  maxVideoSizeMB = 100,
  maxImageSizeMB = 10,
  acceptedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'],
  acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp'],
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    if (acceptedVideoTypes.includes(file.type)) {
      if (file.size > maxVideoSizeMB * 1024 * 1024) {
        return { valid: false, type: 'video', error: 'Video file too large. Maximum size is ' + maxVideoSizeMB + 'MB.' };
      }
      return { valid: true, type: 'video' };
    }
    if (acceptedImageTypes.includes(file.type)) {
      if (file.size > maxImageSizeMB * 1024 * 1024) {
        return { valid: false, type: 'image', error: 'Image file too large. Maximum size is ' + maxImageSizeMB + 'MB.' };
      }
      return { valid: true, type: 'image' };
    }
    return { valid: false, type: null, error: 'Unsupported file type. Please use MP4, WebM, MOV, JPG, PNG, or WebP.' };
  }, [acceptedVideoTypes, acceptedImageTypes, maxVideoSizeMB, maxImageSizeMB]);

  const handleFileSelect = useCallback((file) => {
    setError(null);
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setSelectedFile(file);
    setFileType(validation.type);
    onFileSelect(file, validation.type);
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setFileType(null);
    setDuration(null);
    setError(null);
    if (videoRef.current) {
      videoRef.current.src = '';
    }
  }, []);

  // Get video duration when file is selected
  useEffect(() => {
    if (selectedFile && fileType === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.src = URL.createObjectURL(selectedFile);
      video.onloadedmetadata = function() {
        setDuration(Math.round(video.duration));
        URL.revokeObjectURL(video.src);
      };
      video.onerror = function() {
        URL.revokeObjectURL(video.src);
      };
    }
  }, [selectedFile, fileType]);

  const formatDuration = function(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + secs.toString().padStart(2, '0');
  };

  const formatFileSize = function(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!selectedFile) {
    return (
      <div
        className={'relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ' + 
          (isDragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-warm-200 dark:border-charcoal-700 hover:border-primary-300 dark:hover:border-primary-700') + 
          (disabled ? ' opacity-50 cursor-not-allowed' : '')}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => !disabled && (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
        aria-label="Upload video or image file"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={[...acceptedVideoTypes, ...acceptedImageTypes].join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-hidden="true"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-warm-100 dark:bg-charcoal-800 flex items-center justify-center">
            <FileVideo className="h-8 w-8 text-charcoal-400 dark:text-charcoal-500" />
          </div>
          <div>
            <p className="font-medium text-charcoal-900 dark:text-warm-100">
              {disabled ? 'Uploads disabled' : 'Drag & drop video or image'}
            </p>
            <p className="text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">
              MP4, WebM, MOV up to {maxVideoSizeMB}MB · JPG, PNG, WebP up to {maxImageSizeMB}MB
            </p>
          </div>
          {!disabled && (
            <Button variant="outline" leftIcon={<FileVideo className="h-4 w-4" />}>
              Choose File
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-4 rounded-2xl bg-warm-50 dark:bg-charcoal-800 border border-warm-200 dark:border-charcoal-700 animate-fade-in">
      <button
        onClick={clearFile}
        className="absolute top-2 right-2 p-1 rounded-lg text-charcoal-400 hover:text-charcoal-600 hover:bg-warm-200 dark:hover:bg-charcoal-700 transition-colors"
        aria-label="Remove file"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-white dark:bg-charcoal-900 flex items-center justify-center relative overflow-hidden flex-shrink-0">
          {fileType === 'video' && (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 text-white text-xs font-mono">
                {duration ? formatDuration(duration) : 'Loading...'}
              </div>
            </>
          )}
          {fileType === 'image' && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded food image"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-charcoal-900 dark:text-warm-100 truncate">{selectedFile.name}</p>
          <div className="flex items-center gap-4 mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">
            <span className="flex items-center gap-1">
              {fileType === 'video' ? <FileVideo className="h-3.5 w-3.5" /> : <FileImage className="h-3.5 w-3.5" />}
              {fileType === 'video' ? 'Video' : 'Image'}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-charcoal-300 dark:bg-charcoal-600" />
              {formatFileSize(selectedFile.size)}
            </span>
            {duration && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-charcoal-300 dark:bg-charcoal-600" />
                {formatDuration(duration)}
              </span>
            )}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={clearFile}
          className="text-charcoal-400 hover:text-charcoal-600 dark:hover:text-warm-300"
          aria-label="Remove file"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default VideoUpload;