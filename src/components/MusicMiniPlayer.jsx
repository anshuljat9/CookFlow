import { useState, useEffect, useRef, useCallback } from 'react';
import { Music, Play, Pause, ChevronRight, Volume2, VolumeX, ExternalLink, X, Loader2 } from 'lucide-react';
import { musicService } from '../services/music/musicService';
import { preferenceService } from '../services/preferenceService';
import Button from './Button';

export default function MusicMiniPlayer({
  _recipe,
  isOpen,
  onClose,
  onMoodChange,
}) {
  const [currentMood, setCurrentMood] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const iframeRef = useRef(null);

  useEffect(() => {
    const prefs = preferenceService.getPreferences();
    setCurrentMood(prefs.musicPreferences.mood);
    setCurrentProvider(prefs.musicPreferences.platform);
  }, []);

  const loadRecommendations = useCallback(async () => {
    if (!currentMood) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await musicService.getRecommendations(currentMood);
      if (result.playlists.length > 0) {
        setCurrentPlaylist(result.playlists[0]);
        setCurrentProvider(result.provider);
      } else {
        const fallback = await musicService.getFallbackRecommendations(currentMood);
        if (fallback.playlists.length > 0) {
          setCurrentPlaylist(fallback.playlists[0]);
          setCurrentProvider(fallback.provider);
        } else {
          setError('No playlists found for this mood');
        }
      }
    } catch {
      setError('Failed to load music recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [currentMood]);

  useEffect(() => {
    if (currentMood && !currentPlaylist) {
      loadRecommendations();
    }
  }, [currentMood, currentPlaylist, loadRecommendations]);

  const handlePlay = () => {
    if (currentPlaylist && currentProvider) {
      const embedUrl = musicService.getEmbedUrl(currentProvider, currentPlaylist.id);
      if (iframeRef.current) {
        iframeRef.current.src = embedUrl;
      }
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
    setIsPlaying(false);
  };

  const handleOpenPlaylist = () => {
    if (currentPlaylist && currentProvider) {
      const url = musicService.getPlaylistUrl(currentProvider, currentPlaylist.id);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleChangeMood = () => {
    setShowMoodSelector(true);
  };

  const handleMoodSelect = (moodId) => {
    setCurrentMood(moodId);
    setCurrentPlaylist(null);
    preferenceService.setMusicMood(moodId);
    onMoodChange?.(moodId);
    setShowMoodSelector(false);
  };

  const handlePlatformChange = () => {
    const prefs = preferenceService.getPreferences();
    const available = musicService.getAvailableProviders();
    const currentIndex = available.indexOf(prefs.musicPreferences.platform);
    const nextIndex = (currentIndex + 1) % available.length;
    const newPlatform = available[nextIndex];
    preferenceService.setMusicPlatform(newPlatform);
    setCurrentProvider(newPlatform);
    setCurrentPlaylist(null);
    loadRecommendations();
  };

  const availableProviders = musicService.getAvailableProviders();

  if (!isOpen) return null;

  const moodInfo = musicService.getMoodInfo(currentMood);

  return (
    <div className="fixed bottom-4 lg:bottom-24 right-4 left-4 lg:left-auto lg:w-80 z-40 animate-slide-up" role="region" aria-label="Cooking music player">
      <div className="card bg-charcoal-900 border-charcoal-800 shadow-xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Music className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-white">Cooking Music</p>
                <p className="text-xs text-charcoal-400 capitalize">{currentMood} {moodInfo?.icon || ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleChangeMood} aria-label="Change mood">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close music player">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showMoodSelector && (
            <div className="mb-4 animate-slide-up">
              <MoodSelector
                selectedMood={currentMood}
                onMoodSelect={handleMoodSelect}
                onClose={() => setShowMoodSelector(false)}
                showRecommendations={false}
                isLoading={isLoading}
              />
            </div>
          )}

          {!showMoodSelector && currentPlaylist && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-charcoal-800 flex items-center gap-3">
                {currentPlaylist.imageUrl && (
                  <img src={currentPlaylist.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{currentPlaylist.name}</p>
                  <p className="text-xs text-charcoal-400 truncate">{currentPlaylist.owner || currentPlaylist.description}</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-primary-900/30 text-primary-300 capitalize">
                  {currentProvider}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={isPlaying ? 'danger' : 'primary'}
                  size="lg"
                  className="flex-1"
                  leftIcon={isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  onClick={isPlaying ? handlePause : handlePlay}
                  disabled={isLoading}
                >
                  {isPlaying ? 'Playing' : 'Play'}
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                  onClick={handleOpenPlaylist}
                  className="flex-1"
                >
                  Open
                </Button>
              </div>

              {isPlaying && currentPlaylist && currentProvider && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    ref={iframeRef}
                    src={musicService.getEmbedUrl(currentProvider, currentPlaylist.id)}
                    title={`Playing ${currentPlaylist.name} on ${currentProvider}`}
                    className="w-full h-full border-0"
                    allow="encrypted-media; autoplay"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVolume(volume > 0 ? 0 : 1)}
                  aria-label={volume > 0 ? 'Mute' : 'Unmute'}
                >
                  {volume > 0 ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlatformChange}
                  aria-label="Change music platform"
                  disabled={availableProviders.length <= 1}
                >
                  <span className="text-xs font-medium capitalize">{currentProvider}</span>
                </Button>
              </div>
            </div>
          )}

          {!showMoodSelector && !currentPlaylist && !isLoading && (
            <div className="text-center py-4 text-charcoal-400">
              <p className="text-sm mb-2">No music available for this mood</p>
              <Button variant="outline" size="sm" onClick={handleChangeMood}>
                Try Another Mood
              </Button>
            </div>
          )}

          {error && !showMoodSelector && (
            <div className="p-3 rounded-xl bg-red-900/30 border border-red-800/50 text-red-300 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Lazy load MoodSelector to avoid circular dependency
function MoodSelector({ selectedMood, onMoodSelect, onClose, showRecommendations, isLoading }) {
  const MOODS = [
    { id: 'chill', name: 'Chill', icon: '😌', description: 'Relaxed music for a slow cooking session' },
    { id: 'energetic', name: 'Energetic', icon: '🔥', description: 'Upbeat music to keep you moving in the kitchen' },
    { id: 'lofi', name: 'Lo-fi', icon: '🌙', description: 'Lo-fi beats for focused cooking' },
    { id: 'romantic', name: 'Romantic', icon: '❤️', description: 'Soft, romantic tunes for a special meal' },
    { id: 'bollywood', name: 'Bollywood', icon: '🇮🇳', description: 'Bollywood hits for a flavorful cooking session' },
    { id: 'rock', name: 'Rock', icon: '🎸', description: 'Rock classics for high-energy cooking' },
    { id: 'jazz', name: 'Jazz', icon: '🎷', description: 'Smooth jazz for a sophisticated kitchen atmosphere' },
    { id: 'classical', name: 'Classical', icon: '🎼', description: 'Classical music for a calm, focused cooking experience' },
  ];

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {MOODS.map(mood => (
        <button
          key={mood.id}
          onClick={() => onMoodSelect(mood.id)}
          className={`w-full p-3 rounded-xl text-left transition-all ${
            selectedMood === mood.id
              ? 'bg-primary-900/30 border-2 border-primary-500'
              : 'bg-charcoal-800 hover:bg-charcoal-700 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{mood.icon}</span>
            <div>
              <p className="font-medium text-white">{mood.name}</p>
              <p className="text-xs text-charcoal-400">{mood.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}