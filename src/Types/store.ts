import {ReactElement} from 'react';
import {CommonMemberType} from '~/Graphql/Common/CommonType';
import {ObservableMap} from 'mobx';
import {
  Notification,
  NotificationItemState,
} from '~/Stores/Models/Notification';

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
  loggedUserNotifications: Notification[] | undefined;
  setNotificationItemState: (
    notificationId: string,
    newState: Partial<NotificationItemState>,
  ) => void;
  removeSeenStateForNewNotifications: () => void;
  addWelcomeNotification: () => void;
  deleteUserNotifications: () => void;
  loadNotifications: (page?: number) => Promise<void>;
  getNotificationById: (id: string) => Promise<Notification>;
};

export type rootStore = {
  uiStore: UiStore;
  authStore: AuthStore;
  notificationStore: NotificationStore;
};
// TODO: Add all Store types
export type AppRootStore = {rootStore: rootStore};
