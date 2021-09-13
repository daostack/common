import {IFirebaseSnapshot} from '~/Firebase/types';
import {NotificationsCollection} from '~/Firebase/Databasee/Collections/NotificationsCollection';
import {
  GetNotificationsDocument,
  GetNotificationsByIdDocument,
  ChangeOpenedNotificationStatusDocument,
  MarkAsSeenNotificationsDocument,
  NotificationType,
  NotificationSeenStatus,
} from '~/Graphql/Notification';
import {getGQLErrorObject} from '~/Util';
import {apollo} from '~/Util/helpers/apolloHelper';
import logger from '~/Services/Logger';
import {Notification} from '~/Stores/Models/Notification';
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

export const fetchNotifications = async (page = 0): Promise<Notification[]> => {
  try {
    const {data} = await apollo.query({
      query: GetNotificationsDocument,
      variables: {
        paginate: {
          skip: page * 10,
          take: 10,
        },
      },
      fetchPolicy: 'no-cache',
    });

    return (
      data?.notifications.map(
        (item: NotificationType) => new Notification(item),
      ) ?? []
    );
  } catch (err) {
    logger.log(
      'Error while trying to get user notifications: ',
      getGQLErrorObject(err),
    );
    return [];
  }
};

export const fetchNotificationById = async (
  id: string,
): Promise<Notification | undefined> => {
  try {
    const {data} = await apollo.query({
      query: GetNotificationsByIdDocument,
      variables: {
        where: {
          id,
        },
      },
    });

    return new Notification(data.notification);
  } catch (err) {
    logger.log(
      `Error while trying to get user notification by id: ${id}`,
      getGQLErrorObject(err),
    );
  }
};

export const changeNotificationSeenStatus = async (
  id: string,
  seenStatus: NotificationSeenStatus,
): Promise<Notification | undefined> => {
  try {
    const {data} = await apollo.mutate({
      mutation: ChangeOpenedNotificationStatusDocument,
      variables: {
        input: {
          id,
          seenStatus,
        },
      },
    });

    return new Notification(data.notification);
  } catch (err) {
    logger.log(
      `Error while trying to change notification seen status by id: ${id}`,
      getGQLErrorObject(err),
    );
  }
};

export const markAsSeenNotifications = async (ids: string[]): Promise<void> => {
  try {
    await apollo.mutate({
      mutation: MarkAsSeenNotificationsDocument,
      variables: {
        input: {
          ids,
        },
      },
    });
  } catch (err) {
    logger.log(
      `Error while trying to mark as seen notifications with ids: ${ids}`,
      getGQLErrorObject(err),
    );
  }
};
