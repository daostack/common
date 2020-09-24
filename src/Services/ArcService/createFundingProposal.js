import WalletManager from '~/Util/WalletManager';
import {createUrl} from '~/Config';
import logger from '../Logger';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

export const createFundingProposal = async (daoId, data) => {
  // data must look like this
  // {
  //   title: `A test proposal on ${Date()}`,
  //   description: 'Some description',
  //   files: [],
  //   images: [],
  //   links: [], // {title: "title", url: "url"}
  //   funding: new BN(100000),
  // };

  const endpoint = createUrl();
  try {
    const idToken = await auth().currentUser.getIdToken();
    const body1 = {idToken, daoId, data};
    const url = `${endpoint}/createFundingProposalTransaction`;
    const {data: {fundingRequestTx, setFlagTx}} = await axios.post(url, body1);
    logger.log('data ->', fundingRequestTx, setFlagTx);
    const manager = await WalletManager.getInstance();
    const fundingSignedData = await manager.signSafeTx(fundingRequestTx.safeTxHash);

    let signedFlagTx = null;
    if (setFlagTx) {
      const flagSignedData = await manager.signSafeTx(setFlagTx.safeTxHash);
      signedFlagTx = {...setFlagTx, signedData: flagSignedData};
    }
    const body2 = {
      idToken,
      daoId,
      fundingRequestTx: {...fundingRequestTx, signedData: fundingSignedData},
      setFlagTx: signedFlagTx,
    };

    const {data: {proposalId}} = await axios.post(`${endpoint}/createFundingProposal`, body2);
    logger.log('proposalId ->', proposalId);
    return proposalId;

  } catch (error) {
    if (error.response) {
      // Request made and server responded
      console.log(1, error.response.data);
      console.log(1, error.response.status);
      console.log(1, error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(2, error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    logger.log('Error in createFundingProposal.js', error);
    logger.log('Error in createFundingProposal.js', error.response);
    throw `Error connectiong to ${endpoint}: ${error}`;
  }
};
