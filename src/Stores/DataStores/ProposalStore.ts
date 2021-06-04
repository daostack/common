import {action, computed, observable, ObservableMap} from 'mobx';
import BaseStore from './BaseStore';
import {
  getCommonActiveProposals,
  getCommonHistoryProposals,
} from '~/Services/ListServices/ProposalListService';
import RootStore from '../RootStore';
import {Proposal} from '../Models/Proposal';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {PROPOSAL_TYPE, PROPOSAL_STAGE} from '~/Config';
import {
  PROPOSAL_STAGES_ACTIVE,
  PROPOSAL_STAGES_HISTORY,
} from '~/Services/ListServices/ProposalListService';
import {ACTIVE_PAYMENT_STATES} from '~/Util/constants';

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

  @observable
  private commonActiveProposals: ObservableMap<string, Proposal> = observable.map({});;

  @observable
  private commonHistoryProposals: ObservableMap<string, Proposal> = observable.map({});;

  @observable
  private commonPendingReqToJoins: ObservableMap<string, Proposal> = observable.map({});;

  @observable
  private commonHistoryReqToJoins: ObservableMap<string, Proposal> = observable.map({});;

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

  // @computed
  // get myActiveProposals() {
  //   if (this.isLoading || !this.rootStore.authStore.userInfo?.uid) {
  //     return [];
  //   }
  //   return this.getUserProposals(this.rootStore.authStore.userInfo?.uid, {
  //     type: PROPOSAL_TYPE.FundingRequest,
  //     stage: PROPOSAL_STAGE.Active,
  //   });
  // }

  // @computed
  // get myActiveMembershipRequests() {
  //   if (this.isLoading || !this.rootStore.authStore.userInfo?.uid) {
  //     return [];
  //   }
  //   return this.getUserProposals(this.rootStore.authStore.userInfo?.uid, {
  //     type: PROPOSAL_TYPE.Join,
  //     stage: PROPOSAL_STAGE.Active,
  //   });
  // }

  // Overriden methods
  getEntityModel(entity: IProposalEntity): Proposal {
    return new Proposal(entity);
  }

  // TODO
  // getRequestToJoinById = (id: string): Proposal | undefined => {
  // }

  // Data consuming methods
  getProposalById = (id: string): Proposal | undefined => {
    try {
      return this.getDataByIdAndCollections(id, [this.commonActiveProposals, this.commonHistoryProposals]);
    } catch (errr) {
      console.log("THROW ERROR ->", errr);
      // fetchProposalById(id)
      // TODO: consider adding direct fetch from gql by id in order to confirm missing data
      return undefined;
    }
  };

  //TODO
  //getUserProposals = (

  //TODO
  //getCommonProposals = (


  @action
  loadCommonActiveProposals = (commonId: string) => {
    getCommonActiveProposals(commonId).then((proposals: IProposalEntity[]) => {
      console.log("LOADED ACTIVE PROPOSALS -> ", proposals);
      this.commonActiveProposals.clear();
      this.commonActiveProposals.merge(this.toEntityModelArr(proposals));
    });
  }

  @action
  loadCommonHistoryProposals = (commonId: string) => {
    getCommonHistoryProposals(commonId).then((proposals: IProposalEntity[]) => {
      console.log("LOADED HISTORY PROPOSALS -> ", proposals);
      this.commonHistoryProposals.clear();
      this.commonHistoryProposals.merge(this.toEntityModelArr(proposals));
    });
  }

}
