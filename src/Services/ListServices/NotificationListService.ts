import {IFirebaseSnapshot} from '~/Firebase/types';
import {NotificationsCollection} from '~/Firebase/Databasee/Collections/NotificationsCollection';
import {
  INotificationEntity,
  EventTypesOnNotificationList,
  EventTypesOnNotificationList1,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';

export type commonNotificationListLoadCallbackFn = (
  updatedNotificationList: IFirebaseSnapshot<INotificationEntity>,
) => void;

export const subscribeToUserNotifications = (
  userId: string,
  listChangeCallback: commonNotificationListLoadCallbackFn,
) => {
  if (!userId) {
    throw Error(
      'subscribeToUserNotifications method has required userId parameter',
    );
  }

  const batch1 = NotificationsCollection.orderBy('createdAt', 'desc')
    .where('userFilter', 'array-contains', userId)
    .where('eventType', 'in', EventTypesOnNotificationList)
    .limit(20)
    .onSnapshot((snapshot: any) => {
      listChangeCallback(snapshot);
    });

  const batch2 = NotificationsCollection.orderBy('createdAt', 'desc')
    .where('userFilter', 'array-contains', userId)
    .where('eventType', 'in', EventTypesOnNotificationList1)
    .limit(20)
    .onSnapshot((snapshot: any) => {
      listChangeCallback(snapshot);
    });

  return [batch1, batch2];
};
