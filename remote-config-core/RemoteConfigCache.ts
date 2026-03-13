/**
 * LAYER: remote-config-core — In-Memory Cache
 *
 * Singleton that stores the full key-value map returned by the native bridge's
 * `getAll()` call. After `initialize()` runs once at app startup, every feature
 * flag read hits this cache — zero additional network calls.
 *
 * Usage:
 *   // At startup (called by initialize()):
 *   RemoteConfigCache.setCache({ theme_color: '#7C4DFF', is_feature_x_enabled: 'true' });
 *
 *   // At runtime (called by any feature):
 *   const enabled = RemoteConfigCache.getBoolean('is_feature_x_enabled', false);
 */

let _cache: Record<string, string> = {};
let _initialized = false;
const _listeners = new Set<(config: Record<string, string>) => void>();

export const RemoteConfigCache = {
  /**
   * Populate the cache from the raw map returned by the native bridge.
   * Marks the cache as initialized and notifies all subscribers.
   */
  setCache(map: Record<string, string>): void {
    _cache = { ...map };
    _initialized = true;
    console.log(
      `[remote-config-core] Cache populated/updated. Keys: ${Object.keys(_cache).join(', ') || '(none)'}`,
    );
    this.notifyListeners();
  },

  /** True after initialize() has successfully populated the cache. */
  isInitialized(): boolean {
    return _initialized;
  },

  /**
   * Read a string value from the cache.
   */
  getString(key: string, fallback: string): string {
    const value = _cache[key];
    return value !== undefined && value !== '' ? value : fallback;
  },

  /**
   * Read a boolean value from the cache.
   */
  getBoolean(key: string, fallback: boolean): boolean {
    const value = _cache[key];
    if (value === undefined) {
      return fallback;
    }
    return value.toLowerCase() === 'true';
  },

  /**
   * Subscribe to cache updates. Returns an unsubscribe function.
   * Useful for UI components to re-render when a "brownfield" update occurs.
   */
  subscribe(callback: (config: Record<string, string>) => void): () => void {
    _listeners.add(callback);
    return () => _listeners.delete(callback);
  },

  /**
   * Internal helper to notify all subscribers that the cache has changed.
   */
  notifyListeners(): void {
    _listeners.forEach((callback) => callback({ ..._cache }));
  },

  /**
   * Reset the cache.
   */
  reset(): void {
    _cache = {};
    _initialized = false;
    _listeners.clear();
  },
};
