import {IFirebaseSnapshot} from '~/Firebase/types';
import {NotificationsCollection} from '~/Firebase/Databasee/Collections/NotificationsCollection';
import {
  INotificationEntity,
  EventTypesOnNotificationList,
  EventTypesOnNotificationList1,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import logger from '~/Services/Logger';
import {
  GetUserNotifications,
  //NotificationsWhereInput,
} from '~/Graphql/Notifications';
import {apollo} from '~/Util/helpers/apolloHelper';
import {Notification} from '../../Stores/Models/Notification';

export type commonNotificationListLoadCallbackFn = (
  updatedNotificationList: IFirebaseSnapshot<INotificationEntity>,
) => void;

export const fetchNotifications = async (
//notificationsWhere: NotificationsWhereInput,
): Promise<Notification> => {
  //console.log('NOTIFICATION WHERE -> ', notificationsWhere);
  try {
    const {data} = await apollo.query({
      query: GetUserNotifications,
      /*variables: {
        where: notificationsWhere,
      },*/
    });

    return new Notification(data.notifications, data.notifications.seenStatus);
  } catch (err) {
    logger.log(
      'Error while trying to get proposals: ',
      /*getGQLErrorObject(*/
      err,
      /*)*/
    );
    throw err;
  }
};

//FIREBASE CODE to remove -> used in NotificationStore
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
