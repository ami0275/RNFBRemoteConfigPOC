/**
 * LAYER: Shared Code
 * Firebase Remote Config key constants shared across native and web implementations.
 * Using constants prevents typo-prone magic strings scattered across the codebase.
 */

export const RC_KEY_THEME_COLOR = 'theme_color';
export const RC_KEY_FEATURE_X_ENABLED = 'is_feature_x_enabled';

// Bridge Event Names
export const RC_EVENT_ON_CONFIG_UPDATED = 'RemoteConfigUpdated';
