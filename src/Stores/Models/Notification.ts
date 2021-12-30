import {makeObservable, observable} from 'mobx';
import {INotificationEntity} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {BaseModel} from './BaseModel';

export interface NotificationItemState {
  seen: boolean;
  opened: boolean;
}

export class Notification extends BaseModel<INotificationEntity> {
  @observable
  eventObjectId: string;

  @observable
  eventType: string;

  @observable
  userFilter: Array<string>;

  @observable
  notificationItemState: NotificationItemState;

  constructor(
    newNotificationInfo: INotificationEntity,
    notificationItemState: NotificationItemState,
  ) {
    super(newNotificationInfo);

    this.id = newNotificationInfo.id;
    this.eventObjectId = newNotificationInfo.eventObjectId;
    this.eventType = newNotificationInfo.eventType;
    this.userFilter = newNotificationInfo.userFilter;
    this.notificationItemState = notificationItemState;
    makeObservable(this);
  }
}
