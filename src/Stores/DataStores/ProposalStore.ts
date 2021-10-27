import {computed, runInAction} from 'mobx';
import BaseStore from './BaseStore';
import {
  subscribeToProposalList,
  fetchProposalById,
  PROPOSAL_STAGES_ACTIVE,
  PROPOSAL_STAGES_HISTORY,
} from '~/Services/ProposalService';
import {FirestoreUnsubscribeFn, IFirebaseDoc} from '~/Firebase/types';
import RootStore from '../RootStore';
import {Proposal} from '../Models/Proposal';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';
import {showBackendError} from '~/Util';

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
      fetchProposalById(id)
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
        .catch(() => {
          showBackendError({
            bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
          });
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
          const isProposer = proposal?.proposerId === userId;
          if (isProposer) {
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
      });
      return [];
    }
  };

  //Actions
  subscribeToProposalById = (proposalId: string): FirestoreUnsubscribeFn =>
    subscribeToProposalList(this.updateStoreData, {
      id: proposalId,
    });

  subscribeToUserActiveProposals = (userId: string): FirestoreUnsubscribeFn =>
    subscribeToProposalList(this.updateStoreData, {
      userId: userId,
      onlyActive: true,
    });

  subscribeToUserAllProposals = (userId: string): FirestoreUnsubscribeFn =>
    subscribeToProposalList(this.updateStoreData, {
      userId: userId,
      showAll: true,
    });

  subscribeToCommonProposals = (commonId: string): FirestoreUnsubscribeFn =>
    subscribeToProposalList(this.updateStoreData, {
      commonId: commonId,
    });

  _applyFilter = (proposal: Proposal, proposalFilter: IProposalFilter) => {
    // Check IProposalFilter.type filter
    if (proposalFilter.type && proposal.type !== proposalFilter.type) {
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
