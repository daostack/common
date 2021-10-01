import {ReactElement} from 'react';
import {CommonMemberType} from '~/Graphql/Common/CommonType';
import {Discussion} from '~/Graphql/Discussion';
import {DiscussionMessage} from '~/Stores/Models/DiscussionMessage';;
import {Common, UpdateCommonInfoInput} from '~/Graphql/Common';

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

export type discussionMessageStore = {
  getDiscussionMessageById: (
    discussionId: string,
  ) => Promise<DiscussionMessage | undefined>;
  loadDiscussionMessages: (discussionMessages: DiscussionMessage[]) => void;
  loadProposalMessages: (proposalMessages: DiscussionMessage[]) => void;
};

export type commonStore = {
  getCommonById: (id: string) => Common;
  updateCommonInfo: (
    updateCommonInfo: UpdateCommonInfoInput,
  ) => Promise<Common>;
};

export type proposalStore = {
  getProposalById: () => void;
  getCommonProposals: () => void;
  getUserProposals: () => void;
  getCommonActiveProposals: () => void;
  getCommonHistoryProposals: () => void;
  getCommonPendingReqToJoins: () => void;
  getCommonHistoryReqToJoins: () => void;
};

export type rootStore = {
  uiStore: UiStore;
  authStore: AuthStore;
  discussionMessageStore: discussionMessageStore;
  commonStore: commonStore;
  proposalStore: proposalStore;
};
// TODO: Add all Store types
export type AppRootStore = {
  rootStore: rootStore;
};
