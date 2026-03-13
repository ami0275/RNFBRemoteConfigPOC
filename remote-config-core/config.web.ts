/**
 * LAYER: remote-config-core (Web Implementation)
 *
 * Platform-specific initializer for Web / Expo Web.
 * Metro Bundler / Webpack resolves this file automatically for web targets.
 *
 * Sequence:
 *   App
 *    └─ initialize()
 *        └─ Firebase Web SDK
 *            ├─ fetchAndActivate()
 *            └─ getAll()         ← bulk-read the entire config map
 *        └─ RemoteConfigCache.setCache(map)
 *
 *   Feature (later)
 *    └─ RemoteConfigCache.getBoolean(key)   ← instant, no network call
 */

import { defaultConfig } from './shared/types';
import { RC_KEY_THEME_COLOR, RC_KEY_FEATURE_X_ENABLED } from './shared/constants';
import { RemoteConfigCache } from './RemoteConfigCache';
import { fetchAllFromBridge, onConfigUpdated } from './NativeBridge';

/**
 * Public entry point.
 */
export const initialize = async (): Promise<void> => {
  try {
    // 1. Initial fetch from host provider
    const raw = await fetchAllFromBridge();
    RemoteConfigCache.setCache(raw);

    // 2. Subscribe to updates (emitted from Host/Firebase)
    onConfigUpdated((updatedConfig: Record<string, string>) => {
      console.log('[remote-config-core] Real-time update received (web).');
      RemoteConfigCache.setCache(updatedConfig);
    });

    console.log('[remote-config-core] initialize() complete (web).');
  } catch (error) {
    console.error(
      '[remote-config-core] Web initialize() failed — falling back to defaults:',
      error,
    );

    RemoteConfigCache.setCache({
      [RC_KEY_THEME_COLOR]: defaultConfig.themeColor,
      [RC_KEY_FEATURE_X_ENABLED]: String(defaultConfig.isFeatureXEnabled),
    });
  }
};

export { simulateUpdate } from './NativeBridge';
