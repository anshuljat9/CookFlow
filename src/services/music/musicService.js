import { preferenceService } from '../preferenceService';

const MOOD_PLAYLISTS = {
  chill: {
    spotify: {
      name: 'Chill Cooking',
      playlists: [
        { id: '37i9dQZF1DX4sWSpwq3LiO', name: 'Lo-Fi Beats' },
        { id: '37i9dQZF1DWZd79rJ6a7lp', name: 'Chill Hits' },
        { id: '37i9dQZF1DX2sUQwD7tbmL', name: 'Ambient Chill' },
      ],
    },
    youtube: {
      name: 'Chill Cooking',
      playlists: [
        { id: 'PLQwVIlKxHM67rJm7bNWzZJhYdJ9yGJ8k', name: 'Lo-Fi Girl - Study/Chill' },
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I8', name: 'Chill Cooking Vibes' },
      ],
    },
  },
  energetic: {
    spotify: {
      name: 'Energetic Cooking',
      playlists: [
        { id: '37i9dQZF1DX70RN3TfWWJh', name: 'Today\'s Top Hits' },
        { id: '37i9dQZF1DX4dyzvUAaK0Z', name: 'Power Workout' },
        { id: '37i9dQZF1DX9XIFQuFvzM4', name: 'Happy Hits!' },
      ],
    },
    youtube: {
      name: 'Energetic Cooking',
      playlists: [
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I8', name: 'Upbeat Cooking Music' },
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I9', name: 'Energetic Kitchen Vibes' },
      ],
    },
  },
  lofi: {
    spotify: {
      name: 'Lo-Fi Cooking',
      playlists: [
        { id: '37i9dQZF1DX4sWSpwq3LiO', name: 'Lo-Fi Beats' },
        { id: '37i9dQZF1DWYcwmX1qV93E', name: 'Lo-Fi Cafe' },
        { id: '37i9dQZF1DX3Ogo9pFvBkY', name: 'Deep Focus' },
      ],
    },
    youtube: {
      name: 'Lo-Fi Cooking',
      playlists: [
        { id: 'PLQwVIlKxHM67rJm7bNWzZJhYdJ9yGJ8k', name: 'Lofi Girl - Beats to Relax/Study' },
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I8', name: 'Lo-Fi Kitchen Vibes' },
      ],
    },
  },
  romantic: {
    spotify: {
      name: 'Romantic Cooking',
      playlists: [
        { id: '37i9dQZF1DX5Ejj0EkURtP', name: 'Romantic Dinner' },
        { id: '37i9dQZF1DWYBO1MoTDhZI', name: 'Love Songs' },
        { id: '37i9dQZF1DX9XIFQuFvzM4', name: 'Slow Jam' },
      ],
    },
    youtube: {
      name: 'Romantic Cooking',
      playlists: [
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I8', name: 'Romantic Dinner Music' },
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I9', name: 'Acoustic Love Songs' },
      ],
    },
  },
  bollywood: {
    spotify: {
      name: 'Bollywood Cooking',
      playlists: [
        { id: '37i9dQZF1DX0XUsuxWHRQd', name: 'Bollywood Butter' },
        { id: '37i9dQZF1DWYcwmX1qV93E', name: 'Bollywood Hits' },
        { id: '37i9dQZF1DX4dyzvUAaK0Z', name: 'Desi Hits' },
      ],
    },
    youtube: {
      name: 'Bollywood Cooking',
      playlists: [
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I8', name: 'Bollywood Cooking Music' },
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I9', name: 'Bollywood Hits 2024' },
      ],
    },
  },
  rock: {
    spotify: {
      name: 'Rock Cooking',
      playlists: [
        { id: '37i9dQZF1DXcBWIGoYBM5M', name: 'Rock Classics' },
        { id: '37i9dQZF1DX1s9knjP51Oa', name: 'Rock This' },
        { id: '37i9dQZF1DWYBO1MoTDhZI', name: 'Hard Rock' },
      ],
    },
    youtube: {
      name: 'Rock Cooking',
      playlists: [
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I8', name: 'Classic Rock Kitchen' },
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I9', name: 'Rock Cooking Vibes' },
      ],
    },
  },
  jazz: {
    spotify: {
      name: 'Jazz Cooking',
      playlists: [
        { id: '37i9dQZF1DXbITWG1ZJKYt', name: 'Jazz Vibes' },
        { id: '37i9dQZF1DWYBO1MoTDhZI', name: 'Jazz for Dinner' },
        { id: '37i9dQZF1DX2sUQwD7tbmL', name: 'Smooth Jazz' },
      ],
    },
    youtube: {
      name: 'Jazz Cooking',
      playlists: [
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I8', name: 'Jazz Kitchen Vibes' },
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I9', name: 'Smooth Jazz for Cooking' },
      ],
    },
  },
  classical: {
    spotify: {
      name: 'Classical Cooking',
      playlists: [
        { id: '37i9dQZF1DX5Ejj0EkURtP', name: 'Classical Essentials' },
        { id: '37i9dQZF1DWYcwmX1qV93E', name: 'Peaceful Piano' },
        { id: '37i9dQZF1DX2sUQwD7tbmL', name: 'Classical Focus' },
      ],
    },
    youtube: {
      name: 'Classical Cooking',
      playlists: [
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I8', name: 'Classical Music for Cooking' },
        { id: 'PL_M4z6yE5n5qJ8Z9V2Q7W1E3R4T5Y6U7I9', name: 'Peaceful Piano Kitchen' },
      ],
    },
  },
};

