import {gql} from '@apollo/client';
import * as Apollo from '@apollo/client';
import {
  Scalars,
  //Maybe,
  //Exact,
  //User,
  //Discussion,
  //Link,
  //Rule,
  //Proposal,
  //ProposalState,
  //ProposalType,
  //Pagination,
} from '~/Graphql';
import {EventType} from '../Events';

/** The notification type */
export type Notification = {
  __typename?: 'Notification';
  id: Scalars['ID'];
  eventId: Scalars['ID'];
  eventObjectId: Scalars['ID'];
  eventType: EventType;
  userFilter?: Array<string>;
};

/*export type Subscription = {
  notificationPushed(eventType: string!): Notification
};*/

/*export type NotificationsWhereInput = {
  userId: Scalars['ID'];
};

export type GetUserNotificationsQueryVariables = Exact<{
  where: NotificationsWhereInput;
}>;*/


/*
 proposal {
          id
        }
        discussion {
          id
          topic
        }
        common {
          id
        }
 */


export const GetUserNotifications = gql`
  query getUserNotifications {
    user {
      displayName
      photo
      notifications (orderBy: {createdAt: asc}) {
        id
        createdAt
        updatedAt
        show
        type
        seenStatus
        common {
          id
          name
        }
        commonId
        proposalId
        discussionId
      }
    }
  }
`;

export const SubscribeToNotifications = gql`
  subscription subscribeToNotification {
    notificationCreated {
      type,
      seenStatus,
      user {
        firstName
      }
    }
  }
`;





