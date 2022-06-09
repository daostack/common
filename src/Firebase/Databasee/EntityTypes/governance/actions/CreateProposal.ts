import {BaseAction} from './BaseAction';
import {PROPOSALS} from '~/Shared/enums/proposals';
import {MemberAdmittanceArgs} from '../proposals/MemberAdmittance';
import {FundsRequestArgs} from '../proposals/FundsRequest';
import {FundsAllocationArgs} from '../proposals/FundsAllocation';

export interface CreateProposal extends BaseAction {
  proposal: PROPOSALS;
  [PROPOSALS.MEMBER_ADMITTANCE]: MemberAdmittanceArgs;
  [PROPOSALS.FUNDS_ALLOCATION]: FundsAllocationArgs;
  [PROPOSALS.FUNDS_REQUEST]: FundsRequestArgs;
  // cont for each proposal type
}
