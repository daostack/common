package com.daostack.common.manager;

import com.daostack.common.MainApplication;

import org.web3j.crypto.Bip32ECKeyPair;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.MnemonicUtils;
import org.web3j.crypto.Sign;
import org.web3j.utils.Numeric;
import java.security.SecureRandom;
import com.orhanobut.hawk.Hawk;
import com.yakivmospan.scytale.Crypto;
import com.yakivmospan.scytale.Options;
import com.yakivmospan.scytale.Store;
import javax.crypto.SecretKey;

public class WalletManager {

    private String keyString = "daostack";
    private Store store;
    private SecretKey key;
    private int HARDENED_BIT = 0x80000000;

    private String MESSAGE_PREFIX = "\u0019Ethereum Signed Message:\n";

    private Credentials mCredentials;

    private static class Web3jManagerHolder {
        private final static WalletManager instance = new WalletManager();
    }

    public static WalletManager getInstance() {
        return Web3jManagerHolder.instance;
    }


    public WalletManager () {
        System.loadLibrary("TrustWalletCore");
        store = new Store(MainApplication.getAppContext());
        if (!store.hasKey(keyString)) {
            key = store.generateSymmetricKey(keyString, null);
        } else {
            key = store.getSymmetricKey(keyString, null);
        }
    }

    public String getAddress() throws Exception {
        try {
            String address = mCredentials.getAddress();
            return address;
        } catch (Exception e) {
            throw  e;
        }
    }

    public String createWallet(String uid) throws Exception {
        try {
            String mnemonic = retrieveMnemonic(uid);
            byte[] seed = MnemonicUtils.generateSeed(mnemonic, "");
            Bip32ECKeyPair masterKeypair = Bip32ECKeyPair.generateKeyPair(seed);
            final int[] path = {44 | HARDENED_BIT, 60 | HARDENED_BIT, 0 | HARDENED_BIT, 0, 0};
            Bip32ECKeyPair childKeypair = Bip32ECKeyPair.deriveKeyPair(masterKeypair, path);
            mCredentials = Credentials.create(childKeypair);
            return mCredentials.getAddress();
        } catch (Exception e) {
            throw  e;
        }
    }

    public String generateMnemonic(String uid, Boolean shouldStore) throws Exception  {
        try {
            byte[] initialEntropy = new byte[16];
            SecureRandom secureRandom = new SecureRandom();
            secureRandom.nextBytes(initialEntropy);
            String mnemonic = MnemonicUtils.generateMnemonic(initialEntropy);
            if (shouldStore) {
                Crypto crypto = new Crypto(Options.TRANSFORMATION_SYMMETRIC);
                String encryptedData = crypto.encrypt(mnemonic, key);
                Hawk.put(uid, encryptedData);
            }
            return mnemonic;
        }catch (Exception e){
            throw e;
        }
    }

    public void storeMnemonic(String uid, String mnemonic) throws Exception {
        try {
            Crypto crypto = new Crypto(Options.TRANSFORMATION_SYMMETRIC);
            String encryptedData = crypto.encrypt(mnemonic, key);
            Hawk.put(uid, encryptedData);
        } catch (Exception e){
            throw e;
        }
    }

    public String retrieveMnemonic(String uid) throws Exception {
        try {
            String encryptedData = Hawk.get(uid);
            if (encryptedData == null) {
                return null;
            }
            Crypto crypto = new Crypto(Options.TRANSFORMATION_SYMMETRIC);
            String decryptedData = crypto.decrypt(encryptedData, key);
            return decryptedData;
        } catch (Exception e){
            throw e;
        }
    }

    public String signMessage(String message) throws Exception {
        try{
            String newMessage = message.replaceFirst("^0x", "");
            byte[] hash = Numeric.hexStringToByteArray(newMessage);
            Sign.SignatureData signature = Sign.signPrefixedMessage(hash, mCredentials.getEcKeyPair());
            String r = Numeric.toHexString(signature.getR());
            String s = Numeric.toHexString(signature.getS()).substring(2);
            String v = Numeric.toHexString(signature.getV()).substring(2);
            return new StringBuilder(r).append(s).append(v).toString();
        }catch (Exception e){
            throw e;
        }
    }
}
