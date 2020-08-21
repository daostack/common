import { NativeModules } from 'react-native';

const generateMnemonic = async () => {
  try {
    return await NativeModules.WalletModule.generateMnemonic();
  } catch (e) {
    console.log(e);
  }
};

const generateAndStoreMnemonic = async (uid) => {
  try {
    return await NativeModules.WalletModule.generateAndStoreMnemonic(uid);
  } catch (e) {
    console.log(e);
  }
};

const storeMnemonic = async (uid, mnemonic) => {
  try {
    return await NativeModules.WalletModule.storeMnemonic(uid, mnemonic);
  } catch (e) {
    console.log(e);
  }
};

const retrieveMnemonic = async (uid) => {
  try {
    return await NativeModules.WalletModule.retrieveMnemonic(uid);
  } catch (e) {
    console.log(e);
  }
};

export const NativeWallet = {
  generateMnemonic,
  generateAndStoreMnemonic,
  storeMnemonic,
  retrieveMnemonic,
};
