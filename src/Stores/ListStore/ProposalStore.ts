import {decorate, computed, observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {
  subscribeToProposalList,
  PROPOSAL_STAGES_ACTIVE,
  PROPOSAL_STAGES_HISTORY,
} from '~/Services/ListServices/ProposalListService';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDocChange,
  IFirebaseSnapshot,
} from '~/Firebase/types';
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
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }
  // Computed fields
  get myActiveProposals() {
    if (this.isLoading || !this.rootStore.authStore.userInfo?.uid) {
      return [];
    }
    return this.getUserActiveProposals(this.rootStore.authStore.userInfo?.uid, {
      onlyFundingRequests: true,
    });
  }

  get myActiveMembershipRequests() {
    if (this.isLoading || !this.rootStore.authStore.userInfo?.uid) {
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
  ): Array<Proposal> | [] =>
    this.getDataArray?.filter((proposal: Proposal) => {
      const isProposer = proposal.proposerId === userId;
      if (isProposer) {
        if (proposalFilter.onlyFundingRequests) {
          return (
            proposal.type === PROPOSAL_TYPE.FundingRequest &&
            this._checkProposalState(proposal, {active: true})
          );
        }
        if (proposalFilter.onlyRequestsToJoin) {
          return (
            proposal.type === PROPOSAL_TYPE.Join &&
            this._checkProposalState(proposal, {active: true})
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
        return this._checkProposalState(proposal, proposalFilter);
      }
      return isSameCommon;
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

    // Initial loading
    updatedUserList
      .docChanges()
      .forEach((updatedProposalDoc: IFirebaseDocChange<IProposalEntity>) => {
        const currProposal = updatedProposalDoc.doc.data();
        // TODO: implement setUpdates method to handle single field changes in existing models

        // let proposal = this.getDataById(currProposal.id);
        // if (proposal) {
        //   proposal.setUpdates(updatedProposalDoc);
        // } else {
        this.setData(currProposal.id, new Proposal(currProposal));
        // }
      });

    runInAction(() => {
      this.isLoading = false;
    });
  };

  _checkProposalState = (
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
