
/**
 * VideoCacheManager v4: Ultra-Fast Video Streaming
 * Optimized for Cloudinary with adaptive quality and preloading
 */

const CACHE_NAME = 'MattathiasAbraham_Video_v4';

export class VideoCacheManager {
  private queue: string[] = [];
  private activeCount = 0;
  private maxConcurrency = 4; // Increased for better performance
  private preloadedUrls = new Set<string>();

  /**
   * Optimize URLs for fastest loading with smart aspect ratio handling
   */
  private optimizeUrl(url: string, quality: 'low' | 'medium' | 'high' = 'medium', aspectRatio?: 'auto' | 'square' | 'portrait' | 'landscape'): string {
    if (!url) return '';
    
    // Cloudinary optimization
    if (url.includes('cloudinary.com')) {
      const qualityMap = {
        low: 'q_30,f_auto',
        medium: 'q_60,f_auto', 
        high: 'q_80,f_auto'
      };
      
      // Smart sizing based on aspect ratio and context
      let sizeParams = '';
      if (aspectRatio === 'square') {
        sizeParams = quality === 'low' ? ',w_300,h_300,c_fill,g_center' : 
                    quality === 'medium' ? ',w_500,h_500,c_fill,g_center' : 
                    ',w_700,h_700,c_fill,g_center';
      } else if (aspectRatio === 'portrait') {
        sizeParams = quality === 'low' ? ',w_300,h_400,c_fill,g_center' : 
                    quality === 'medium' ? ',w_400,h_600,c_fill,g_center' : 
                    ',w_600,h_900,c_fill,g_center';
      } else if (aspectRatio === 'landscape') {
        sizeParams = quality === 'low' ? ',w_400,h_300,c_fill,g_center' : 
                    quality === 'medium' ? ',w_600,h_400,c_fill,g_center' : 
                    ',w_900,h_600,c_fill,g_center';
      } else {
        // Auto - optimized for hover performance
        sizeParams = quality === 'low' ? ',w_400,h_300,c_fill,g_auto,br_300k' : 
                    quality === 'medium' ? ',w_600,h_400,c_fill,g_auto,br_500k' : 
                    ',w_800,h_600,c_fill,g_auto,br_800k';
      }
      
      const optimizations = qualityMap[quality] + sizeParams;
      
      // Insert optimization parameters before the version
      if (url.includes('/upload/v')) {
        return url.replace('/upload/v', `/upload/${optimizations}/v`);
      } else if (url.includes('/upload/')) {
        return url.replace('/upload/', `/upload/${optimizations}/`);
      }
      return url;
    }
    
    // Normalize Dropbox URLs
    let target = url;
    if (target.includes('www.dropbox.com')) {
      target = target.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }
    if (!target.includes('raw=1')) {
      target += target.includes('?') ? '&raw=1' : '?raw=1';
    }
    return target;
  }

  /**
   * Get optimized URL for different use cases with aspect ratio awareness
   */
  getOptimizedUrl(url: string, context: 'preview' | 'hover' | 'fullscreen' = 'preview', aspectRatio: 'auto' | 'square' | 'portrait' | 'landscape' = 'auto'): string {
    const qualityMap = {
      preview: 'low' as const,
      hover: 'medium' as const,
      fullscreen: 'high' as const
    };
    return this.optimizeUrl(url, qualityMap[context], aspectRatio);
  }

