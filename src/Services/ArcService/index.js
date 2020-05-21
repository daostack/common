import WalletManager from '../../Util/WalletManager';
import {createCommon} from './createCommon';
import {createProposalRequestToJoin} from './createProposal';

import {Arc} from '@daostack/arc.js';
import {graphHttpLink, graphwsLink, ipfsLink} from '../../Config';

export default class ArcService {
  static serviceInstance = null;
  // this value should coincide with the "migration-experimental" versoin
  ARC_VERSION = '0.1.1-rc.16'; // we should probably read this from the package..

  OVERRIDES = {
    gasLimit: 10000000,
    gasPrice: 15000000000,
  };

  constructor() {
    this.arc = new Arc({
      graphqlHttpProvider: graphHttpLink,
      graphqlWsProvider: graphwsLink,
      ipfsProvider: ipfsLink,
      web3Provider: WalletManager.getInstance().ethWallet,
    });
  }

  static getInstance = async () => {
    if (ArcService.serviceInstance == null) {
      ArcService.serviceInstance = new ArcService();
      console.log('this ->', this);
      console.log('ArcService.serviceInstance ->', ArcService.serviceInstance);
      await ArcService.serviceInstance.arc.fetchContractInfos();
    }
    return ArcService.serviceInstance;
  };

  // PROPOSALS

  async createFundingProposal(data) {}

  createRequestToJoin = async data => {
    return createProposalRequestToJoin(this.arc, data);
  };

  // COMMONS

  async createCommon(givenOpts = {}, navigation, daoStore) {
    return createCommon(
      this.arc,
      givenOpts,
      navigation,
      daoStore,
      this.ARC_VERSION,
      this.OVERRIDES,
    );
  }
}
