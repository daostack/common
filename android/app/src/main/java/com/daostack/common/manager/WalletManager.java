package com.daostack.common.manager;

import android.os.Environment;
import android.text.TextUtils;

import com.daostack.common.MainApplication;
import com.facebook.react.bridge.Promise;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import com.daostack.common.async.WorkThreadHandler;
import com.daostack.common.async.*;

import org.web3j.crypto.Bip32ECKeyPair;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.MnemonicUtils;
import org.web3j.crypto.Wallet;
import org.web3j.crypto.WalletFile;
import org.web3j.protocol.Web3j;
import org.web3j.utils.Numeric;

import java.io.File;
import java.security.SecureRandom;

import io.reactivex.disposables.CompositeDisposable;
import wallet.core.jni.CoinType;
import wallet.core.jni.Curve;
import wallet.core.jni.HDWallet;
import wallet.core.jni.Hash;
import wallet.core.jni.PrivateKey;

import com.orhanobut.hawk.Hawk;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.daostack.common.util.*;
import com.daostack.common.config.*;
import com.yakivmospan.scytale.Crypto;
import com.yakivmospan.scytale.Options;
import com.yakivmospan.scytale.Store;

import javax.crypto.SecretKey;
import static com.daostack.common.config.Constants.MEMORIZINGWORDS;

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
        System.loadLibrary("TrustWalletCore");
    }

    public String generateMnemonic() throws Exception  {
        try {
            byte[] initialEntropy = new byte[16];
            SecureRandom secureRandom = new SecureRandom();
            secureRandom.nextBytes(initialEntropy);
            String mnemonic = MnemonicUtils.generateMnemonic(initialEntropy);
            Crypto crypto = new Crypto(Options.TRANSFORMATION_SYMMETRIC);
            String encryptedData = crypto.encrypt(mnemonic, key);
            Hawk.put(MEMORIZINGWORDS, encryptedData);
            return mnemonic;
        }catch (Exception e){
            throw e;
        }

    }

    public String retrieveMnemonic() throws Exception {
        try {
            String encryptedData = Hawk.get(MEMORIZINGWORDS);
            Crypto crypto = new Crypto(Options.TRANSFORMATION_SYMMETRIC);
            String decryptedData = crypto.decrypt(encryptedData, key);
            return decryptedData;
        } catch (Exception e){
            throw e;
        }

    }

    public String signMessage(String message) throws Exception {
        try{
            byte[] messageBytes = Numeric.hexStringToByteArray(message);
            String mnemonic = retrieveMnemonic();
            HDWallet newWallet = new HDWallet(mnemonic, "");
            PrivateKey pk = newWallet.getKeyForCoin(CoinType.ETHEREUM);
            byte[] digest = Hash.keccak256(messageBytes);
            byte[] sigBytes = pk.sign(digest, Curve.SECP256K1);
            String result = Numeric.toHexString(sigBytes);
            return result;
        }catch (Exception e){
            throw e;
        }
    }

}
