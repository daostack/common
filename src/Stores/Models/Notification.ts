import {makeAutoObservable} from 'mobx';
import {firebase} from '~/Firebase';
import {INotificationEntity} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';

export interface NotificationItemState {
  seen: boolean;
  opened: boolean;
}

export class Notification implements INotificationEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  eventObjectId: string;
  eventType: string;
  userFilter: Array<string>;
  notificationItemState: NotificationItemState;

  constructor(
    newNotificationInfo: INotificationEntity,
    notificationItemState: NotificationItemState,
  ) {
    this.id = newNotificationInfo.id;
    this.eventObjectId = newNotificationInfo.eventObjectId;
    this.eventType = newNotificationInfo.eventType;
    this.userFilter = newNotificationInfo.userFilter;
    this.notificationItemState = notificationItemState;
    makeAutoObservable(this);
  }
}
