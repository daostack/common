//
//  WalletManager.swift
//  common
//
//  Created by lmcmz on 12/3/20.
//  Copyright © 2020 DAOstack. All rights reserved.
//
import Foundation
import web3swift
import KeychainAccess

public class WalletManager {
    
    static var shared = WalletManager()
    var keychain: Keychain?

    let defaultPassword = "web3swift"
    
    init() {
        keychain = Keychain(service: "com.daostack.common")
    }
    
    func generateMnemonic(uid: String, shouldStore: Bool) throws -> String? {
        
        guard let keychain = self.keychain else {
            throw WalletError.custom("keychian is nil")
        }
        
        do {
            let bitsOfEntropy: Int = 128 // Entropy is a measure of password strength. Usually used 128 or 256 bits.
            let mnemonics = try BIP39.generateMnemonics(bitsOfEntropy: bitsOfEntropy)
            if shouldStore {
                keychain[uid] = mnemonics
            }
            return mnemonics
        } catch {
            throw WalletError.custom("Create mnemonics failed")
        }
    }
    
    func storeMnemonic(uid: String, mnemonic: String) throws {
        guard let keychain = self.keychain else {
            throw WalletError.custom("keychian is nil")
        }
        keychain[uid] = mnemonic
    }
    
    func retrieveMnemonic(uid: String) throws -> String? {
        guard let keychain = self.keychain else {
            throw WalletError.custom("keychian is nil")
        }
        
        let mnemonics = keychain[uid]
//        defer {
//            mnemonics = nil
//        }
        return mnemonics
    }
}
