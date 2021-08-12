import {gql} from '@apollo/client';
import {Exact, Scalars} from '~/Graphql';
import {gqlUserProps} from '~/Graphql/User';
import {BaseType} from '~/Graphql/BaseType';
import {User} from '~/Graphql';
import {ModerationType, MessageReport, REPORT_FLAG} from '~/Graphql/Report';

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

export interface DiscussionMessageType extends BaseType {
  /**
   * ID of the parent discussion of this message, could be a Discussion ID, or a Proposal ID
   */
  discussionId: string;

  /**
   * The ID of the creator of the message
   */
  userId: string;

  /**
   * The content of the message
   */
  message: string;

  /**
   * Image URLs of the user's avatar
   */
  ownerAvatar: string;

  /**
   * The moderation object that handles hiding/showing proposals
   */
  moderation: ModerationType;

  reports: MessageReport[];

  type: string;

  flag: REPORT_FLAG;

  owner: User;
}

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
