package com.rnremoteconfigdemo

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Simulate a Remote Config update 5 seconds after launch
        Handler(Looper.getMainLooper()).postDelayed({
            runOnUiThread {
                val reactHost = (application as ReactApplication).reactHost
                val context = reactHost?.currentReactContext

                if (context == null) {
                    Log.e("MainActivity", "ReactContext is null. Bridge not ready.")
                    return@runOnUiThread
                }

                Log.d("MainActivity", "Simulating Remote Config update")

                val module = context.getNativeModule(RemoteConfigStubModule::class.java)

                if (module != null) {
                    Log.d("MainActivity", "RemoteConfigStubModule found")
                    module.simulateUpdate("#FF5722")
                    return@runOnUiThread
                }

                Log.w("MainActivity", "Module not found. Emitting event directly")

                val params = WritableNativeMap().apply {
                    putString("theme_color", "#FF5722")
                    putString("is_feature_x_enabled", "true")
                }

                context
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("RemoteConfigUpdated", params)
            }
        }, 5000)
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "RnRemoteConfigDemo"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
