import { useState } from 'react';
import { Check, ChevronRight, Music, X } from 'lucide-react';
import Button from './Button';

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

export default function MoodSelector({
  selectedMood,
  onMoodSelect,
  onClose,
  showRecommendations = true,
  _isLoading = false,
  recommendations = null,
  _error = null,
  _availableProviders = [],
}) {
  const handleMoodClick = (moodId) => {
    onMoodSelect(moodId);
  };

  return (
    <div className="card bg-charcoal-900 border-charcoal-800 p-6 max-w-md mx-auto animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Music className="h-5 w-5 text-primary-500" />
          Set the Mood
        </h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close mood selector">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <p className="text-sm text-charcoal-400 mb-6">What's the vibe for this cooking session?</p>

      <div className="grid grid-cols-2 gap-3 mb-6" role="radiogroup" aria-label="Select cooking mood">
        {MOODS.map(mood => (
          <button
            key={mood.id}
            role="radio"
            aria-checked={selectedMood === mood.id}
            onClick={() => handleMoodClick(mood.id)}
            className={`p-4 rounded-xl transition-all text-left ${
              selectedMood === mood.id
                ? 'bg-primary-900/30 border-2 border-primary-500'
                : 'bg-charcoal-800 hover:bg-charcoal-700 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mood.icon}</span>
              <div>
                <p className="font-medium text-white">{mood.name}</p>
                <p className="text-xs text-charcoal-400">{mood.description}</p>
              </div>
            </div>
            {selectedMood === mood.id && (
              <Check className="h-5 w-5 text-primary-500 ml-auto" />
            )}
          </button>
        ))}
      </div>

      {selectedMood && showRecommendations && (
        <div className="pt-4 border-t border-charcoal-800">
          <h3 className="font-medium text-white mb-4">Recommended for you</h3>
          
          {isLoading ? (
            <div className="space-y-3" role="status" aria-label="Loading music recommendations">
              {[1, 2].map(i => (
                <div key={i} className="p-3 rounded-xl bg-charcoal-800 animate-pulse">
                  <div className="h-4 w-3/4 bg-charcoal-700 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-charcoal-700 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-900/30 border border-red-800/50 text-red-300">
              <p className="text-sm">{error}</p>
              {availableProviders.length > 0 && (
                <Button variant="outline" size="sm" className="mt-2" onClick={() => onMoodSelect(selectedMood)}>
                  Try Again
                </Button>
              )}
            </div>
          ) : recommendations?.playlists?.length > 0 ? (
            <div className="space-y-3">
              {recommendations.playlists.slice(0, 3).map(playlist => (
                <div key={playlist.id} className="p-3 rounded-xl bg-charcoal-800 flex items-center gap-3">
                  {playlist.imageUrl && (
                    <img src={playlist.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{playlist.name}</p>
                    <p className="text-xs text-charcoal-400 truncate">{playlist.owner || playlist.description}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary-900/30 text-primary-300 capitalize">
                    {recommendations.provider}
                  </span>
                </div>
              ))}
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2"
                leftIcon={<ChevronRight className="h-4 w-4" />}
              >
                Open in {recommendations.provider === 'spotify' ? 'Spotify' : 'YouTube'}
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-charcoal-800 text-center text-charcoal-400">
              <p className="text-sm">No playlists found for this mood.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}