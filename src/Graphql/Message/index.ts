
import {gql} from '@apollo/client';
import {Exact, Scalars} from '~/Graphql';

export type CreateDiscussionMessageInput = {
    discussionId: Scalars['ID'];
    message: Scalars['String'];
}

export type DiscussionWhereInput = {
    discussionId: Scalars['ID'];
}

export type DiscussionWhereUniqueInput = {
    id: Scalars['ID'];
  };

// Input Variables

export type CreateDiscussionMessageVariables = Exact<{
    discussionMessage: CreateDiscussionMessageInput;
}>;

export const CreateDiscussionMessageDocument = gql`
  mutation CreateDiscussionMessage($discussionMessage: CreateDiscussionMessageInput!) {
    createDiscussionMessage(input: $discussionMessage) {
      id
      message
    }
  }
`;

export const GetDiscussionMessageDocument = gql`
  query discussion($id: DiscussionWhereUniqueInput) {
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

