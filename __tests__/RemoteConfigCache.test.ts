/**
 * Unit tests for RemoteConfigCache singleton.
 *
 * Covers:
 *   - isInitialized() returns false before setCache() is called
 *   - getString / getBoolean return fallbacks when cache is empty
 *   - setCache populates the cache correctly
 *   - getString / getBoolean return cached values after setCache
 *   - Boolean parsing (case-insensitive "true")
 *   - reset() clears the cache
 */

import { RemoteConfigCache } from '../remote-config-core/RemoteConfigCache';

beforeEach(() => {
  // Reset singleton state between tests
  RemoteConfigCache.reset();
});

describe('RemoteConfigCache — before setCache()', () => {
  test('isInitialized() is false', () => {
    expect(RemoteConfigCache.isInitialized()).toBe(false);
  });

  test('getString returns the fallback', () => {
    expect(RemoteConfigCache.getString('theme_color', '#default')).toBe('#default');
  });

  test('getBoolean returns the fallback (true)', () => {
    expect(RemoteConfigCache.getBoolean('is_feature_x_enabled', true)).toBe(true);
  });

  test('getBoolean returns the fallback (false)', () => {
    expect(RemoteConfigCache.getBoolean('is_feature_x_enabled', false)).toBe(false);
  });
});

describe('RemoteConfigCache — after setCache()', () => {
  beforeEach(() => {
    RemoteConfigCache.setCache({
      theme_color: '#7C4DFF',
      is_feature_x_enabled: 'true',
      is_feature_y_enabled: 'false',
      empty_key: '',
    });
  });

  test('isInitialized() is true', () => {
    expect(RemoteConfigCache.isInitialized()).toBe(true);
  });

  test('getString returns cached value', () => {
    expect(RemoteConfigCache.getString('theme_color', '#default')).toBe('#7C4DFF');
  });

  test('getString returns fallback for empty cached value', () => {
    expect(RemoteConfigCache.getString('empty_key', '#fallback')).toBe('#fallback');
  });

  test('getString returns fallback for missing key', () => {
    expect(RemoteConfigCache.getString('missing_key', '#fallback')).toBe('#fallback');
  });

  test('getBoolean parses "true" string as true', () => {
    expect(RemoteConfigCache.getBoolean('is_feature_x_enabled', false)).toBe(true);
  });

  test('getBoolean parses "false" string as false', () => {
    expect(RemoteConfigCache.getBoolean('is_feature_y_enabled', true)).toBe(false);
  });

  test('getBoolean is case-insensitive for "TRUE"', () => {
    RemoteConfigCache.setCache({ flag: 'TRUE' });
    expect(RemoteConfigCache.getBoolean('flag', false)).toBe(true);
  });

  test('getBoolean returns fallback for missing key', () => {
    expect(RemoteConfigCache.getBoolean('missing_flag', true)).toBe(true);
  });
});

describe('RemoteConfigCache — reset()', () => {
  test('reset clears cache and sets isInitialized to false', () => {
    RemoteConfigCache.setCache({ theme_color: '#fff' });
    expect(RemoteConfigCache.isInitialized()).toBe(true);

    RemoteConfigCache.reset();

    expect(RemoteConfigCache.isInitialized()).toBe(false);
    expect(RemoteConfigCache.getString('theme_color', '#default')).toBe('#default');
  });
});
