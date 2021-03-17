import BaseStore from './BaseStore';
import {subscribeToUserNotifications} from '~/Services/ListServices/NotificationListService';
import {
  FirestoreUnsubscribeFn,
  IFirebaseDoc,
  IFirebaseSnapshot,
} from '~/Firebase/types';
import RootStore from '../RootStore';
import {INotificationEntity} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {Notification} from '../Models/Notification';
import {IBaseEntity} from '~/Firebase/Databasee/EntityTypes/IBaseEntity';
import {action, observable} from 'mobx';
import {persist} from 'mobx-persist';

export default class NotificationStore extends BaseStore<
  Notification,
  INotificationEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  @persist('list', String)
  @observable
  notificationsRead: string[] = observable.array([]);

  @persist('list', String)
  @observable
  notificationsClicked: string[] = observable.array([]);

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

  @action
  addNotificationRead = (notificationId: string) => {
    console.log('PRUEBAAA notificationsRead', this.notificationsRead);
    if (!this.notificationsRead.includes(notificationId)) {
      console.log('PRUEBAAA Adding read', notificationId);
      this.notificationsRead.push(notificationId);
    }
  };

  @action
  addNotificationClicked = (notificationId: string) => {
    console.log('PRUEBAAA addNotificationClicked', this.notificationsClicked);
    if (!this.notificationsClicked.includes(notificationId)) {
      console.log('PRUEBAAA Adding Click', notificationId);
      this.notificationsClicked.push(notificationId);
    }
  };

  //Actions
  subscribeToLoggedUserNotifications = (): FirestoreUnsubscribeFn | null =>
    this.rootStore.authStore.signedInUser
      ? subscribeToUserNotifications(
          this.rootStore.authStore.signedInUser,
          this.updateNotificationStore,
        )
      : null;

  updateNotificationStore = (
    updatedSnapshot: IFirebaseSnapshot<IBaseEntity> | IFirebaseDoc<IBaseEntity>,
  ) => {
    this.updateStoreData(updatedSnapshot);
    this.rootStore.uiStore.checkNotificationsUnRead();
  };

  @action
  deleteUserNotifications = () => {
    this.data = observable.map({});
    this.notificationsRead = [];
    this.notificationsClicked = [];
  };

  // Overriden methods
  getEntityModel(entity: INotificationEntity): Notification {
    return new Notification(entity, this.rootStore);
  }
}
