import {NativeModules} from 'react-native';
import logger from '../Services/Logger';

const createWallet = async (uid) => {
  try {
    const address = await NativeModules.WalletModule.createWallet(uid);
    return address.toLowerCase();
  } catch (e) {
    logger.log(e);
  }
};

const getAddress = async () => {
  try {
    const address = await NativeModules.WalletModule.getAddress();
    return address.toLowerCase();
  } catch (e) {
    logger.log(e);
  }
};

const signMessage = async (message) => {
  try {
    const signedData = await NativeModules.WalletModule.signMessage(message);
    return signedData;
  } catch (e) {
    logger.log(e);
  }
};


const generateMnemonic = async () => {
  try {
    return await NativeModules.WalletModule.generateMnemonic();
  } catch (e) {
    logger.log(e);
  }
};

const generateAndStoreMnemonic = async (uid) => {
  try {
    return await NativeModules.WalletModule.generateAndStoreMnemonic(uid);
  } catch (e) {
    logger.log(e);
  }
};

const storeMnemonic = async (uid, mnemonic) => {
  try {
    return await NativeModules.WalletModule.storeMnemonic(uid, mnemonic);
  } catch (e) {
    logger.log(e);
  }
};

const retrieveMnemonic = async (uid) => {
  try {
    return await NativeModules.WalletModule.retrieveMnemonic(uid);
  } catch (e) {
    logger.log(e);
  }
};

export const NativeWallet = {
  generateMnemonic,
  generateAndStoreMnemonic,
  storeMnemonic,
  retrieveMnemonic,
  createWallet,
  getAddress,
  signMessage,
};
