/**
 * LAYER: remote-config-core (Fallback)
 *
 * Used by TypeScript resolution and environments where platform-specific
 * extensions (.native.ts, .web.ts) are not processed by the bundler.
 *
 * Populates the cache with default values so that RemoteConfigCache.getBoolean()
 * and RemoteConfigCache.getString() still return consistent results.
 */

import { defaultConfig } from './shared/types';
import { RC_KEY_THEME_COLOR, RC_KEY_FEATURE_X_ENABLED } from './shared/constants';
import { RemoteConfigCache } from './RemoteConfigCache';

export const initialize = async (): Promise<void> => {
  console.warn(
    '[remote-config-core] Fallback initialize() called. ' +
      'Ensure your bundler resolves platform extensions (.native.ts / .web.ts). ' +
      'Using default config values.',
  );
  RemoteConfigCache.setCache({
    [RC_KEY_THEME_COLOR]: defaultConfig.themeColor,
    [RC_KEY_FEATURE_X_ENABLED]: String(defaultConfig.isFeatureXEnabled),
  });
};

export const simulateUpdate = (newColor: string): void => {
  console.log(`[remote-config-core] Fallback simulateUpdate called with ${newColor}`);
  RemoteConfigCache.setCache({
    [RC_KEY_THEME_COLOR]: newColor,
    [RC_KEY_FEATURE_X_ENABLED]: String(defaultConfig.isFeatureXEnabled),
  });
};
