import {IFirebaseSnapshot} from '~/Firebase/types';
import {NotificationsCollection} from '~/Firebase/Databasee/Collections/NotificationsCollection';
import {
  INotificationEntity,
  EventTypesOnNotificationList,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';

export type commonNotificationListLoadCallbackFn = (
  updatedNotificationList: IFirebaseSnapshot<INotificationEntity>,
) => void;

export const subscribeToUserNotifications = (
  userId: string,
  listChangeCallback: commonNotificationListLoadCallbackFn,
) => {
  let unsubscribe = null;
  if (userId) {
    NotificationsCollection.orderBy('createdAt', 'desc')
      .where('userFilter', 'array-contains', userId)
      .where('eventType', 'in', EventTypesOnNotificationList)
      .onSnapshot((snapshot: any) => {
        listChangeCallback(snapshot);
      });
  }
  return unsubscribe;
};
