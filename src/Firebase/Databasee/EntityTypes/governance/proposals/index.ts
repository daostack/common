import {PROPOSALS} from '~/Shared/enums/proposals';
import {IBaseEntity} from '../../IBaseEntity';
import {FundsAllocation} from './FundsAllocation';
import {FundsRequest} from './FundsRequest';
import {MemberAdmittance} from './MemberAdmittance';
import {BasicArgsProposal} from '../proposals/BaseProposal';

type ProposalInProgressKeys =
  | 'data'
  | 'state'
  | 'votes'
  | 'type'
  | 'approvalDate'
  | 'moderation'
  | keyof IBaseEntity
  | keyof BasicArgsProposal;

/**
 * Rules derived from Governance collection based on proposal keys
 */
export interface Proposals {
  [PROPOSALS.MEMBER_ADMITTANCE]: Omit<MemberAdmittance, ProposalInProgressKeys>;
  [PROPOSALS.FUNDS_REQUEST]: Omit<FundsRequest, ProposalInProgressKeys>;
  [PROPOSALS.FUNDS_ALLOCATION]: Omit<FundsAllocation, ProposalInProgressKeys>;
  // Expended for each proposal
}
