package com.daostack.common.bridge;
import com.daostack.common.manager.WalletManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.web3j.crypto.Credentials;
import org.web3j.protocol.core.methods.response.EthGetBalance;
import org.web3j.utils.Convert;

import com.daostack.common.async.*;

import javax.annotation.Nonnull;

public class WalletModule extends ReactContextBaseJavaModule {


    public WalletModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "WalletModule";
    }

    @ReactMethod
    public void generateMnemonic(Promise promise) {
        try {
            String mnemonic = WalletManager.getInstance().generateMnemonic("",false);
            promise.resolve(mnemonic);
        } catch (Exception e) {
            promise.reject(e);
        }

    }

    @ReactMethod
    public void generateAndStoreMnemonic(String uid, Promise promise) {
        try {
            String mnemonic = WalletManager.getInstance().generateMnemonic(uid,true);
            promise.resolve(mnemonic);
        } catch (Exception e) {
            promise.reject(e);
        }

    }

    @ReactMethod
    public void storeMnemonic(String uid, String mnemonic, Promise promise) {
        try {
            WalletManager.getInstance().storeMnemonic(uid, mnemonic);
            promise.resolve(mnemonic);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void retrieveMnemonic(String uid, Promise promise) {
        try {
            String mnemonic = WalletManager.getInstance().retrieveMnemonic(uid);
            promise.resolve(mnemonic);
        } catch (Exception e) {
            promise.reject(e);
        }
    }
}