  /**
   * Generate thumbnail URL with smart cropping for video cards
   */
  getThumbnailUrl(url: string, cardAspectRatio: 'square' | 'portrait' | 'landscape' = 'portrait'): string {
    if (!url.includes('cloudinary.com')) return '';
    
    // Smart thumbnail generation for video cards (9:11 aspect ratio)
    const thumbnailParams = cardAspectRatio === 'portrait' 
      ? 'w_400,h_488,c_fill,g_auto,q_auto,f_auto,so_3.0' // 9:11 ratio, extract at 3 seconds
      : cardAspectRatio === 'square'
      ? 'w_400,h_400,c_fill,g_auto,q_auto,f_auto,so_3.0'
      : 'w_488,h_400,c_fill,g_auto,q_auto,f_auto,so_3.0';
    
    if (url.includes('/upload/v')) {
      return url.replace('/upload/v', `/upload/${thumbnailParams}/v`).replace('.mp4', '.jpg');
    } else if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${thumbnailParams}/`).replace('.mp4', '.jpg');
    }
    return url.replace('.mp4', '.jpg');
  }

  /**
   * Get ultra-fast, tiny preview for instant hover response
   */
  getInstantHoverUrl(url: string): string {
    if (!url.includes('cloudinary.com')) return url;
    
    // Ultra-tiny preview: 160p, 50k bitrate, 2 seconds, aggressive compression
    const instantParams = 'w_160,h_120,c_fill,g_auto,q_20,br_50k,du_2.0,f_auto,fl_progressive';
    
    if (url.includes('/upload/v')) {
      return url.replace('/upload/v', `/upload/${instantParams}/v`);
    } else if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${instantParams}/`);
    }
    return url;
  }

  /**
   * Get better quality hover video for smooth upgrade
   */
  getBetterHoverUrl(url: string): string {
    if (!url.includes('cloudinary.com')) return url;
    
    // Better hover quality: 240p, 150k bitrate, 5 seconds
    const betterParams = 'w_240,h_180,c_fill,g_auto,q_40,br_150k,du_5.0,f_auto,fl_progressive';
    
    if (url.includes('/upload/v')) {
      return url.replace('/upload/v', `/upload/${betterParams}/v`);
    } else if (url.includes('/upload/')) {
      return url.replace('/upload/', `/upload/${betterParams}/`);
    }
    return url;
  }

  /**
   * Preload instant hover videos (ultra-tiny for immediate response)
   */
  async preloadInstantHover(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      
      const instantUrl = this.getInstantHoverUrl(url);
      
      video.oncanplaythrough = () => {
        console.log(`⚡ Instant hover ready:`, instantUrl);
        resolve(true);
      };
      
      video.onerror = () => {
        console.warn(`❌ Instant hover failed:`, instantUrl);
        resolve(false);
      };
      
      // Short timeout for instant videos (should be < 50KB)
      setTimeout(() => {
        console.warn(`⏰ Instant hover timeout:`, instantUrl);
        resolve(false);
      }, 5000);
      
      video.src = instantUrl;
      video.load();
      
      // Store reference
      this.preloadedUrls.add(`${instantUrl}#instant-hover`);
    });
  }

  /**
   * Preload better quality hover videos (background loading)
   */
  async preloadBetterHover(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      
      const betterUrl = this.getBetterHoverUrl(url);
      
      video.oncanplaythrough = () => {
        console.log(`🎯 Better hover ready:`, betterUrl);
        resolve(true);
      };
      
      video.onerror = () => {
        console.warn(`❌ Better hover failed:`, betterUrl);
        resolve(false);
      };
      
      // Longer timeout for better quality
      setTimeout(() => {
        console.warn(`⏰ Better hover timeout:`, betterUrl);
        resolve(false);
      }, 10000);
      
      video.src = betterUrl;
      video.load();
      
      // Store reference
      this.preloadedUrls.add(`${betterUrl}#better-hover`);
    });
  }

  /**
   * Preload video with range requests for instant playback
   * Returns a promise that resolves when preloading is complete
   */
  async preloadVideo(url: string, priority: 'high' | 'low' = 'low'): Promise<boolean> {
    const optimizedUrl = this.getOptimizedUrl(url, 'hover');
    
    if (this.preloadedUrls.has(optimizedUrl)) return true;
    this.preloadedUrls.add(optimizedUrl);

    // Preload first 1MB for instant start
    try {
      const response = await fetch(optimizedUrl, {
        headers: { 'Range': 'bytes=0-1048576' }, // First 1MB
        mode: 'cors'
      });
      
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(`${optimizedUrl}#range=0-1048576`, response);
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Preload failed for:', optimizedUrl);
      return false;
    }
  }

  /**
   * Check if video segment is already cached
   */
  async isVideoSegmentCached(url: string): Promise<boolean> {
    const optimizedUrl = this.getOptimizedUrl(url, 'hover', 'auto');
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(`${optimizedUrl}#segment`);
    return !!cachedResponse;
  }

  /**
   * Get cached video URL or fallback to optimized URL
   */
  async getCachedVideoUrl(url: string, context: 'preview' | 'hover' | 'fullscreen' = 'hover'): Promise<string> {
    const optimizedUrl = this.getOptimizedUrl(url, context, 'auto');
    const isCached = await this.isVideoSegmentCached(url);
    
    if (isCached) {
      // Return URL with cache-busting parameter to force use of cached version
      return `${optimizedUrl}?cached=1`;
    }
    
    return optimizedUrl;
  }

  /**
   * Optimize cache for hover interactions
   */
  async optimizeForHover(): Promise<void> {
    try {
      // Clear any old cache entries to free up space
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      
      // Keep only recent entries (last 50)
      if (keys.length > 50) {
        const oldKeys = keys.slice(0, keys.length - 50);
        await Promise.all(oldKeys.map(key => cache.delete(key)));
      }
      
      console.log('Video cache optimized for hover interactions');
    } catch (e) {
      console.warn('Cache optimization failed:', e);
    }
  }

  /**
   * Enhanced prefetch with adaptive quality
   */
  async prefetch(url: string, priority: 'high' | 'low' = 'low'): Promise<void> {
    const targetUrl = this.optimizeUrl(url, priority === 'high' ? 'medium' : 'low');
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(targetUrl);

    if (cachedResponse) return;

    if (priority === 'high') {
      this.queue.unshift(targetUrl);
      // Also preload for instant playback
      this.preloadVideo(url, 'high');
    } else {
      if (!this.queue.includes(targetUrl)) {
        this.queue.push(targetUrl);
      }
    }

    this.processQueue();
  }

  private async processQueue() {
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) return;

    const url = this.queue.shift()!;
    this.activeCount++;

    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await fetch(url, { mode: 'cors' });
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (e) {
      console.warn('Cache sync failed for:', url);
    } finally {
      this.activeCount--;
      this.processQueue();
    }
  }

  /**
   * Get the best URL for current context
   */
  async getEffectiveUrl(url: string, context: 'preview' | 'hover' | 'fullscreen' = 'preview'): Promise<string> {
    return this.getOptimizedUrl(url, context);
  }

  /**
   * Clear cache for fresh content
   */
  async clearCache(): Promise<void> {
    await caches.delete(CACHE_NAME);
    this.preloadedUrls.clear();
  }

  getNetworkStatus(): string {
    const conn = (navigator as any).connection;
    return conn?.effectiveType?.toUpperCase() || 'Stable';
  }
}

export const videoCache = new VideoCacheManager();