class SpotifyProvider {
  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    this.redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/auth/spotify/callback`;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    if (!this.clientId) {
      return { success: false, error: 'Spotify not configured' };
    }

    const storedToken = localStorage.getItem('spotify_access_token');
    const storedExpiry = localStorage.getItem('spotify_token_expiry');

    if (storedToken && storedExpiry && Date.now() < parseInt(storedExpiry)) {
      this.accessToken = storedToken;
      this.tokenExpiry = parseInt(storedExpiry);
      return { success: true };
    }

    const scopes = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=token&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;

    window.location.href = authUrl;
    return { success: false, error: 'Redirecting to Spotify...' };
  }

  handleCallback(hash) {
    const params = new URLSearchParams(hash.replace('#', ''));
    this.accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (this.accessToken && expiresIn) {
      this.tokenExpiry = Date.now() + parseInt(expiresIn) * 1000;
      localStorage.setItem('spotify_access_token', this.accessToken);
      localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString());
      return { success: true };
    }
    return { success: false, error: 'Invalid callback' };
  }

  isAuthenticated() {
    return !!this.accessToken && (!this.tokenExpiry || Date.now() < this.tokenExpiry);
  }

  async searchPlaylists(mood) {
    if (!this.isAuthenticated()) {
      const auth = await this.authenticate();
      if (!auth.success) return { playlists: [], error: auth.error };
    }

    try {
      const moodData = MOOD_PLAYLISTS[mood]?.spotify;
      if (!moodData) return { playlists: [], error: 'Mood not found' };

      const playlists = [];
      for (const pl of moodData.playlists) {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${pl.id}`, {
          headers: { 'Authorization': `Bearer ${this.accessToken}` },
        });
        if (response.ok) {
          const data = await response.json();
          playlists.push({
            id: data.id,
            name: data.name,
            description: data.description,
            imageUrl: data.images?.[0]?.url,
            externalUrl: data.external_urls?.spotify,
            owner: data.owner?.display_name,
            tracksTotal: data.tracks?.total,
            platform: 'spotify',
          });
        }
      }
      return { playlists, error: null };
    } catch (error) {
      return { playlists: [], error: error.message };
    }
  }

  getPlaylistUrl(playlistId) {
    return `https://open.spotify.com/playlist/${playlistId}`;
  }

  getEmbedUrl(playlistId) {
    return `https://open.spotify.com/embed/playlist/${playlistId}`;
  }

  logout() {
    this.accessToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
  }
}

