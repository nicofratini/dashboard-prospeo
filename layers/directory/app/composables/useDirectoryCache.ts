export interface CacheKey {
  type: 'category' | 'tag' | 'search';
  id?: string;
  search?: string;
  filters?: Record<string, any>;
}

export interface CachedResult<T> {
  timestamp: number;
  data: T;
}

export function useDirectoryCache<T>(expirationTime = 5 * 60 * 1000) { // Default: 5 minutes
  // In-memory cache storage
  const cache = useState<Map<string, CachedResult<T>>>('directory-cache', () => new Map<string, CachedResult<T>>());

  // Generate a consistent cache key from parameters
  const generateCacheKey = (params: CacheKey): string => {
    return JSON.stringify(params);
  };

  // Get item from cache if available and not expired
  const getFromCache = (params: CacheKey): T | null => {
    const key = generateCacheKey(params);
    const cachedItem = cache.value.get(key);

    if (!cachedItem) return null;

    // Check if cache has expired
    const now = Date.now();
    if (now - cachedItem.timestamp > expirationTime) {
      cache.value.delete(key);
      return null;
    }

    return cachedItem.data;
  };

  // Save item to cache
  const saveToCache = (params: CacheKey, data: T): void => {
    const key = generateCacheKey(params);
    cache.value.set(key, {
      timestamp: Date.now(),
      data,
    });
  };

  // Clear entire cache or specific items
  const clearCache = (params?: CacheKey): void => {
    if (params) {
      const key = generateCacheKey(params);
      cache.value.delete(key);
    }
    else {
      cache.value.clear();
    }
  };

  // Get cache stats
  const getCacheStats = () => {
    return {
      size: cache.value.size,
      keys: Array.from(cache.value.keys()).map(key => JSON.parse(key)),
    };
  };

  return {
    getFromCache,
    saveToCache,
    clearCache,
    getCacheStats,
  };
}
