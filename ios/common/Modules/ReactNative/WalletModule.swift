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
                let seed = try WalletManager.shared.generateMnemonic(uid: "", shouldStore: false)
                resolve(seed)
            } catch {
                reject("1", "Create mnemonic failed", error)
            }
        }
    }
    
    @objc func generateAndStoreMnemonic(_ uid: String,
                                        resolve: @escaping RCTPromiseResolveBlock,
                                        reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                let seed = try WalletManager.shared.generateMnemonic(uid: uid, shouldStore: true)
                resolve(seed)
            } catch {
                reject("1", "Create and store mnemonic failed", error)
            }
        }
    }
    
    @objc func storeMnemonic(_ uid: String,
                             mnemonic: String,
                             resolve: @escaping RCTPromiseResolveBlock,
                             reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                try WalletManager.shared.storeMnemonic(uid: uid, mnemonic: mnemonic)
                resolve(true)
            } catch {
                reject("3", "Store mnemonic  failed", error)
            }
        }
    }
    
    @objc func retrieveMnemonic(_ uid: String,
                                resolve: @escaping RCTPromiseResolveBlock,
                                reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            do {
                let seed = try WalletManager.shared.retrieveMnemonic(uid: uid)
                resolve(seed)
            } catch {
                reject("4", "Retrieve mnemonic failed", error)
            }
        }
    }
    
}
