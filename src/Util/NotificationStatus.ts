import {NotificationSeenStatus} from '~/Graphql/Notification/NotificationType';

export function getNotificationSeenStatus(
  status: NotificationSeenStatus,
): boolean {
  switch (status) {
    case NotificationSeenStatus.NotSeen:
      return false;
    case NotificationSeenStatus.Seen:
      return true;
    default:
      return true;
  }
}
