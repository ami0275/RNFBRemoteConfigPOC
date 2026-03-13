//
//  RemoteConfigStubModule.m
//  RnRemoteConfigDemo
//
//  Objective-C bridge header that exposes the Swift RemoteConfigStubModule
//  to the React Native bridge (required for Swift ↔ RN interop).
//

#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RemoteConfigStubModule, RCTEventEmitter)

// Exposes getAll(resolve:reject:) to the JS bridge
RCT_EXTERN_METHOD(getAll:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

// Exposes simulateUpdate(newColor:) to the JS bridge
RCT_EXTERN_METHOD(simulateUpdate:(NSString *)newColor)

@end
