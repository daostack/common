//
//  RNBridge.m
//  common
//
//  Created by lmcmz on 12/3/20.
//  Copyright © 2020 DAOstack. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

# pragma - Wallet

@interface RCT_EXTERN_MODULE(WalletModule, NSObject)

RCT_EXTERN_METHOD(getAddress:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createWallet:(NSString *)uid
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(signMessage:(NSString *)message
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateMnemonic:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(generateAndStoreMnemonic:(NSString *)uid
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(storeMnemonic:(NSString *)uid
                  mnemonic:(NSString *)mnemonic
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(retrieveMnemonic:(NSString *)uid
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

@end
