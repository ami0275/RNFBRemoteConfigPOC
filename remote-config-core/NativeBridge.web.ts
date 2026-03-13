/**
 * LAYER: Bridge — Web Implementation
 *
 * Mock implementation of the native bridge for the web.
 * Simulates "passing data" from a source of truth into the JS layer.
 *
 * This allows the Web platform to follow the EXACT same architectural flow
 * as Android and iOS, where data passes through a bridge abstraction.
 */

import { RC_KEY_THEME_COLOR, RC_KEY_FEATURE_X_ENABLED } from './shared/constants';

/**
 * Simulates fetching ALL remote config values from a "bridge".
 *
 * This implementation fetches data from a global mock provided by the HOST (index.web.js).
 * This mirrors the Native behavior where data is "passed" to JS.
 */
export const fetchAllFromBridge = async (): Promise<Record<string, string>> => {
  // @ts-ignore — accessing global mock provided by the web host layer
  const bridge = window.RemoteConfigStubModule;

  if (!bridge) {
    console.warn('[NativeBridge.web] Host bridge not found. Using fallback empty set.');
    return {};
  }

  return await bridge.getAll();
};

/**
 * Subscribes to Remote Config updates (Mock for Web).
 */
export const onConfigUpdated = (
  callback: (config: Record<string, string>) => void,
): (() => void) => {
  console.log('[NativeBridge.web] Listener subscribed.');
  // In a real web app, this might listen to Firebase SDK snapshots.
  return () => {
    console.log('[NativeBridge.web] Listener unsubscribed.');
  };
};

/**
 * Simulation Method for Demo purposes.
 */
export const simulateUpdate = (newColor: string): void => {
  console.log(`[NativeBridge.web] Simulating update to ${newColor}`);
  // Force a cache update for verification
  import('./RemoteConfigCache').then(({ RemoteConfigCache }) => {
    RemoteConfigCache.setCache({
      theme_color: newColor,
      is_feature_x_enabled: 'true',
    });
  });
};
