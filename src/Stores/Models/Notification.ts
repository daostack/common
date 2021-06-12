import {observable} from 'mobx';
import {INotificationEntity} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {BaseModel} from './BaseModel';

export interface NotificationItemState {
  seen: boolean;
  opened: boolean;
}

export class Notification extends BaseModel<INotificationEntity> {
  @observable
  id: string;

  @observable
  commonId: string;

  @observable
  proposalId: string;

  @observable
  discussionId: string;

  @observable
  show: boolean;

  @observable
  type: string;

  @observable
  notificationItemState: NotificationItemState;

  constructor(
    newNotificationInfo: INotificationEntity,
    notificationItemState: NotificationItemState,
  ) {
    super(newNotificationInfo);
    this.id = newNotificationInfo.id;
    this.commonId = newNotificationInfo.commonId;
    this.proposalId = newNotificationInfo.proposalId;
    this.discussionId = newNotificationInfo.discussionId;
    this.type = newNotificationInfo.type;
    this.show = newNotificationInfo.show;
    this.notificationItemState = notificationItemState;
  }
}
