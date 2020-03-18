package com.daostack.common.bridge;

import android.widget.Toast;

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
            String mnemonic = WalletManager.getInstance().generateMnemonic();
            promise.resolve(mnemonic);
        } catch (Exception e) {
            promise.reject(e);
        }

    }

    @ReactMethod
    public void retrieveMnemonic(Promise promise) {
        try {
            String mnemonic = WalletManager.getInstance().retrieveMnemonic();
            promise.resolve(mnemonic);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void signMessage(String message, Promise promise) {
        try {
            String signed = WalletManager.getInstance().signMessage(message);
            promise.resolve(signed);
        } catch (Exception e) {
            promise.reject(e);
        }

    }
}
