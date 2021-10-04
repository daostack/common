import {ReactElement} from 'react';
import {ProposalEntity} from '~/Graphql/Proposal';
import {Proposal} from '~/Stores/Models/Proposal';
import {IProposalFilter} from '~/Stores/DataStores/ProposalStore';
import {CommonMemberType} from '~/Graphql/Common/CommonType';
import {Notification} from '~/Stores/Models/Notification';
import {UserModel} from '~/Stores/Models/UserModel';
import {UpdateCommonInfoInput} from '~/Graphql/Common';
import {Common} from '~/Stores/Models/Common';
import {Discussion} from '~/Stores/Models/Discussion';
import {CreateDiscussionInput} from '~/Graphql/Discussion';
import {
  NotificationSeenStatus,
  IProposalNotificationData,
} from '~/Graphql/Notification';
import {DiscussionMessage} from '~/Stores/Models/DiscussionMessage';
import {Message} from '~/Graphql/Message';

export type AuthStore = {
  userInfo: UserInfo;
  setIsLoading: (loading: boolean) => void;
  setSignedInUser: (newUserInfo: UserInfo) => void;
  setUserToken: (token: string | null) => void;
  isDaoMember: (members: CommonMemberType[]) => boolean;
  isProposer: (proposal: ProposalEntity) => boolean;
  isLoginInProgressExists: (uid: string) => boolean;
  isCurrentlyLogged: (userId: string) => boolean;
  onIdTokenChanged: (user: any) => void;
  onAuthStateChanged: (user: any) => void;
  getPermission: (
    commonId: string,
    userId: string,
  ) => Promise<string | undefined>;
  _processUser: () => Promise<void>;
  syncMigrationUsers: () => Promise<void>;
};

export type AppLoaderStore = {
  showLoader: () => void;
  hideLoader: () => void;
  isLoading: boolean;
};

export type BottomSheetStore = {
  showBottomSheet: (template: any, value: any) => void;
  hideBottomSheet: () => void;
  topSnap: number;
  template: ReactElement;
  increaseTopSnap: () => void;
  decreaseTopSnap: () => void;
};

export type CommonStore = {
  loadMyCommons: () => Promise<void>;
  loadPendingCommons: () => Promise<void>;
  myCommonsValues: Common[];
  pendingCommonsValues: Common[];
  featuredCommonsValues: Common[];
  loadFeaturedCommons: (page: number) => Promise<void>;
  getCommonById: (id: string) => Common;
  updateCommonInfo: (
    updateCommonInfo: UpdateCommonInfoInput,
  ) => Promise<Common>;
};

export type DiscussionStore = {
  commonDiscussions: Discussion[];
  proposalDiscussionsArray: Discussion[];
  getDiscussionById: (id: string) => Promise<Discussion | undefined>;
  getIsExpanded: (discussionId: string) => boolean;
  createCommonDiscussion: (discussion: CreateDiscussionInput) => Promise<void>;
  loadCommonDiscussions: (commonId: string, page: number) => Promise<void>;
  getProposalDiscussionById: (id: string) => Promise<Discussion | undefined>;
};

export type DiscussionMessageStore = {
  getProposalMessages: DiscussionMessage[];
  getDiscussionMessages: DiscussionMessage[];
  loadDiscussionMessages: (discussionMessages: DiscussionMessage[]) => void;
  getDiscussionMessagesByDiscussionId: (
    discussionId: string,
  ) => DiscussionMessage | undefined;
  getDiscussionMessageById: (id: string) => Promise<DiscussionMessage | undefined>;
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

export type NotificationStore = {
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
    message: DiscussionMessage,
  ) => Promise<Discussion | Proposal>;
};

export type UserStore = {
  getUserById: (uid: string) => UserModel;
  getGraphqlUserById: (uid: string) => Promise<UserModel | void>;
  getCommonUsersByMembersArray: (
    members: CommonMemberType[],
  ) => UserModel[] | undefined;
};

export type ProposalStore = {
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

export type RootStore = {
  uiStore: UiStore;
  authStore: AuthStore;
  notificationStore: NotificationStore;
  commonStore: CommonStore;
  discussionMessageStore: DiscussionMessageStore;
  discussionStore: DiscussionStore;
  userStore: UserStore;
  proposalStore: ProposalStore;
};
// TODO: Add all Store types
export type AppRootStore = {rootStore: RootStore};
