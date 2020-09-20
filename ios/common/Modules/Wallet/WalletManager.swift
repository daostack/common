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
    var keystore: BIP32Keystore?
    
    init() {
        keychain = Keychain(service: "com.daostack.common").synchronizable(true)
    }
    
    func getAddress() throws -> String {
        guard let keystore = keystore,
            let address = keystore.addresses?.first?.address else {
                throw WalletError.invalidAddress
        }
        return address
    }
    
    func createWallet(uid: String) -> String? {
        guard let mnemonics = try? retrieveMnemonic(uid: uid) else {
            return nil
       }
        guard let keystore = try? BIP32Keystore(mnemonics: mnemonics),
            let address = keystore.addresses?.first?.address else {
            return nil
        }
        self.keystore = keystore
        return address
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
    
    /// Message is hex data string
     func signMessage(message: String) throws -> String? {

         guard let data = Data.fromHex(message) else {
             throw WalletError.custom("Data")
         }

         guard let keystore = keystore,
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
