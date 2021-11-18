import {Document} from 'firestorter';
import {Timestamp} from '~/Firebase';
import {INotificationEntity} from '~/Types/EntityTypes/INotificationEntity';
import {getProposalById} from './Proposal';

export interface NotificationItemState {
  seen: boolean;
  opened: boolean;
}

export class Notification
  extends Document<INotificationEntity>
  implements NotificationItemState {
  seen = false;
  opened = false;

  get id() {
    return this.data.id;
  }

  get _createdAt() {
    return (this.data.createdAt as unknown) as Timestamp;
  }

  get createdAt() {
    return this._createdAt.toDate();
  }

  get eventObjectId() {
    return this.data.eventObjectId;
  }

  get eventType() {
    return this.data.eventType;
  }

  get userFilter() {
    return this.data.userFilter;
  }
}
