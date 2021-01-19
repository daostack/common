import {decorate, computed, observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {
  subscribeToProposalList,
  PROPOSAL_STAGES_ACTIVE,
  PROPOSAL_STAGES_HISTORY,
} from '~/Services/ListServices/ProposalListService';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {Proposal} from '../Models/Proposal';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PROPOSAL_TYPE} from '~/Config';

interface IStageProposalFilter {
  active?: boolean;
  history?: boolean;
}

interface ITypeProposalFilter {
  onlyFundingRequests?: boolean;
  onlyRequestsToJoin?: boolean;
}

interface IUserProposalFilter extends ITypeProposalFilter {}

interface ICommonProposalFilter extends IStageProposalFilter {}
export default class ProposalStore extends ListStore<Proposal> {
  rootStore: RootStore;
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super();
    this.rootStore = rootStore;
    this.isLoading = false;
  }
  // Computed fields
  get myActiveProposals() {
    if (!this.rootStore.authStore.userInfo?.uid) {
      return [];
    }
    return this.getUserActiveProposals(this.rootStore.authStore.userInfo?.uid, {
      onlyFundingRequests: true,
    });
  }

  get myActiveMembershipRequests() {
    if (!this.rootStore.authStore.userInfo?.uid) {
      return [];
    }
    return this.getUserActiveProposals(this.rootStore.authStore.userInfo?.uid, {
      onlyRequestsToJoin: true,
    });
  }

  // Data consuming methods
  getProposalById = (id: string): Proposal | undefined => super.getDataById(id);

  getUserActiveProposals = (
    userId: string,
    proposalFilter: IUserProposalFilter,
  ): Array<Proposal> | undefined =>
    this.getDataArray?.filter((proposal: Proposal) => {
      const isProposer = proposal.proposerId === userId;
      if (isProposer) {
        if (proposalFilter.onlyFundingRequests) {
          return (
            proposal.type === PROPOSAL_TYPE.FundingRequest &&
            this._filterProposalState(proposal, {active: true})
          );
        }
        if (proposalFilter.onlyRequestsToJoin) {
          return (
            proposal.type === PROPOSAL_TYPE.Join &&
            this._filterProposalState(proposal, {active: true})
          );
        }
      }
      return isProposer;
    });

  getCommonProposals = (
    commonId: string,
    proposalFilter: ICommonProposalFilter,
  ): Array<Proposal> | undefined =>
    this.getDataArray?.filter((proposal: Proposal) => {
      const isSameCommon = proposal.commonId === commonId;
      if (isSameCommon) {
        return this._filterProposalState(proposal, proposalFilter);
      }
      return isSameCommon;
    });

  //Actions
  subscribeToUserProposals = (userId: string): FirestoreUnsubscribeFn =>
    subscribeToProposalList(this._updateProposalList, {
      userId: userId,
    });

  subscribeToCommonProposals = (commonId: string): FirestoreUnsubscribeFn =>
    subscribeToProposalList(this._updateProposalList, {
      commonId: commonId,
    });

  // Private function
  _updateProposalList = (updatedUserList: Array<IProposalEntity>) => {
    runInAction(() => {
      this.isLoading = true;
    });

    updatedUserList.forEach((proposalEntity: IProposalEntity) => {
      console.log();
      super.setData(proposalEntity.id, new Proposal(proposalEntity));
    });

    runInAction(() => {
      this.isLoading = false;
    });
  };

  _filterProposalState = (
    proposal: Proposal,
    proposalFilter: IStageProposalFilter,
  ) => {
    if (proposalFilter.history) {
      return (
        PROPOSAL_STAGES_HISTORY.some((stg) => stg === proposal.state) &&
        !ACTIVE_PAYMENT_STATES.some((x) => x === proposal.paymentState)
      );
    }
    if (proposalFilter.active) {
      return (
        PROPOSAL_STAGES_ACTIVE.some((stg) => stg === proposal.state) ||
        ACTIVE_PAYMENT_STATES.some((x) => x === proposal.paymentState)
      );
    }
  };
}

decorate(ProposalStore, {
  //observables
  isLoading: observable,

  //computed
  myActiveProposals: computed,
  myActiveMembershipRequests: computed,
});