class YouTubeProvider {
  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async searchPlaylists(mood) {
    if (!this.isConfigured()) {
      return { playlists: [], error: 'YouTube API not configured' };
    }

    try {
      const moodData = MOOD_PLAYLISTS[mood]?.youtube;
      if (!moodData) return { playlists: [], error: 'Mood not found' };

      const playlists = [];
      for (const pl of moodData.playlists) {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${pl.id}&key=${this.apiKey}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.items?.length > 0) {
            const item = data.items[0];
            playlists.push({
              id: item.id,
              name: item.snippet.title,
              description: item.snippet.description,
              imageUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
              externalUrl: `https://www.youtube.com/playlist?list=${item.id}`,
              owner: item.snippet.channelTitle,
              tracksTotal: item.contentDetails?.itemCount || 0,
              platform: 'youtube',
            });
          }
        }
      }
      return { playlists, error: null };
    } catch (error) {
      return { playlists: [], error: error.message };
    }
  }

  getPlaylistUrl(playlistId) {
    return `https://www.youtube.com/playlist?list=${playlistId}`;
  }

  getEmbedUrl(playlistId) {
    return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  }
}

class MusicService {
  constructor() {
    this.spotifyProvider = new SpotifyProvider();
    this.youtubeProvider = new YouTubeProvider();
  }

  getAvailableProviders() {
    const providers = [];
    if (this.spotifyProvider.clientId) providers.push('spotify');
    if (this.youtubeProvider.isConfigured()) providers.push('youtube');
    return providers;
  }

  getPreferredProvider() {
    const prefs = preferenceService.getPreferences();
    const available = this.getAvailableProviders();
    if (available.includes(prefs.musicPreferences.platform)) {
      return prefs.musicPreferences.platform;
    }
    return available[0] || null;
  }

  async getRecommendations(mood) {
    const provider = this.getPreferredProvider();
    if (!provider) {
      return { playlists: [], error: 'No music provider available', provider: null };
    }

    if (provider === 'spotify') {
      const result = await this.spotifyProvider.searchPlaylists(mood);
      return { ...result, provider: 'spotify' };
    } else if (provider === 'youtube') {
      const result = await this.youtubeProvider.searchPlaylists(mood);
      return { ...result, provider: 'youtube' };
    }

    return { playlists: [], error: 'Unknown provider', provider };
  }

  async getFallbackRecommendations(mood) {
    const providers = this.getAvailableProviders();
    for (const provider of providers) {
      if (provider === 'spotify') {
        const result = await this.spotifyProvider.searchPlaylists(mood);
        if (result.playlists.length > 0) return { ...result, provider: 'spotify' };
      } else if (provider === 'youtube') {
        const result = await this.youtubeProvider.searchPlaylists(mood);
        if (result.playlists.length > 0) return { ...result, provider: 'youtube' };
      }
    }
    return { playlists: [], error: 'No playlists found on any platform', provider: null };
  }

  getPlaylistUrl(provider, playlistId) {
    if (provider === 'spotify') return this.spotifyProvider.getPlaylistUrl(playlistId);
    if (provider === 'youtube') return this.youtubeProvider.getPlaylistUrl(playlistId);
    return null;
  }

  getEmbedUrl(provider, playlistId) {
    if (provider === 'spotify') return this.spotifyProvider.getEmbedUrl(playlistId);
    if (provider === 'youtube') return this.youtubeProvider.getEmbedUrl(playlistId);
    return null;
  }

  getMoods() {
    return Object.keys(MOOD_PLAYLISTS).map(key => ({
      id: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      ...this.getMoodInfo(key),
    }));
  }

  getMoodInfo(mood) {
    const descriptions = {
      chill: 'Relaxed music for a slow cooking session',
      energetic: 'Upbeat music to keep you moving in the kitchen',
      lofi: 'Lo-fi beats for focused cooking',
      romantic: 'Soft, romantic tunes for a special meal',
      bollywood: 'Bollywood hits for a flavorful cooking session',
      rock: 'Rock classics for high-energy cooking',
      jazz: 'Smooth jazz for a sophisticated kitchen atmosphere',
      classical: 'Classical music for a calm, focused cooking experience',
    };
    const icons = {
      chill: '😌',
      energetic: '🔥',
      lofi: '🌙',
      romantic: '❤️',
      bollywood: '🇮🇳',
      rock: '🎸',
      jazz: '🎷',
      classical: '🎼',
    };
    return {
      description: descriptions[mood] || '',
      icon: icons[mood] || '🎵',
    };
  }
}

export const musicService = new MusicService();
export default musicService;