/**
 * LAYER: Shared Code
 * Centralised mapper: converts raw Firebase Remote Config values → typed AppConfig.
 * Used by both native and web implementations in remote-config-core.
 */

import { AppConfig, defaultConfig } from './types';
import { RC_KEY_THEME_COLOR, RC_KEY_FEATURE_X_ENABLED } from './constants';

/**
 * Maps a raw key-value record from Firebase Remote Config into a fully-typed AppConfig.
 * Falls back to defaultConfig values for any missing or empty keys.
 */
export function mapToAppConfig(raw: Record<string, string>): AppConfig {
  const themeColor = raw[RC_KEY_THEME_COLOR] || defaultConfig.themeColor;
  const isFeatureXEnabled =
    raw[RC_KEY_FEATURE_X_ENABLED] !== undefined
      ? raw[RC_KEY_FEATURE_X_ENABLED] === 'true'
      : defaultConfig.isFeatureXEnabled;

  return { themeColor, isFeatureXEnabled };
}
