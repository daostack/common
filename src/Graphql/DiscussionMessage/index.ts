import {gql} from '@apollo/client';
/*import {
  Exact,
  FileInput,
  ImageInput,
  LinkInput,
  Maybe,
  Mutation,
  Scalars,
} from '~/Graphql';*/

/*
createdAt
  id
  updatedAt
  type
  message
  discussionId
  proposalId
  userId
 */

const gqlDiscussionMessageProps = `
  id
  updatedAt
  createdAt
  type
  message
  discussionId
  proposalId
  userId
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
