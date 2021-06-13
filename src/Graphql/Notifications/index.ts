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


export const GetUserNotifications = gql`
  query getUserNotifications {
    user {
      displayName
      photo
      notifications (orderBy: {createdAt: desc}) {
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

// we don't have a notificationCreated endpoint, so this will not work
// we also don't have event creating, which was in charge of creating notifications
export const SubscribeToNotifications = gql`
  subscription subscribeToNotification($type: String!) {
    notificationCreated {
      type,
      seenStatus,
      user {
        firstName
      }
    }
  }
`;





