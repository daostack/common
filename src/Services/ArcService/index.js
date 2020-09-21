import {createCommon} from './createCommon';
import {createProposalRequestToJoin} from './createProposal';
import {createFundingProposal} from './createFundingProposal';
import {voteForProposal} from './voteForProposal';
import {
  PROPOSAL_TYPE,
} from '~/Config';

export default class ArcService {

  // PROPOSALS
  static createRequestToJoin = async (daoId, data) => createProposalRequestToJoin(daoId, data);

  static createFundingProposal = async (daoId, data) => createFundingProposal(daoId, data);

  // VOTING
  static voteForJoinProposal = async (proposalId, data) => voteForProposal(
    proposalId,
    data,
    PROPOSAL_TYPE.Join,
  );

  static voteForFundingRequestProposal = async (proposalId, data) => voteForProposal(
    proposalId,
    data,
    PROPOSAL_TYPE.FundingRequest,
  );

  // COMMONS
  static createCommon = async (givenOpts = {}, navigation) => {
    return createCommon(givenOpts, navigation);
  }
}
