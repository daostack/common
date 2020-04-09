import {NativeModules} from 'react-native';
import {ethers} from 'ethers';

const generateMnemonic = async () => {
  try {
    return await NativeModules.WalletModule.generateMnemonic();
  } catch (e) {
    console.log(e);
  }
};

const generateAndStoreMnemonic = async () => {
  try {
    return await NativeModules.WalletModule.generateAndStoreMnemonic();
  } catch (e) {
    console.log(e);
  }
};

const storeMnemonic = async mnemonic => {
  try {
    return await NativeModules.WalletModule.storeMnemonic(mnemonic);
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

const signMessage = async message => {
  try {
    return await NativeModules.WalletModule.signMessage(
      ethers.utils.formatBytes32String(message),
    );
  } catch (e) {
    throw 'Sign message failed with error: ' + e;
  }
};

export const NativeWallet = {
  generateMnemonic,
  generateAndStoreMnemonic,
  storeMnemonic,
  retrieveMnemonic,
  signMessage,
};
