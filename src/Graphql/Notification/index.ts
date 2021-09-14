import {gql} from '@apollo/client';
export * from './NotificationType';

const gqlNotificationProps = `
  id
  createdAt
  updatedAt
  show
  eventType: type
  seenStatus
  userId
  commonId
  proposalId
  discussionId
`;

export const GetNotificationsDocument = gql`
  query GetNotifications($paginate: PaginateInput!) {
    notifications(paginate: $paginate) {
      ${gqlNotificationProps}
    }
  }
`;

export const GetNotificationsByIdDocument = gql`
  query GetNotificationById($where: NotificationWhereUniqueInput!) {
    notification(where: $where) {
      ${gqlNotificationProps}
    }
  }
`;

export const ChangeOpenedNotificationStatusDocument = gql`
mutation ChangeOpenedNotificationStatus($input: UpdateOpenedNotificationStatusInput!) {
  changeOpenedNotificationStatus(input: $input) {
      ${gqlNotificationProps}
    }
  }
`;

export const MarkAsSeenNotificationsDocument = gql`
  mutation MarkAsSeenNotifications($input: EntitiesIds!) {
    markAsSeenNotifications(input: $input)
  }
`;
