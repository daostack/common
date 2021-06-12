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
  SubscribeToNotifications,
  //NotificationsWhereInput,
} from '~/Graphql/Notifications';
import {apollo} from '~/Util/helpers/apolloHelper';
import {Notification} from '../../Stores/Models/Notification';
import {getGQLErrorObject} from '~/Util';

export type commonNotificationListLoadCallbackFn = (
  updatedNotificationList: IFirebaseSnapshot<INotificationEntity>,
) => void;

export const fetchNotifications = async (
): Promise<Notification[] | []> => {
  try {
    const {data} = await apollo.query({
      query: GetUserNotifications,
    });
    if (data.user.notifications) {
    return  data.user.notifications.map((notification: any) => new Notification(notification, notification.seenStatus));//  //new Notification(data.notifications, data.notifications?.seenStatus);
    }
    return [];
  } catch (err) {
    logger.log(
      'tkt Error while trying to getting notifications: ',
      getGQLErrorObject(err)
    );
    throw err;
  }
};

export const newNotification = async (): Promise<any> => {
  //useSubscription(SubscribeToNotifications)
  //SubscribeToNotifications
  ///return await apollo.query({
  //    query: SubscribeToNotifications,
  //  });


  /*try {
    const {data} = await apollo.query({
      query: SubscribeToNotifications,
    });
    console.log('tkt fetchNotifications', data)
    if (data.notifications) {
    return  data.notifications.map((notification: any) => new Notification(notification, notification.seenStatus));//  //new Notification(data.notifications, data.notifications?.seenStatus);
    }
    return [];
  } catch (err) {
    logger.log(
      'tkt Error while trying to getting notifications: ',
      getGQLErrorObject(err)
    );
    throw err;
  }*/
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
