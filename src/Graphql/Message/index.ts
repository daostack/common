import {gql} from '@apollo/client';
import {Exact, Scalars} from '~/Graphql';

export type CreateDiscussionMessageInput = {
  discussionId: Scalars['ID'];
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
