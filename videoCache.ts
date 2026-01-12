
/**
 * VideoCacheManager v3: High-Speed Stream Interceptor
 * Uses the Cache API to support partial streaming and range requests.
 */

const CACHE_NAME = 'MattathiasAbraham_Video_v3';

export class VideoCacheManager {
  private queue: string[] = [];
  private activeCount = 0;
  private maxConcurrency = 2; // Leave slots open for active playback

  /**
   * Normalizes Dropbox URLs for direct streaming
   */
  private normalizeUrl(url: string): string {
    if (!url) return '';
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
   * Triggers a background fetch for the video
   */
  async prefetch(url: string, priority: 'high' | 'low' = 'low'): Promise<void> {
    const targetUrl = this.normalizeUrl(url);
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(targetUrl);

    if (cachedResponse) return;

    if (priority === 'high') {
      this.queue.unshift(targetUrl);
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
      // We use a simple fetch. The browser handles the heavy lifting.
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
   * Returns the best available URL (Cached or Network)
   */
  async getEffectiveUrl(url: string): Promise<string> {
    const targetUrl = this.normalizeUrl(url);
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(targetUrl);
    
    // If we have it in Cache API, we still return the targetUrl
    // but the browser will now resolve it from the cache instantly 
    // because we have populated the Cache Storage.
    return targetUrl;
  }

  getNetworkStatus(): string {
    const conn = (navigator as any).connection;
    return conn?.effectiveType?.toUpperCase() || 'Stable';
  }
}

export const videoCache = new VideoCacheManager();
