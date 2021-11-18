import {makeAutoObservable} from 'mobx';
import {
  PROPOSAL_STAGES_ACTIVE,
  PROPOSAL_STAGES_HISTORY,
} from '~/Services/ProposalService';
import {Proposal} from '../Models/Proposal';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Types';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';
import {getCurrentUser} from '../Models/auth';
import {
  getActiveProposals,
  getProposalById,
  getProposals,
} from '../data-sources';

export type IProposalStageFilter =
  | typeof PROPOSAL_STAGE.Active
  | typeof PROPOSAL_STAGE.History;

export type IProposalTypeFilter =
  | typeof PROPOSAL_TYPE.FundingRequest
  | typeof PROPOSAL_TYPE.Join;
export interface IProposalFilter {
  type: IProposalTypeFilter;
  stage: IProposalStageFilter;
}

export const isTypeFilterJoin = (typeFilter: IProposalTypeFilter) =>
  typeFilter === PROPOSAL_TYPE.Join;

export const isTypeFilterFundingRequest = (typeFilter: IProposalTypeFilter) =>
  typeFilter === PROPOSAL_TYPE.FundingRequest;

export const isStageFilterActive = (stageFilter: IProposalStageFilter) =>
  stageFilter === PROPOSAL_STAGE.Active;

export const isStageFilterHistory = (stageFilter: IProposalStageFilter) =>
  stageFilter === PROPOSAL_STAGE.History;

export const isProposalActive = (proposal: Proposal) =>
  PROPOSAL_STAGES_ACTIVE.some((stg) => stg === proposal.state) ||
  ACTIVE_PAYMENT_STATES.some((x) => x === proposal.paymentState);

export const isProposalHistory = (proposal: Proposal) =>
  PROPOSAL_STAGES_HISTORY.some((stg) => stg === proposal.state) &&
  !ACTIVE_PAYMENT_STATES.some((x) => x === proposal.paymentState);

export class ProposalStore {
  constructor() {
    makeAutoObservable(this);
  }
  get myActiveProposals() {
    return getActiveProposals();
  }

  get myActiveMembershipRequests() {
    return getProposals({
      uid: getCurrentUser()!.uid,
      type: 'user',
      params: {
        type: PROPOSAL_TYPE.Join,
        stage: PROPOSAL_STAGE.Active,
      },
    });
  }

  // Data consuming methods
  getProposalById = (id: string) => getProposalById(id);

  getUserProposals = (uid: string, params: IProposalFilter) =>
    getProposals({
      uid,
      type: 'user',
      params,
    });

  getCommonProposals = (commonId: string, params: IProposalFilter) =>
    getProposals({
      commonId,
      type: 'common',
      params,
    });
}
