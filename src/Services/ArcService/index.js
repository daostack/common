import WalletManager from '../../Util/WalletManager';
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
} from '../../Config';
import gql from 'graphql-tag';

export default class ArcService {
  static myInstance = null;
  constructor() {
    return (async () => {
      const manager = await WalletManager.getInstance();
      this.arc = new Arc({
        graphqlHttpProvider: graphHttpLink,
        graphqlWsProvider: graphwsLink,
        ipfsProvider: ipfsLink,
        web3Provider: manager.wallet,
      });

      await this.fetchAllContrarcts(this.arc);
      return this;
    })();
  }

  async fetchAllContrarcts(arc ) {

    let allContractInfos = [];
    let contractInfos = null;
    let skip = 0;

    do {
      const query = gql`
      query AllContractInfos {
        contractInfos(first: 1000 skip: ${skip * 1000}) {
          id
          name
          version
          address
          alias
        }
      }
    `;
      const response = await arc.sendQuery(query);
      contractInfos = response.data.contractInfos;
      allContractInfos.push(...contractInfos);
      skip++;
    } while (contractInfos && contractInfos.length > 0);

    const universalContracts = await arc.fetchUniversalContractInfos();
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
  createRequestToJoin = async (daoId, data) => createProposalRequestToJoin(this.arc, daoId, data);

  createFundingProposal = async (userAddress, daoId, data) => createFundingProposal(this.arc, userAddress, daoId, data);

  // VOTING
  voteForJoinAndQuitProposal = async (proposalId, data) => voteForProposal(
    this.arc,
    proposalId,
    data,
    PROPOSAL_TYPE.JoinAndQuit,
  );

  voteForFundingRequestProposal = async (proposalId, data) => voteForProposal(
    this.arc,
    proposalId,
    data,
    PROPOSAL_TYPE.FundingRequest,
  );

  // COMMONS
  async createCommon(givenOpts = {}, navigation) {
    return createCommon(this.arc, givenOpts, navigation);
  }
}
