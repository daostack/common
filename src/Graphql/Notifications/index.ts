import {gql} from '@apollo/client';
import * as Apollo from '@apollo/client';
import {
  Scalars,
  Maybe,
  Exact,
  User,
  Discussion,
  Link,
  Rule,
  Proposal,
  ProposalState,
  ProposalType,
  Pagination,
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
}

export type NotificationsWhereInput = {
  userId: Scalars['ID'];
};

export type GetUserNotificationsQueryVariables = Exact<{
  where: NotificationsWhereInput;
}>;

export const GetUserNotifications = gql`
  query getUserNotifications(
    $where: NotificationsWhereInput
  ) {
    user(where: $where) {

    }
  }
`;

