/**
 * AsaniBiz AI Munshi - In-Memory Cache & Request Deduplication
 * Slashes unnecessary computation, prevents duplicate API calls,
 * and maintains instant sub-millisecond retrieval of common summaries.
 */

interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  ttlMs: number;
}

class AIMunshiCache {
  private cache: Map<string, CacheEntry> = new Map();
  private recentRequests: Map<string, number> = new Map(); // For deduplication

  /**
   * Get cached entry if valid and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache with a time-to-live (default 60 seconds)
   */
  set(key: string, data: any, ttlMs: number = 60000): void {
    this.cache.set(key, {
      key,
      data,
      timestamp: Date.now(),
      ttlMs,
    });
  }

  /**
   * Invalidate cache by category or full clear
   */
  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Check if exact request was received within the deduplication window (e.g. 5 seconds)
   * Prevents accidental double-clicks or voice loop triggers.
   */
  isDuplicateRequest(userMessage: string, windowMs: number = 5000): boolean {
    const normalized = userMessage.trim().toLowerCase();
    const lastTime = this.recentRequests.get(normalized);
    const now = Date.now();

    if (lastTime && now - lastTime < windowMs) {
      return true;
    }

    this.recentRequests.set(normalized, now);

    // Prune old request entries
    if (this.recentRequests.size > 100) {
      for (const [msg, time] of this.recentRequests.entries()) {
        if (now - time > 60000) {
          this.recentRequests.delete(msg);
        }
      }
    }

    return false;
  }
}

export const aiMunshiCache = new AIMunshiCache();
