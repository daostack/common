import WalletManager from '~/Util/WalletManager';
import {createCommon} from './createCommon';
import {createProposalRequestToJoin} from './createProposal';
import {createFundingProposal} from './createFundingProposal';
import {voteForProposal} from './voteForProposal';

import {Arc} from '@daostack/arc.js';
import {
  graphHttpLink,
  graphwsLink,
  ipfsLink,
  PROPOSAL_TYPE,
} from '~/Config';
import gql from 'graphql-tag';
const {ARC_VERSION} = require('~/Config');

export default class ArcService {
  static myInstance = null;
  constructor() {
    return (async () => {
      const manager = await WalletManager.getInstance();
      this.arc = new Arc({
        graphqlHttpProvider: graphHttpLink,
        graphqlWsProvider: graphwsLink,
        ipfsProvider: ipfsLink,
        web3Provider: manager.provider,
      });

      await this.fetchAllContracts();

      return this;
    })();
  }

  fetchAllContracts = async () => {

    let allContractInfos = [];
    let contractInfos = null;
    let skip = 0;

    do {
      const query = gql`
      query AllContractInfos {
        contractInfos(first: 1000 skip: ${skip * 1000} where: { version: "${ARC_VERSION}" }) {
          id
          name
          version
          address
          alias
        }
      }
    `;
      const response = await this.arc.sendQuery(query, {fetchPolicy: 'no-cache'});
      contractInfos = response.data.contractInfos;
      allContractInfos.push(...contractInfos);
      skip++;
    } while (contractInfos && contractInfos.length > 0);

    const universalContracts = await this.arc.fetchUniversalContractInfos();
    allContractInfos.push(...universalContracts);
    this.arc.setContractInfos(allContractInfos);

    return allContractInfos;
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
  createRequestToJoin = async (daoId, data) => createProposalRequestToJoin(daoId, data);

  createFundingProposal = async (userAddress, daoId, data) => createFundingProposal(userAddress, daoId, data);

  // VOTING
  voteForJoinProposal = async (proposalId, data) => voteForProposal(
    this.arc,
    proposalId,
    data,
    PROPOSAL_TYPE.Join,
  );

  voteForFundingRequestProposal = async (proposalId, data) => voteForProposal(
    this.arc,
    proposalId,
    data,
    PROPOSAL_TYPE.FundingRequest,
  );

  // COMMONS
  async createCommon(givenOpts = {}, navigation) {
    return createCommon(givenOpts, navigation);
  }
}
