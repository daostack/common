import {action, computed, observable, ObservableMap} from 'mobx';
import BaseStore from './BaseStore';
import {
  getCommonActiveProposals,
  getCommonHistoryProposals,
  getCommonPendingReqToJoins,
  getCommonHistoryReqToJoins,
  onProposalChange,
  fetchProposalById,
} from '~/Services/ListServices/ProposalListService';
import RootStore from '../RootStore';
import {Proposal} from '../Models/Proposal';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import {
  PROPOSAL_STAGES_ACTIVE,
  PROPOSAL_STAGES_HISTORY,
} from '~/Services/ListServices/ProposalListService';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';

import {showBackendError} from '~/Util';

import {ProposalState, ProposalType, ProposalEntity} from '~/Graphql/Proposal';
import Logger from '~/Services/Logger';

export type IProposalStageFilter =
  | typeof PROPOSAL_STAGE.Active
  | typeof PROPOSAL_STAGE.History;

export type IProposalTypeFilter =
  | typeof ProposalType.FUNDING_REQUEST
  | typeof ProposalType.JOIN_REQUEST;

export interface IProposalFilter {
  type: IProposalTypeFilter;
  stage: IProposalStageFilter;
}

export const isTypeFilterJoin = (typeFilter: IProposalTypeFilter) =>
  typeFilter === ProposalType.JOIN_REQUEST;

export const isTypeFilterFundingRequest = (typeFilter: IProposalTypeFilter) =>
  typeFilter === ProposalType.FUNDING_REQUEST;

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

export default class ProposalStore extends BaseStore<Proposal, ProposalEntity> {
  @observable
  private fetchedProposal: ObservableMap<string, Proposal> = observable.map({});

  @observable
  private commonActiveProposals: ObservableMap<string, Proposal> =
    observable.map({});

  @observable
  private commonHistoryProposals: ObservableMap<string, Proposal> =
    observable.map({});

  @observable
  private commonPendingReqToJoins: ObservableMap<string, Proposal> =
    observable.map({});

  @observable
  private commonHistoryReqToJoins: ObservableMap<string, Proposal> =
    observable.map({});

  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  @computed
  get getCommonActiveProposals(): readonly Proposal[] {
    return this.toDataArray(this.commonActiveProposals);
  }

  @computed
  get getCommonHistoryProposals(): readonly Proposal[] {
    return this.toDataArray(this.commonHistoryProposals);
  }

  @computed
  get getCommonPendingReqToJoins(): readonly Proposal[] {
    return this.toDataArray(this.commonPendingReqToJoins);
  }

  @computed
  get getCommonHistoryReqToJoins(): readonly Proposal[] {
    return this.toDataArray(this.commonHistoryReqToJoins);
  }

  // Overriden methods
  getEntityModel(entity: ProposalEntity): Proposal {
    return new Proposal(entity);
  }

  // TODO
  // getRequestToJoinById = (id: string): Proposal | undefined => {
  // }

  // Data consuming methods
  getProposalById = async (
    id: string,
    showError = true,
  ): Promise<Proposal | void> => {
    try {
      return this.getDataByIdAndCollections(id, [
        this.fetchedProposal,
        this.commonActiveProposals,
        this.commonHistoryProposals,
        this.commonPendingReqToJoins,
        this.commonHistoryReqToJoins,
      ]);
    } catch (err) {
      return fetchProposalById(id)
        .then((proposal: Proposal) => {
          this.fetchedProposal.set(id, proposal);
          return proposal;
        })
        .catch((error) => {
          Logger.info('getProposalById-error ~>', error, id);
          if (showError) {
            showBackendError({
              bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
            });
          }
        });
    }
  };

  //TODO
  //getCommonProposals = (

  @action
  loadCommonActiveProposals = (commonId: string, page: number) => {
    getCommonActiveProposals(commonId, page).then(
      (proposals: ProposalEntity[]) => {
        this.commonActiveProposals.clear();
        this.commonActiveProposals.merge(this.toEntityModelArr(proposals));
      },
    );
  };

  @action
  loadCommonHistoryProposals = (commonId: string, page: number) => {
    getCommonHistoryProposals(commonId, page).then(
      (proposals: ProposalEntity[]) => {
        this.commonHistoryProposals.clear();
        this.commonHistoryProposals.merge(this.toEntityModelArr(proposals));
      },
    );
  };
  @action
  loadCommonMembersPendingProposals = (commonId: string, page: number) => {
    getCommonPendingReqToJoins(commonId, page).then(
      (proposals: ProposalEntity[]) => {
        this.commonPendingReqToJoins.clear();
        this.commonPendingReqToJoins.merge(this.toEntityModelArr(proposals));
      },
    );
  };

  @action
  loadCommonMembersHistoryProposals = (commonId: string, page: number) => {
    getCommonHistoryReqToJoins(commonId, page).then(
      (proposals: ProposalEntity[]) => {
        this.commonHistoryReqToJoins.clear();
        this.commonHistoryReqToJoins.merge(this.toEntityModelArr(proposals));
      },
    );
  };

  @action
  subscribeToProposalById = (proposalId: string) =>
    onProposalChange(proposalId).subscribe({
      next: (value: any) => {
        const proposal: Proposal = this.getEntityModel(
          value.data.onProposalChange,
        );

        if (proposal.type === ProposalType.FUNDING_REQUEST) {
          this.updateFundingRequestData(proposal);
        } else if (proposal.type === ProposalType.JOIN_REQUEST) {
          this.updateRequestToJoinData(proposal);
        }
      },
      error: (err) => {
        Logger.log('Subscription Error: ', err);
      },
    });

  // OLD METHODS:
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

  getUserProposals = (
    userId: string,
    proposalFilter: IProposalFilter,
  ): Array<Proposal> => {
    try {
      return this.getDataArray
        .filter((proposal: Proposal) => {
          const isProposer = proposal?.userId === userId;
          if (isProposer) {
            return this._applyFilter(proposal, proposalFilter);
          }
          return false;
        })
        .sort(
          (proposal: Proposal, prevProposal: Proposal) =>
            (prevProposal.createdAt?.getTime() -
              proposal.createdAt?.getTime()) /
            1000,
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
            prevProposal.createdAt?.getSeconds() -
            proposal.createdAt?.getSeconds(),
        );
    } catch (error) {
      showBackendError({
        bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
      });
      return [];
    }
  };

  private updateFundingRequestData(proposal: Proposal) {
    if (this.existsInDataMap(proposal.id, this.commonHistoryProposals)) {
      this.updateDataMap(proposal, this.commonHistoryProposals);
    }
    if (this.existsInDataMap(proposal.id, this.commonActiveProposals)) {
      if (proposal.state !== ProposalState.COUNTDOWN) {
        this.commonActiveProposals.delete(proposal.id);
        this.updateDataMap(proposal, this.commonHistoryProposals);
      } else {
        this.updateDataMap(proposal, this.commonActiveProposals);
      }
    }
  }

  private updateRequestToJoinData(proposal: Proposal) {
    if (this.existsInDataMap(proposal.id, this.commonHistoryReqToJoins)) {
      this.updateDataMap(proposal, this.commonHistoryReqToJoins);
    }
    if (this.existsInDataMap(proposal.id, this.commonPendingReqToJoins)) {
      if (proposal.state !== ProposalState.COUNTDOWN) {
        this.commonPendingReqToJoins.delete(proposal.id);
        this.updateDataMap(proposal, this.commonHistoryReqToJoins);
      } else {
        this.updateDataMap(proposal, this.commonPendingReqToJoins);
      }
    }
  }

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
