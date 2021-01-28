import {computed, observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {subscribeToProposalList} from '~/Services/ListServices/ProposalListService';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDocChange,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import RootStore from '../RootStore';
import {Proposal} from '../Models/Proposal';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';

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
  typeFilter === PROPOSAL_TYPE.Join;

export const isStageFilterActive = (stageFilter: IProposalStageFilter) =>
  stageFilter === PROPOSAL_STAGE.Active;

export const isStageFilterHistory = (stageFilter: IProposalStageFilter) =>
  stageFilter === PROPOSAL_STAGE.History;

export default class ProposalStore extends ListStore<Proposal> {
  @observable
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
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

  // Data consuming methods
  getProposalById = (id: string): Proposal | undefined => super.getDataById(id);

  getUserProposals = (
    userId: string,
    proposalFilter: IProposalFilter,
  ): Array<Proposal> =>
    this.getDataArray.filter((proposal: Proposal) => {
      const isProposer = proposal.proposerId === userId;
      if (isProposer) {
        return this._applyFilter(proposal, proposalFilter);
      }
      return false;
    });

  getCommonProposals = (
    commonId: string,
    proposalFilter: IProposalFilter,
  ): Array<Proposal> =>
    this.getDataArray.filter((proposal: Proposal) => {
      const isSameCommon = proposal.commonId === commonId;
      if (isSameCommon) {
        return this._applyFilter(proposal, proposalFilter);
      }
      return false;
    });

  //Actions
  subscribeToUserActiveProposals = (userId: string): FirestoreUnsubscribeFn =>
    subscribeToProposalList(this._updateProposalList, {
      userId: userId,
      onlyActive: true,
    });

  subscribeToCommonProposals = (commonId: string): FirestoreUnsubscribeFn =>
    subscribeToProposalList(this._updateProposalList, {
      commonId: commonId,
    });

  // Private function
  _updateProposalList = (
    updatedUserList: IFirebaseSnapshot<IProposalEntity>,
  ) => {
    runInAction(() => {
      this.isLoading = true;
    });

    const updatesMap = new Map<string, Proposal>();

    // Initial loading
    updatedUserList
      .docChanges()
      .forEach((updatedProposalDoc: IFirebaseDocChange<IProposalEntity>) => {
        const updatedProposal = updatedProposalDoc.doc.data();

        updatesMap.set(updatedProposal.id, new Proposal(updatedProposal));
      });

    runInAction(() => {
      this.data.merge(updatesMap);
      this.isLoading = false;
    });
  };

  _applyFilter = (proposal: Proposal, proposalFilter: IProposalFilter) => {
    // Check IProposalFilter.type filter
    if (proposalFilter.type && proposal.type !== proposalFilter.type) {
      return false;
    }
    // Check IProposalFilter.stage filter
    if (proposalFilter.stage) {
      if (
        (proposal.isActive && !isStageFilterActive(proposalFilter.stage)) ||
        (proposal.isHistory && !isStageFilterHistory(proposalFilter.stage))
      ) {
        return false;
      }
    }
    return true;
  };
}
