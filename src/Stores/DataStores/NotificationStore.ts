import BaseStore from './BaseStore';
import {subscribeToUserNotifications} from '~/Services/ListServices/NotificationListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {INotificationEntity} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {Notification} from '../Models/Notification';

export default class NotificationStore extends BaseStore<
  Notification,
  INotificationEntity
> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  getUserNotifications = (userId: string): Array<Notification> | undefined =>
    this.getDataArray?.filter((notification: Notification) => true);
  //Actions
  subscribeToUserNotifications = (userId: string): FirestoreUnsubscribeFn =>
    subscribeToUserNotifications(userId, this.updateStoreData);

  // Overriden methods
  getEntityModel(entity: INotificationEntity): Notification {
    return new Notification(entity, this.rootStore);
  }
}
