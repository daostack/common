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
  type: EventType;
  commonId: Scalars['ID'];
  proposalId: Scalars['ID'];
  discussionId: Scalars['ID'];
  userFilter?: Array<string>; //todo rm
};


const gqlNotificationProps = `
  id
  createdAt
  updatedAt
  show
  type
  seenStatus
  commonId
  proposalId
  discussionId
`;



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
        commonId
        proposalId
        discussionId
      }
    }
  }
`;

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

export const onNotificationCreated = gql`
  subscription ($userId: ID!) {
    notificationCreated(userId: $userId) {
      ${gqlNotificationProps}
    }
  }
`;



