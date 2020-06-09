import WalletManager from '../../Util/WalletManager';
import {createCommon} from './createCommon';
import {createProposalRequestToJoin} from './createProposal';
import {createFundingProposal} from './createFundingProposal';

import {Arc} from '@daostack/arc.js';
import {graphHttpLink, graphwsLink, ipfsLink} from '../../Config';

export default class ArcService {
  static myInstance = null;
  constructor() {
    return (async () => {
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

  createFundingProposal = async (userAddress, daoId, data) => {
    return createFundingProposal(this.arc, userAddress, daoId, data);
  };

  getJoinAndQuitPluginAddress = async (daoId) => {
    try {
      const dao = this.arc.dao(daoId);
      let joinAndQuitPlugin = await dao.plugin({where: {name: 'JoinAndQuit'}});
      return joinAndQuitPlugin.coreState.address;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  // COMMONS

  async createCommon(givenOpts = {}, navigation, daoStore) {
    return createCommon(this.arc, givenOpts, navigation, daoStore);
  }
}
