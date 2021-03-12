import BaseStore from './BaseStore';
import {subscribeToUserNotifications} from '~/Services/ListServices/NotificationListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {INotificationEntity} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {Notification} from '../Models/Notification';
import {action, observable} from 'mobx';

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
