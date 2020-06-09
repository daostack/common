import WalletManager from '../../Util/WalletManager';
import {createCommon} from './createCommon';
import {createProposalRequestToJoin} from './createProposal';
import {createFundingProposal} from './createFundingProposal';
import {voteForJoinAndQuitProposal} from './voteForJoinAndQuitProposal';

import {Arc} from '@daostack/arc.js';
import {graphHttpLink, graphwsLink, ipfsLink} from '../../Config';

export default class ArcService {
  static myInstance = null;
  constructor() {
    return ( async () => {
      this.arc = new Arc({
        graphqlHttpProvider: graphHttpLink,
        graphqlWsProvider: graphwsLink,
        ipfsProvider: ipfsLink,
        web3Provider: WalletManager.getInstance().wallet,
      });
      await this.arc.fetchContractInfos();
      return this;
    })();
  }

  static init = async () => {
    ArcService.myInstance = await new ArcService();
  };

  static getInstance = () => {
    if (ArcService.myInstance == null) {
      throw new Error('ArcService is not initialized');
    }
    return ArcService.myInstance;
  };

  // PROPOSALS
  createRequestToJoin = async (daoId, data) => {
    return createProposalRequestToJoin(this.arc, daoId, data);
  };

  createFundingProposal = async data => {
    return createFundingProposal(this.arc, data);
  };

  // VOTIN

  voteForJoinAndQuitProposal = async (proposalId, data) => {
    return voteForJoinAndQuitProposal(this.arc, proposalId, data)
  }

  // COMMONS

  async createCommon(givenOpts = {}, navigation, daoStore) {
    return createCommon(this.arc, givenOpts, navigation, daoStore);
  }
}
