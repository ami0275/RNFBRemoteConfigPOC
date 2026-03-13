/**
 * LAYER: Native Bridge — JavaScript Side
 *
 * Thin JS wrapper that calls the native "RemoteConfigStubModule" exposed
 * by the Android/iOS native bridge.
 *
 * This is the ONLY place in the JS codebase that knows about NativeModules.
 * remote-config-core/config.native.ts imports and uses this abstraction
 * instead of coupling directly to NativeModules.
 *
 * When the real Firebase RC is set up natively, only this file (and the
 * native .kt / .swift files) needs to change — the rest of the stack stays intact.
 */

import { NativeModules, Platform, NativeEventEmitter } from 'react-native';

const { RemoteConfigStubModule } = NativeModules;

// Create an event emitter for the native module
const eventEmitter = RemoteConfigStubModule
  ? new NativeEventEmitter(RemoteConfigStubModule)
  : null;

if (!RemoteConfigStubModule) {
  console.warn(
    '[NativeBridge] RemoteConfigStubModule is not registered. ' +
      'Ensure the native module is added to the ReactPackage (Android) ' +
      'or linked in the Xcode project (iOS).',
  );
}

/**
 * Fetches ALL remote config values from the native bridge in a single call.
 */
export const fetchAllFromBridge = async (): Promise<Record<string, string>> => {
  if (!RemoteConfigStubModule) {
    throw new Error('[NativeBridge] RemoteConfigStubModule not found.');
  }

  const raw: Record<string, string> = await RemoteConfigStubModule.getAll();
  return raw;
};

/**
 * Subscribes to Remote Config updates from the native layer.
 */
export const onConfigUpdated = (
  callback: (config: Record<string, string>) => void,
): (() => void) => {
  if (!eventEmitter) {
    console.warn('[NativeBridge] Cannot subscribe to updates: EventEmitter not found.');
    return () => {};
  }

  const subscription = eventEmitter.addListener('RemoteConfigUpdated', callback);
  return () => subscription.remove();
};

/**
 * Simulation Method for Demo purposes.
 */
export const simulateUpdate = (newColor: string): void => {
  RemoteConfigStubModule?.simulateUpdate(newColor);
};
