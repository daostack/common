import {gql} from '@apollo/client';
import {Exact, Scalars, User, Report} from '~/Graphql';

export enum DiscussionMessageType {
  message
}

export type Message = {
  id: string;
  owner: User;
  createdAt: Scalars['Date'];
  updatedAt?: Scalars['Date'];
  message: string;
  type: DiscussionMessageType;
  userId: string;
  discussionId: string;
  reports: [Report];
}

export type CreateDiscussionMessageInput = {
  discussionId: Scalars['String'];
  message: Scalars['String'];
};

export type DiscussionWhereInput = {
  discussionId: Scalars['ID'];
};

// Input Variables
export type CreateDiscussionMessageVariables = Exact<{
  discussionMessage: CreateDiscussionMessageInput;
}>;

export const CreateDiscussionMessageDocument = gql`
  mutation createDiscussionMessage(
    $discussionMessage: CreateDiscussionMessageInput!
  ) {
    createDiscussionMessage(input: $discussionMessage) {
      discussionId
      message
    }
  }
`;

export const GetDiscussionMessageDocument = gql`
  query discussion($id: ID!) {
    discussion(id: $id) {
      id
      messages {
        id
        message
        userId
        createdAt
      }
    }
  }
`;
