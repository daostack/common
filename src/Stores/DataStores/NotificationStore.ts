import BaseStore from './BaseStore';
import {subscribeToUserNotifications} from '~/Services/ListServices/NotificationListService';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import RootStore from '../RootStore';
import {INotificationEntity} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {Notification, NotificationItemState} from '../Models/Notification';
import {IBaseEntity} from '~/Firebase/Databasee/EntityTypes/IBaseEntity';
import {action, computed, observable} from 'mobx';
import Logger from '~/Services/Logger';

export default class NotificationStore extends BaseStore<
  Notification,
  INotificationEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  // Data consuming methods
  getNotificationById = (id: string): Notification | undefined =>
    this.getDataById(id);

  getLoggedUserNotifications = (): Array<Notification> | undefined =>
    this.getDataArray
      ?.filter(
        (notification: Notification) =>
          notification.notificationItemData?.missingData === false,
      )
      .sort(
        (notification: Notification, prevNotification: Notification) =>
          prevNotification.createdAt?.seconds - notification.createdAt?.seconds,
      );

  @computed
  get hasNewNotifications() {
    return (
      (this.getLoggedUserNotifications()?.filter(
        (notification: Notification) =>
          notification.notificationItemState?.seen === false,
      )?.length || 0) > 0
    );
  }

  @action
  setNotificationItemState = (
    notificationId: string,
    newState: Partial<NotificationItemState>,
  ) => {
    const currentNotification = this.getNotificationById(notificationId);
    if (currentNotification) {
      currentNotification.notificationItemState = {
        seen: newState.seen || currentNotification.notificationItemState.seen,
        opened:
          newState.opened || currentNotification.notificationItemState.opened,
      };
    }
    Logger.warn(
      'Not found notification while trying to update notifciationItemState',
      notificationId,
    );
  };

  @action
  removeSeenStateForNewNotifications = () => {
    const newNotificationsList = this.getLoggedUserNotifications()?.filter(
      (notification: Notification) =>
        notification.notificationItemState?.seen === false,
    );
    newNotificationsList?.forEach((notificationItem: Notification) => {
      notificationItem.notificationItemState = {
        seen: true,
        opened: notificationItem.notificationItemState.opened,
      };
    });
  };

  //Actions
  subscribeToLoggedUserNotifications = (): FirestoreUnsubscribeFn | null =>
    this.rootStore.authStore.signedInUser
      ? subscribeToUserNotifications(
          this.rootStore.authStore.signedInUser,
          this.updateStoreData,
        )
      : null;

  @action
  deleteUserNotifications = () => {
    this.data = observable.map({});
  };

  // Overriden methods
  getEntityModel(entity: INotificationEntity): Notification {
    return new Notification(entity, this.rootStore);
  }
}
