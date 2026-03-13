//
//  RemoteConfigStubModule.swift
//  RnRemoteConfigDemo
//
//  LAYER: Native Bridge — iOS
//
//  Stub implementation of the Remote Config native bridge.
//  Returns hardcoded key/value pairs to the React Native JS layer via the bridge.
//
//  When the real Firebase Remote Config SDK is integrated, replace the hardcoded
//  dictionary in getAll() with actual RC SDK calls:
//    let rc = RemoteConfig.remoteConfig()
//    let values = rc.allValues(from: .remote)
//

import Foundation
import React

@objc(RemoteConfigStubModule)
class RemoteConfigStubModule: RCTEventEmitter {

  /// Indicates this module does not need to be set up on the main queue.
  override static func requiresMainQueueSetup() -> Bool { false }

  /// Lists the events that this module can emit.
  override func supportedEvents() -> [String]! {
    return ["RemoteConfigUpdated"]
  }

  /// Returns all remote config values as a key/value dictionary to the JS bridge.
  @objc func getAll(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    let configMap: [String: String] = [
      "theme_color": "#99ff99",
      "is_feature_x_enabled": "true",
    ]
    resolve(configMap)
  }

  /// Simulation Method for Brownfield / Demo purposes.
  /// In a real app, this would be triggered by Firebase's update listener.
  @objc func simulateUpdate(_ newColor: String) {
    let updatedMap: [String: String] = [
      "theme_color": newColor,
      "is_feature_x_enabled": "true",
    ]
    
    // Emit the event to JS
    sendEvent(withName: "RemoteConfigUpdated", body: updatedMap)
  }
}
