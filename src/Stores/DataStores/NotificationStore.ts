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
  subscribeToUserNotifications = (userId: string): FirestoreUnsubscribeFn =>
    subscribeToUserNotifications(userId, this.updateNotificationStore);

  updateNotificationStore = (
    updatedSnapshot: IFirebaseSnapshot<IBaseEntity> | IFirebaseDoc<IBaseEntity>,
  ) => {
    this.updateStoreData(updatedSnapshot);

    // console.log('entra');
    this.rootStore.uiStore.checkNotificationsUnRead();
  };

  // Overriden methods
  getEntityModel(entity: INotificationEntity): Notification {
    return new Notification(entity, this.rootStore);
  }
}
