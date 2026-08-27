const PLATFORM_PATTERNS = [
  {
    platform: 'youtube',
    patterns: [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /^https?:\/\/(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ],
    supported: true,
  },
  {
    platform: 'instagram',
    patterns: [
      /^https?:\/\/(www\.)?instagram\.com\/reel\/([a-zA-Z0-9_-]+)/,
      /^https?:\/\/(www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)/,
      /^https?:\/\/(www\.)?instagram\.com\/tv\/([a-zA-Z0-9_-]+)/,
    ],
    supported: false, // Instagram requires login/API access
  },
  {
    platform: 'tiktok',
    patterns: [
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
      /^https?:\/\/vm\.tiktok\.com\/([a-zA-Z0-9]+)/,
      /^https?:\/\/(www\.)?tiktok\.com\/t\/([a-zA-Z0-9]+)/,
    ],
    supported: false, // TikTok requires API access
  },
  {
    platform: 'pinterest',
    patterns: [
      /^https?:\/\/(www\.)?pinterest\.com\/pin\/(\d+)/,
      /^https?:\/\/pin\.it\/([a-zA-Z0-9]+)/,
    ],
    supported: false, // Pinterest requires API access
  },
  {
    platform: 'facebook',
    patterns: [
      /^https?:\/\/(www\.)?facebook\.com\/.*\/videos\/(\d+)/,
      /^https?:\/\/fb\.watch\/([a-zA-Z0-9]+)/,
    ],
    supported: false, // Facebook requires API access
  },
];

/**
 * Detect video platform from URL
 * @param {string} url - Video URL
 * @returns {Object} Platform info
 */
export function detectVideoPlatform(url) {
  if (!url || typeof url !== 'string') {
    return { platform: 'unknown', supported: false, reason: 'Invalid URL' };
  }

  try {
    const parsedUrl = new URL(url.trim());
    
    // Check if it's a valid HTTP/HTTPS URL
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { platform: 'unknown', supported: false, reason: 'Invalid protocol' };
    }

    // Test against known platform patterns
    for (const { platform, patterns, supported } of PLATFORM_PATTERNS) {
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return {
            platform,
            supported,
            videoId: match[1],
            normalizedUrl: url,
            reason: supported ? 'Supported platform' : 'Platform requires authentication or API access',
          };
        }
      }
    }

    // Unknown platform but valid URL
    return { 
      platform: 'unknown', 
      supported: false, 
      normalizedUrl: url,
      reason: 'Unrecognized video platform' 
    };
  } catch {
    return { 
      platform: 'unknown', 
      supported: false, 
      reason: 'Invalid URL format' 
    };
  }
}

export function isSupportedPlatform(url) {
  return detectVideoPlatform(url).supported;
}

export function getPlatformDisplayName(platform) {
  const names = {
    youtube: 'YouTube',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    pinterest: 'Pinterest',
    facebook: 'Facebook',
    unknown: 'Unknown',
  };
  return names[platform] || 'Unknown';
}

export function getSupportedPlatforms() {
  return PLATFORM_PATTERNS.map(p => ({
    platform: p.platform,
    name: getPlatformDisplayName(p.platform),
    supported: p.supported,
  }));
}

/**
 * Validate video URL
 * @param {string} url - Video URL
 * @returns {Object} Validation result
 */
export function validateVideoUrl(url) {
  if (!url || !url.trim()) {
    return { valid: false, error: 'URL is required' };
  }

  const platformInfo = detectVideoPlatform(url.trim());
  
  if (platformInfo.platform === 'unknown') {
    return { 
      valid: false, 
      error: platformInfo.reason || 'Unrecognized video platform',
      platformInfo 
    };
  }

  if (!platformInfo.supported) {
    return { 
      valid: false, 
      error: `${getPlatformDisplayName(platformInfo.platform)} videos require direct upload. Please upload the video file instead.`,
      platformInfo 
    };
  }

  return { valid: true, platformInfo };
}

// Extract video ID from various YouTube URL formats
export function extractYouTubeVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Check if URL is a direct video file
export function isDirectVideoUrl(url) {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.mkv', '.avi', '.m4v'];
  try {
    const parsed = new URL(url);
    return videoExtensions.some(ext => parsed.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
}