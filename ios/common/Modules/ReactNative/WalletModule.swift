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
                let seed = try WalletManager.shared.generateMnemonic(shouldStore: false)
                resolve(seed)
            } catch {
                reject("1", "Create mnemonic failed", error)
            }
        }
    }
    
    @objc func generateAndStoreMnemonic(_ resolve: @escaping RCTPromiseResolveBlock,
                                        reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                let seed = try WalletManager.shared.generateMnemonic(shouldStore: true)
                resolve(seed)
            } catch {
                reject("1", "Create and store mnemonic failed", error)
            }
        }
    }
    
    @objc func storeMnemonic(_ mnemonic: String,
                             resolve: @escaping RCTPromiseResolveBlock,
                             reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                try WalletManager.shared.storeMnemonic(mnemonic: mnemonic)
                resolve(true)
            } catch {
                reject("3", "Store mnemonic  failed", error)
            }
        }
    }
    
    @objc func retrieveMnemonic(_ resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                let seed = try WalletManager.shared.retrieveMnemonic()
                resolve(seed)
            } catch {
                reject("4", "Retrieve mnemonic failed", error)
            }
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
