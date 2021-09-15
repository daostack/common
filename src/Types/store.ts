import {ReactElement} from 'react';
import {CommonMemberType} from '~/Graphql/Common/CommonType';
import {ObservableMap} from 'mobx';
import {Notification} from '~/Stores/Models/Notification';
import {UserModel} from '~/Stores/Models/UserModel';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import {UpdateCommonInfoInput} from '~/Graphql/Common';
import {Common} from '~/Stores/Models/Common';
import {Discussion} from '~/Stores/Models/Discussion';
import {Proposal} from '~/Stores/Models/Proposal';
import {
  NotificationSeenStatus,
  IProposalNotificationData,
} from '~/Graphql/Notification';
import ProposalStore from '~/Stores/DataStores/ProposalStore';

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

export type NotificationStore = {
  notifications: ObservableMap<string, Notification>;
  myNotificationsValues: Notification[];
  hasNewNotifications: boolean;
  setNotificationItemState: (
    notificationId: string,
    newState: NotificationSeenStatus,
  ) => void;
  removeSeenStateForNewNotifications: () => void;
  addWelcomeNotification: () => void;
  deleteUserNotifications: () => void;
  loadNotifications: (page?: number) => Promise<void>;
  getNotificationById: (id: string) => Promise<Notification>;
  getProposalNotificationData: (
    eventObjectId: string,
  ) => Promise<IProposalNotificationData | null>;
  getParentDiscussion: (
    message: IDiscussionMessageEntity,
  ) => Promise<Discussion | Proposal>;
};

export type CommonStore = {
  subscribeToAllCommons: () => void;
  getCommonById: (id: string) => Common;
  updateCommonInfo: (
    updateCommonInfo: UpdateCommonInfoInput,
  ) => Promise<Common>;
};

export type UserStore = {
  getUserById: (uid: string) => UserModel;
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

export type RootStore = {
  uiStore: UiStore;
  authStore: AuthStore;
  notificationStore: NotificationStore;
  commonStore: CommonStore;
  discussionMessageStore: any;
  discussionStore: any;
  userStore: UserStore;
  proposalStore: ProposalStore;
};
// TODO: Add all Store types
export type AppRootStore = {rootStore: RootStore};
