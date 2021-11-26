import {ReactElement} from 'react';
import {
  ICommonMember,
  ICommonEntity,
} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {Common} from '~/Stores/Models/Common';
import {UserModel} from '~/Stores/Models/UserModel';
import {Discussion} from '~/Stores/Models/Discussion';

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
  isDaoMember: (members: ICommonMember[]) => boolean;
  getPermission: (commonId: string, userId: string | undefined) => boolean;
};

export type CommonStore = {
  isLoading: boolean;
  myCommons: Common[];
  pendingCommons: Common[];
  featuredCommons: Common[];
  getEntityModel: (entity: ICommonEntity) => Common;
  getCommonById: (id: string) => Common;
  getUserCommons: (userId: string) => Common[];
};

export type DiscussionStore = {
  getDiscussionById: (id: string) => Discussion | undefined;
};

export type DiscussionMessageStore = {
  subscribeToProposalDiscussionMessages: (
    proposalId: string,
  ) => FirestoreUnsubscribeFn;
};

export type UserStore = {
  getUserById: (uid: string) => UserModel | undefined;
};

export type RootStore = {
  uiStore: UiStore;
  authStore: AuthStore;
  commonStore: CommonStore;
  discussionStore: DiscussionStore;
  discussionMessageStore: DiscussionMessageStore;
  userStore: UserStore;
};
// TODO: Add all Store types
export type AppRootStore = {rootStore: RootStore};
