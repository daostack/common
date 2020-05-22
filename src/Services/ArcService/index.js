import WalletManager from '../../Util/WalletManager';
import {createCommon} from './createCommon';
import {createProposalRequestToJoin} from './createProposal';
import {createFundingProposal} from './createFundingProposal';

import {Arc} from '@daostack/arc.js';
import {graphHttpLink, graphwsLink, ipfsLink} from '../../Config';

let serviceInstance = null;

export default class ArcService {
  constructor() {
    this.arc = new Arc({
      graphqlHttpProvider: graphHttpLink,
      graphqlWsProvider: graphwsLink,
      ipfsProvider: ipfsLink,
      web3Provider: WalletManager.getInstance().wallet,
    });
  }

  init = async () => {
    await serviceInstance.arc.fetchContractInfos();
  };

  static getInstance = () => {
    if (serviceInstance == null) {
      serviceInstance = new ArcService();
      serviceInstance.init();
    }
    return serviceInstance;
  };

  // PROPOSALS
  createRequestToJoin = async (daoId, data) => {
    return createProposalRequestToJoin(this.arc, daoId, data);
  };

  createFundingProposal = async data => {
    return createFundingProposal(this.arc, data);
  };

  // COMMONS

  async createCommon(givenOpts = {}, navigation, daoStore) {
    return createCommon(this.arc, givenOpts, navigation, daoStore);
  }
}
