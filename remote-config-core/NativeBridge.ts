/**
 * LAYER: Native Bridge — Interface
 *
 * Shared interface for the Native Bridge.
 * The bundler (Metro/Webpack) will resolve this to either:
 *   - NativeBridge.native.ts (Android/iOS)
 *   - NativeBridge.web.ts    (Web)
 */

export declare const fetchAllFromBridge: () => Promise<Record<string, string>>;

export declare const onConfigUpdated: (
  callback: (config: Record<string, string>) => void,
) => () => void;

export declare const simulateUpdate: (newColor: string) => void;
