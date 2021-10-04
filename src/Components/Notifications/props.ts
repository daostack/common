import {RootStore} from '~/Types/store';
import {Notification} from '~/Stores/Models/Notification';

export interface NotificationProps {
  item: Notification;
  rootStore: RootStore;
}
