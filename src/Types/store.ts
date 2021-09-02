import {ReactElement} from 'react';
import {CommonMemberType} from '~/Graphql/Common/CommonType';
import {Discussion} from '~/Graphql/Discussion';
import {Message} from '~/Graphql/Message';
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
  subscribeToDiscussionsMessages: (discussionIds: Array<string>) => Array<Discussion>;
  getDiscussionMessagesByDiscussionId: (discussionId: string) => Array<Message> | undefined;
  getDiscussionMessageById: (discussionId: string) => Message | undefined;
  proposalDiscussionId: string,
};

export type commonStore = {
  subscribeToAllCommons: () => void
  getCommonById: (id: string) => Common;
  updateCommonInfo: (updateCommonInfo: UpdateCommonInfoInput) => Promise<Common>;
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
