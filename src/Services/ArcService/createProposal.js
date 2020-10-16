import auth from '@react-native-firebase/auth';
import axios from 'axios';

import WalletManager from '~/Util/WalletManager';
import {createUrl, relayerUrl} from '~/Config';

import logger from '../Logger';
import {circlePayUrl} from '../../Config';

export const createProposalRequestToJoin = async (daoId, data) => {
  const idToken = await auth().currentUser.getIdToken();

  const {cardData, ...rest} = data;

  const createEndpoint = createUrl();
  const circleEndpoint = circlePayUrl();

  if (!cardData) {
    throw new Error('Trying to create proposal without a card!');
  }

  const createTransactionBody = {
    idToken,
    daoId,
    rest,
  };


  // --- Create the transaction
  const {encodedData, safeTxHash, toAddress} = (await axios.post(`${createEndpoint}/createRequestToJoinTransaction`, createTransactionBody)).data;


  // --- Sign the data
  const manager = await WalletManager.getInstance();
  const signature = await manager.signSafeTx(safeTxHash);


  const createProposalBody = {
    idToken,
    createProposalTx: {
      to: toAddress,
      value: '0',
      data: encodedData,
      signature: signature,
    },
    // @todo Ask about the preAuthId (Jelle if I forgot to ask on the call now I'm asking you :D)
    // preAuthId: data.preAuthId,
    // cardId: data.card,
    cardData,
  };

  const response = await axios.post(
    `${relayerUrl()}/requestToJoin`,
    createProposalBody
  );
  if (!response.data) {
    throw new Error('Response has no "data" property - thats not good at all :(');
  }

  if (response.status !== 200) {
    throw new Error(response.data.error);
  }

  if (!response.data.proposalId) {
    // TODO: print or return tha transaction hash, so we can debug more easily
    // this happens typically when some preconditions are not met (say you are already a member)
    throw new Error('No proposal Id was found in the response');
  }

  logger.log(`Created proposal with id ${response.data.proposalId}`);

  return response.data.proposalId;
};
