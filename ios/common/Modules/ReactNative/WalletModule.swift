//
//  WalletModule.swift
//  common
//
//  Created by lmcmz on 12/3/20.
//  Copyright © 2020 DAOstack. All rights reserved.
//

import Foundation

@objc(WalletModule)
class WalletModule: NSObject {
    
    @objc func generateMnemonic(_ resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                let seed = try WalletManager.shared.generateMnemonic(shouldStore: true)
                resolve(seed)
            } catch {
                reject("1", "Create seed phrase failed", error)
            }
        }
    }
    
    @objc func retrieveMnemonic(_ resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let seed = WalletManager.shared.retrieveMnemonic()
            resolve(seed)
        }
    }
    
    @objc func signMessage(_ message: String,
                           resolve: @escaping RCTPromiseResolveBlock,
                           reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                let signed = try WalletManager.shared.signMessage(message: message)
                resolve(signed)
            } catch {
                reject("2", "Sign Data failed", error)
            }
        }
    }
    
}
