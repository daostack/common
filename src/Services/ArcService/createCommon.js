import {createUrl} from '~/Config';
import logger from '../Logger';
import axios from 'axios';
import WalletManager from '../../Util/WalletManager';
import auth from '@react-native-firebase/auth';

// USAGE:
// const commonAddress = await createCommon({
//   name: formData.name,
//   founderAddresses: [address],
//   tokenDist: [0],
//   repDist: [100],
//   minFeeToJoin: 100, //
//   fundingGoal: 1000, // T
//   fundingGoalDeadline: (await provider.getBlock('latest')).timestamp + 3000,
//       byline: formData.byline,
//       description: formData.description,
//       courseOfAction: formData.action,
//       // TODO: actuall add the values here (as an arry probably)
//       rules: formData.rules,
//       links: formData.links,
/// });

export const createCommon = async (givenOpts, navigation) => {
  // need these keys:
  try {
    const idToken = await auth().currentUser.getIdToken();
    const body1 = {idToken, givenOpts};
    const endpoint = createUrl();
    logger.log('createCommon ->', body1, endpoint);
    const {data: {encodedData, toAddress, safeTxHash}} = await axios.post(`${endpoint}/preCommonCreation`, body1);
    const manager = await WalletManager.getInstance();
    const signedData = await manager.signSafeTx(safeTxHash);
    const body2 = {encodedData, signedData, toAddress, idToken};
    const response2 = await axios.post(`${endpoint}/createCommon`, body2);
    console.log('createCommon -->', response2);
    return response2.data.daoId;
  } catch (e) {
    // navigation.pop();
    throw e;
  }
};

