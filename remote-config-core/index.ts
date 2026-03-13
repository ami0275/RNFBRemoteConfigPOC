/**
 * LAYER: remote-config-core — Public API
 *
 * Metro Bundler / Webpack automatically resolves imports to the correct
 * platform-specific implementation:
 *   - config.native.ts  → Android / iOS
 *   - config.web.ts     → Web / Expo Web
 *   - config.ts         → Fallback (non-platform bundlers)
 *
 * Architecture:
 *   1. App calls initialize() once at startup.
 *   2. initialize() fetches ALL keys from the native Firebase SDK via getAll().
 *   3. Values are stored in RemoteConfigCache.
 *   4. Features read typed values from RemoteConfigCache at runtime — no network call.
 */

// Platform-resolved initializer
export { initialize, simulateUpdate } from './config';

// In-memory cache — read feature flags from here after initialize() resolves
export { RemoteConfigCache } from './RemoteConfigCache';

// All shared types, constants, and mappers are available from this entry point
export * from './shared';
