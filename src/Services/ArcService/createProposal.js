// TODO: rename this file to °createProposalRequestToJoin.js°
import WalletManager from '~/Util/WalletManager';
import logger from '../Logger';
import {createUrl, relayerUrl} from '~/Config';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

export const createProposalRequestToJoin = async (daoId, data) => {
  try {
    const idToken = await auth().currentUser.getIdToken();
    const body1 = {idToken, daoId, data};
    const endpoint = createUrl();
    const {data: {encodedData, safeTxHash, toAddress}} = await axios.post(`${endpoint}/createRequestToJoinTransaction`, body1);
    const manager = await WalletManager.getInstance();
    const signature = await manager.signSafeTx(safeTxHash);

    const body2 =
    {
      idToken,
      createProposalTx: {
        to: toAddress,
        value: '0',
        data: encodedData,
        signature: signature,
      },
      preAuthId: data.preAuthId,
      cardId: data.card,
    };

    const response = await axios.post(
      `${relayerUrl()}/requestToJoin`,
      body2
    );
    let msg;
    if (!response.data) {
      // logger.log('RequestToJoin response -->', response);
      msg = 'Response has no "data" property - thats not good at all :(';
      throw Error(msg);
    }
    logger.log('RequestToJoin response.data -->', response.status, response.data);
    if (response.status !== 200) {
      msg = `${response.data.error}`;
      throw Error(msg);
    }

    if (!response.data.proposalId) {
      // TODO: print or return tha transaction hash, so we can debug more easily
      // this happens typically when some preconditions are not met (say you are already a member)
      msg = 'No proposal Id was found in the response';
      throw Error(msg);
    }
    logger.log(`Created proposal with id ${response.data.proposalId}`);

    return response.data.proposalId;
  } catch (e) {
    logger.log(e);
    throw e;
  }
};
