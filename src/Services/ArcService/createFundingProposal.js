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

  try {
    const idToken = await auth().currentUser.getIdToken();
    const body1 = {idToken, daoId, data};
    const endpoint = createUrl();
    const {data: {fundingRequestTx, setFlagTx}} = await axios.post(`${endpoint}/createFundingProposalTransaction`, body1);

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

  } catch (e) {
    logger.log(e);
    logger.log(e.response);
    throw e;
  }
};
