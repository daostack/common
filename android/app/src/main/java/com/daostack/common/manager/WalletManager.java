package com.daostack.common.manager;

import com.daostack.common.MainApplication;
import org.web3j.crypto.MnemonicUtils;
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

    private static class Web3jManagerHolder {
        private final static WalletManager instance = new WalletManager();
    }

    public static WalletManager getInstance() {
        return Web3jManagerHolder.instance;
    }


    public WalletManager () {
        store = new Store(MainApplication.getAppContext());
        if (!store.hasKey(keyString)) {
            key = store.generateSymmetricKey(keyString, null);
        } else {
            key = store.getSymmetricKey(keyString, null);
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

    public String retrieveMnemonic(String uid ) throws Exception {
        try {
            String encryptedData = Hawk.get(uid);
            Crypto crypto = new Crypto(Options.TRANSFORMATION_SYMMETRIC);
            String decryptedData = crypto.decrypt(encryptedData, key);
            return decryptedData;
        } catch (Exception e){
            throw e;
        }

    }

}
