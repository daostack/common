import {ReactElement} from 'react';
import {ProposalEntity} from '~/Graphql/Proposal';
import {Proposal} from '~/Stores/Models/Proposal';
import {IProposalFilter} from '~/Stores/DataStores/ProposalStore';
import {CommonMemberType} from '~/Graphql/Common/CommonType';

export type BottomSheetStore = {
  showBottomSheet: (template: any, value: any) => void;
  hideBottomSheet: () => void;
  topSnap: number;
  template: ReactElement;
  increaseTopSnap: () => void;
  decreaseTopSnap: () => void;
};

export type AppLoaderStore = {
  showLoader: () => void;
  hideLoader: () => void;
  isLoading: boolean;
};

export type UiStore = {
  bottomSheetStore: BottomSheetStore;
  appLoaderStore: AppLoaderStore;
  conversionRate: number;
};

export type UserInfo = {
  uid?: string;
  photoURL?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  intro?: string;
  country?: string;
};

export type AuthStore = {
  userInfo: UserInfo;
  setIsLoading: (loading: boolean) => void;
  setSignedInUser: (newUserInfo: UserInfo) => void;
  isDaoMember: (members: CommonMemberType[]) => boolean;
};

export type ProposalStore = {
  getCommonActiveProposals: Proposal[];
  getCommonHistoryProposals: Proposal[];
  getCommonPendingReqToJoins: Proposal[];
  getCommonHistoryReqToJoins: Proposal[];
  getEntityModel: (entity: ProposalEntity) => Proposal;
  getProposalById: (id: string) => Promise<Proposal | undefined>;
  loadCommonActiveProposals: (commonId: string, page: number) => void;
  loadCommonHistoryProposals: (commonId: string, page: number) => void;
  loadCommonMembersPendingProposals: (commonId: string, page: number) => void;
  loadCommonMembersHistoryProposals: (commonId: string, page: number) => void;
  subscribeToProposalById: (proposalId: string) => void;
  myActiveProposals: Proposal[];
  myActiveMembershipRequests: Proposal[];
  getUserProposals: (
    userId: string,
    proposalFilter: IProposalFilter,
  ) => Proposal[];
  getCommonProposals: (
    commonId: string,
    proposalFilter: IProposalFilter,
  ) => Proposal[];
};

export type rootStore = {
  uiStore: UiStore;
  authStore: AuthStore;
  proposalStore: ProposalStore;
};
// TODO: Add all Store types
export type AppRootStore = {rootStore: rootStore};
