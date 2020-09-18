import WalletManager from '~/Util/WalletManager';
import {PROPOSAL_TYPE, createUrl} from '~/Config';
import logger from '../Logger';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

export const voteForProposal = async (
  proposalId,
  data,
  proposalType = PROPOSAL_TYPE.Join,
) => {
  try {
    const idToken = await auth().currentUser.getIdToken();
    const body1 = {idToken, proposalId, data, proposalType};
    const endpoint = createUrl();
    const {data: {encodedData, safeTxHash, toAddress}} = await axios.post(`${endpoint}/preVotePropoal`, body1);
    console.log('preVotePropoal -->', safeTxHash, toAddress);
    const manager = await WalletManager.getInstance();
    const signedData = await manager.signSafeTx(safeTxHash);
    const body2 = {idToken, encodedData, signedData, toAddress, proposalId};
    const { data: { receipt } } = await axios.post(`${endpoint}/votePropoal`, body2);
    console.log('receipt ->', receipt);
    return receipt;
  } catch (e) {
    logger.log(e);
    throw e;
  }
};
