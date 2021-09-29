import {INotificationEntity} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {IFirebaseSnapshot} from '~/Firebase/types';

export type commonNotificationListLoadCallbackFn = (
  updatedNotificationList: IFirebaseSnapshot<INotificationEntity>,
) => void;
