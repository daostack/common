import {createUrl} from '~/Config';
import logger from '../Logger';
import axios from 'axios';
import WalletManager from '../../Util/WalletManager';
import auth from '@react-native-firebase/auth';

export const createCommon = async (data, navigation) => {
  const idToken = await auth().currentUser.getIdToken();
  const body1 = {idToken, data};
  const endpoint = createUrl();

  // logger.log('createCommon ->', body1, endpoint);
  console.log(`${endpoint}/createCommonTransaction`);

  const {encodedData, toAddress, safeTxHash} = (await axios.post(`${endpoint}/createCommonTransaction`, body1)).data;

  const manager = await WalletManager.getInstance();
  const signedData = await manager.signSafeTx(safeTxHash);

  const body2 = {encodedData, signedData, toAddress, idToken};
  const response2 = await axios.post(`${endpoint}/createCommon`, body2);

  logger.log('createCommon -->', response2);

  return response2.data.daoId;
};

