import {createCommon} from './createCommon';
import {createProposalRequestToJoin} from './createProposal';
import {createFundingProposal} from './createFundingProposal';
import {voteForProposal} from './voteForProposal';
import {
  PROPOSAL_TYPE,
} from '~/Config';

export default class ArcService {
  static myInstance = null;

  static init = () => {
    ArcService.myInstance = new ArcService();
  };

  static getInstance = () => {
    if (ArcService.myInstance == null) {
      throw new Error('ArcService is not initialized');
    }
    return ArcService.myInstance;
  };

  // PROPOSALS
  createRequestToJoin = async (daoId, data) => createProposalRequestToJoin(daoId, data);

  createFundingProposal = async (daoId, data) => createFundingProposal(daoId, data);

  // VOTING
  voteForJoinProposal = async (proposalId, data) => voteForProposal(
    proposalId,
    data,
    PROPOSAL_TYPE.Join,
  );

  voteForFundingRequestProposal = async (proposalId, data) => voteForProposal(
    proposalId,
    data,
    PROPOSAL_TYPE.FundingRequest,
  );

  // COMMONS
  async createCommon(givenOpts = {}, navigation) {
    return createCommon(givenOpts, navigation);
  }
}
