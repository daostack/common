import {gql} from '@apollo/client';
import {Exact, Scalars} from '~/Graphql';
import {gqlUserProps} from '~/Graphql/User';

const gqlDiscussionMessageProps = `
  id
  updatedAt
  createdAt
  type
  message
  discussionId
  proposalId
  userId
  flag
`;

export const CreateDiscussionMessageDocumant = gql`
  mutation CreateDiscussionMessage(
    $discussionMessage: CreateDiscussionMessageInput!
  ) {
    createDiscussionMessage(input: $discussionMessage) {
      ${gqlDiscussionMessageProps}
    }
  }
`;

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
        flag
        owner {
          ${gqlUserProps}
        }
      }
    }
  }
`;
