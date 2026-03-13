/**
 * LAYER: Shared Code
 * Shared types and defaults used across all platforms and apps.
 */

export interface AppConfig {
  themeColor: string;
  isFeatureXEnabled: boolean;
}

export const defaultConfig: AppConfig = {
  themeColor: '#1a1a2e',
  isFeatureXEnabled: false,
};
