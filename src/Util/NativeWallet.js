import {NativeModules} from 'react-native';
import logger from '../Services/Logger';

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
};
