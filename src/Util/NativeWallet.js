import { NativeModules } from "react-native";
import { ethers } from 'ethers';

const generateMnemonic = async () => {
    try {
        return await NativeModules.WalletModule.generateMnemonic();
    } catch (e) {
        console.log(e);
    }
};

const retrieveMnemonic = async () => {
    try {
        return await NativeModules.WalletModule.retrieveMnemonic();
    } catch (e) {
        console.log(e);
    }
};

const signMessage = async (message) => {
    try {
        return await NativeModules.WalletModule.signMessage(ethers.utils.formatBytes32String(message));
    } catch (e) {
        throw 'Sign message failed with error: ' + e;
    }
};

export const NativeWallet = {
    generateMnemonic,
    retrieveMnemonic,
    signMessage
};