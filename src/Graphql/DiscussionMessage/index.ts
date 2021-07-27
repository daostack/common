import {gql} from '@apollo/client';

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
