import {observable} from 'mobx';
import {
  NotificationType,
  NotificationSeenStatus,
} from '~/Graphql/Notification/NotificationType';
import {getNotificationSeenStatus} from '~/Util/NotificationStatus';
import {BaseModel} from './BaseModel';

export interface NotificationItemState {
  seen: boolean;
  opened: boolean;
}

export class Notification extends BaseModel<NotificationType> {
  @observable
  id: string;

  @observable
  eventObjectId: string;

  @observable
  eventType: string;

  @observable
  notificationItemState: NotificationItemState;

  constructor(newNotificationInfo: NotificationType) {
    super(newNotificationInfo);
    this.id = newNotificationInfo.id;
    this.createdAt = newNotificationInfo.createdAt;
    this.updatedAt = newNotificationInfo.updatedAt;
    this.eventObjectId = (newNotificationInfo.discussionId ||
      newNotificationInfo.proposalId ||
      newNotificationInfo.commonId) as string;
    this.eventType = newNotificationInfo.eventType;
    this.notificationItemState = {
      opened: NotificationSeenStatus.Done === newNotificationInfo.seenStatus,
      seen: getNotificationSeenStatus(newNotificationInfo.seenStatus),
    };
  }
}
