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
    
    private let keychainKey = "mnemonic"
    let defaultPassword = "web3swift"
    
    init() {
        keychain = Keychain(service: "com.daostack.common")
    }
    
    func generateMnemonic(shouldStore: Bool) throws -> String? {
        do {
            let bitsOfEntropy: Int = 128 // Entropy is a measure of password strength. Usually used 128 or 256 bits.
            let mnemonics = try BIP39.generateMnemonics(bitsOfEntropy: bitsOfEntropy)
            if shouldStore {
                keychain![keychainKey] = mnemonics
            }
            return mnemonics
        } catch {
            throw WalletError.custom("Create mnemonics failed")
        }
    }
    
    func retrieveMnemonic() -> String? {
        let mnemonics = keychain![keychainKey]
//        defer {
//            mnemonics = nil
//        }
        return mnemonics
    }
    
    /// Message is hex data string
    func signMessage(message: String) throws -> String? {
        
        guard let data = Data.fromHex(message) else {
            throw WalletError.custom("Data")
        }
        
        guard let mnemonics = retrieveMnemonic(),
            let keystore = try BIP32Keystore(mnemonics: mnemonics),
            let address = keystore.addresses?.first else {
            throw WalletError.malformedKeystore
        }
        
        do {
            guard let signedData = try Web3Signer.signPersonalMessage(data,
                                                                      keystore: keystore,
                                                                      account: address,
                                                                      password: defaultPassword) else {
                                                                        throw WalletError.custom("Sign Failed")
            }
            return signedData.toHexString().addHexPrefix()
        } catch {
            throw WalletError.messageFailedToData
        }
    }
    
}
