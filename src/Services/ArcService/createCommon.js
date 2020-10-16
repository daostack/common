import {createUrl} from '~/Config';
import axios from 'axios';
import WalletManager from '../../Util/WalletManager';
import auth from '@react-native-firebase/auth';
import Logger from '../Logger';

export const createCommon = async (data) => {
  Logger.log('calling createCommon with', data);
  const idToken = await auth().currentUser.getIdToken();
  const body1 = {idToken, data};
  const endpoint = createUrl();

  // logger.log('createCommon ->', body1, endpoint);
  // logger.log(`${endpoint}/createCommonTransaction`);

  const {encodedData, toAddress, safeTxHash} = (await axios.post(`${endpoint}/createCommonTransaction`, body1)).data;

  const manager = await WalletManager.getInstance();
  const signedData = await manager.signSafeTx(safeTxHash);

  const body2 = {encodedData, signedData, toAddress, idToken};
  const response2 = await axios.post(`${endpoint}/createCommon`, body2);

  const daoId = response2.data.daoId;
  if (!daoId) {
    throw Error('No daoId found in the response', response2.data);
  }
  Logger.log(`created a Common ${daoId}`);

  return daoId;
};

