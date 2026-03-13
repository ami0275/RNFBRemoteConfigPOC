import { defaultConfig } from './shared/types';
import { RC_KEY_THEME_COLOR, RC_KEY_FEATURE_X_ENABLED } from './shared/constants';
import { RemoteConfigCache } from './RemoteConfigCache';
import { fetchAllFromBridge, onConfigUpdated } from './NativeBridge';

/**
 * Public entry point.
 */
export const initialize = async (): Promise<void> => {
  try {
    // 1. Initial fetch
    const raw = await fetchAllFromBridge();
    RemoteConfigCache.setCache(raw);

    // 2. Subscribe to brownfield updates (emitted from Native)
    onConfigUpdated((updatedConfig: Record<string, string>) => {
      console.log('[remote-config-core] Real-time update received from Native.');
      RemoteConfigCache.setCache(updatedConfig);
    });

    console.log('[remote-config-core] initialize() complete.');
  } catch (error) {
    console.error(
      '[remote-config-core] Native initialize() failed — falling back to defaults:',
      error,
    );

    RemoteConfigCache.setCache({
      [RC_KEY_THEME_COLOR]: defaultConfig.themeColor,
      [RC_KEY_FEATURE_X_ENABLED]: String(defaultConfig.isFeatureXEnabled),
    });
  }
};

export { simulateUpdate } from './NativeBridge';
