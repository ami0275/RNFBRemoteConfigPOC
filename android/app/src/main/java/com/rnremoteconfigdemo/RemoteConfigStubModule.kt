package com.rnremoteconfigdemo

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap

import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.WritableMap

/**
 * LAYER: Native Bridge — Android
 *
 * Stub implementation of the Remote Config native bridge.
 * Returns hardcoded key/value pairs to the React Native JS layer via the bridge.
 *
 * When the real Firebase Remote Config SDK is integrated, replace the hardcoded
 * map in getAll() with actual RC SDK calls (FirebaseRemoteConfig.getInstance().getAll()).
 *
 * JS side calls: NativeModules.RemoteConfigStubModule.getAll()
 */
class RemoteConfigStubModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "RemoteConfigStubModule"

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    /**
     * Returns all remote config values as a key/value map to the JS bridge.
     */
    @ReactMethod
    fun getAll(promise: Promise) {
        try {
            val configMap = getMockConfig()
            promise.resolve(configMap)
        } catch (e: Exception) {
            promise.reject("RC_STUB_ERROR", "RemoteConfigStubModule.getAll() failed: ${e.message}", e)
        }
    }

    /**
     * Simulation Method for Brownfield / Demo purposes.
     * In a real app, this would be triggered by FirebaseRemoteConfig.addOnConfigUpdateListener.
     */
    @ReactMethod
    fun simulateUpdate(newColor: String) {
        val updatedMap = WritableNativeMap().apply {
            putString("theme_color", newColor)
            putString("is_feature_x_enabled", "true")
        }
        
        // Emit the event to JS
        sendEvent("RemoteConfigUpdated", updatedMap)
    }

    private fun getMockConfig(): WritableNativeMap {
        return WritableNativeMap().apply {
            putString("theme_color", "#ff9999")
            putString("is_feature_x_enabled", "true")
        }
    }
}
