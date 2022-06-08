import {computed, runInAction} from 'mobx';
import BaseStore from './BaseStore';
import ProposalService, {
  PROPOSAL_STAGES_ACTIVE,
  PROPOSAL_STAGES_HISTORY,
} from '~/Services/ProposalService';
import {FirestoreUnsubscribeFn, IFirebaseDoc} from '~/Firebase/types';
import RootStore from '../RootStore';
import {Proposal} from '../Models/Proposal';
import {
  IProposalEntity,
  IProposalVote,
} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';
import {showBackendError} from '~/Util';
import {VOTE_STATUSES} from '~/Util/constants/votes';

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
  Array.isArray(stageFilter)
    ? stageFilter.includes(PROPOSAL_STAGE.Active)
    : stageFilter === PROPOSAL_STAGE.Active;

export const isStageFilterHistory = (stageFilter: IProposalStageFilter) =>
  Array.isArray(stageFilter)
    ? stageFilter.includes(PROPOSAL_STAGE.History)
    : stageFilter === PROPOSAL_STAGE.History;

export const isProposalActive = (proposal: Proposal) =>
  PROPOSAL_STAGES_ACTIVE.some((stg) => stg === proposal.state) ||
  ACTIVE_PAYMENT_STATES.some((x) => x === proposal.paymentState);

export const isProposalHistory = (proposal: Proposal) =>
  PROPOSAL_STAGES_HISTORY.some((stg) => stg === proposal.state) &&
  !ACTIVE_PAYMENT_STATES.some((x) => x === proposal.paymentState);

export default class ProposalStore extends BaseStore<
  Proposal,
  IProposalEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }
  @computed
  get myActiveProposals() {
    if (this.isLoading || !this.rootStore.authStore.userInfo?.uid) {
      return [];
    }
    return this.getUserProposals(this.rootStore.authStore.userInfo?.uid, {
      type: PROPOSAL_TYPE.FundingRequest,
      stage: PROPOSAL_STAGE.Active,
    });
  }

  @computed
  get myActiveMembershipRequests() {
    if (this.isLoading || !this.rootStore.authStore.userInfo?.uid) {
      return [];
    }
    return this.getUserProposals(this.rootStore.authStore.userInfo?.uid, {
      type: PROPOSAL_TYPE.Join,
      stage: PROPOSAL_STAGE.Active,
    });
  }

  // Overriden methods
  getEntityModel(entity: IProposalEntity): Proposal {
    return new Proposal(entity);
  }

  // Data consuming methods
  getProposalById = (id: string): Proposal | undefined => {
    try {
      return this.getDataById(id);
    } catch (errr) {
      ProposalService.fetchProposalById(id)
        .then((proposal: IFirebaseDoc<IProposalEntity>) => {
          if (proposal.exists) {
            runInAction(() => {
              this.setData(
                id,
                this.getEntityModel(this.firestoreDocToEntity(proposal)),
              );
            });
          }
        })
        .catch((error) => {
          if (!error.message.includes('is required parameter')) {
            showBackendError({
              bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
              methodName: 'getProposalById',
            });
          }
        });
      return undefined;
    }
  };

  getUserProposals = (
    userId: string,
    proposalFilter: IProposalFilter,
  ): Array<Proposal> => {
    try {
      return this.getDataArray
        .filter((proposal: Proposal) => {
          const isCommonActive = this.rootStore.commonStore.getCommonById(
            proposal.commonId,
          )?.active;
          const isProposer = proposal?.proposerId === userId;
          if (isProposer && isCommonActive) {
            return this._applyFilter(proposal, proposalFilter);
          }
          return false;
        })
        .sort(
          (proposal: Proposal, prevProposal: Proposal) =>
            prevProposal.createdAt?.seconds - proposal.createdAt?.seconds,
        );
    } catch (error) {
      showBackendError({
        bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
        methodName: 'getUserProposals',
      });
      return [];
    }
  };

  getCommonProposals = (
    commonId: string,
    proposalFilter: IProposalFilter,
  ): Array<Proposal> => {
    try {
      return this.getDataArray
        .filter((proposal: Proposal) => {
          const isSameCommon = proposal?.commonId === commonId;
          if (isSameCommon) {
            return this._applyFilter(proposal, proposalFilter);
          }
          return false;
        })
        .sort(
          (proposal: Proposal, prevProposal: Proposal) =>
            prevProposal.createdAt?.seconds - proposal.createdAt?.seconds,
        );
    } catch (error) {
      showBackendError({
        bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
        methodName: 'getCommonProposals',
      });
      return [];
    }
  };

  getVotesCounts = (
    votes: IProposalVote[] = [],
  ): {
    approvedCount: number;
    abstainedCount: number;
    rejectedCount: number;
    allVoteCount: number;
  } => {
    const votesCounts = {
      approvedCount: 0,
      abstainedCount: 0,
      rejectedCount: 0,
    };
    votes.forEach((vote: IProposalVote) => {
      switch (vote.voteOutcome) {
        case VOTE_STATUSES.APPROVED:
          votesCounts.approvedCount++;
          break;
        case VOTE_STATUSES.ABSTAINED:
          votesCounts.abstainedCount++;
          break;
        case VOTE_STATUSES.REJECTED:
          votesCounts.rejectedCount++;
          break;
      }
    });
    return {
      ...votesCounts,
      allVoteCount:
        votesCounts.abstainedCount +
        votesCounts.approvedCount +
        votesCounts.rejectedCount,
    };
  };

  //Actions
  subscribeToProposalById = (proposalId: string): FirestoreUnsubscribeFn =>
    ProposalService.subscribeToProposalList(this.updateStoreData, {
      id: proposalId,
    });

  subscribeToUserActiveProposals = (userId: string): FirestoreUnsubscribeFn =>
    ProposalService.subscribeToProposalList(this.updateStoreData, {
      userId: userId,
      onlyActive: true,
    });

  subscribeToUserAllProposals = (userId: string): FirestoreUnsubscribeFn =>
    ProposalService.subscribeToProposalList(this.updateStoreData, {
      userId: userId,
      showAll: true,
    });

  subscribeToCommonProposals = (commonId: string): FirestoreUnsubscribeFn =>
    ProposalService.subscribeToProposalList(this.updateStoreData, {
      commonId: commonId,
    });

  _applyFilter = (proposal: Proposal, proposalFilter: IProposalFilter) => {
    // Check IProposalFilter.type filter
    if (proposalFilter.type && proposal.type !== proposalFilter.type) {
      return false;
    }
    if (proposalFilter.state && proposal.state !== proposalFilter.state) {
      return false;
    }
    // Check IProposalFilter.stage filter
    if (proposalFilter.stage) {
      if (
        (isProposalActive(proposal) &&
          !isStageFilterActive(proposalFilter.stage)) ||
        (isProposalHistory(proposal) &&
          !isStageFilterHistory(proposalFilter.stage))
      ) {
        return false;
      }
    }
    return true;
  };
}
