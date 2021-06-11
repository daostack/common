import {gql} from '@apollo/client';
import {
  BaseEntity,
  Exact,
  Mutation,
  Report,
  Scalars,
  User,
  Pagination,
} from '~/Graphql';

export enum DiscussionMessageType {
  Message = 'Message',
}

export enum DiscussionMessageFlag {
  Clear = 'Clear',
  Reported = 'Reported',
  Hidden = 'Hidden',
}
export enum DiscussionType {
  ProposalDiscussion = 'ProposalDiscussion',
  CommonDiscussion = 'CommonDiscussion',
}

export type DiscussionMessage = BaseEntity & {
  id: Scalars['ID'];
  message: Scalars['String'];
  type: DiscussionMessageType;
  flag: DiscussionMessageFlag;
  reports: Array<Report>;
};

export type Discussion = BaseEntity & {
  __typename?: 'Discussion';
  id: Scalars['ID'];
  messages: Array<DiscussionMessage>;
  title: Scalars['String'];
  description: Scalars['String'];
  userId: Scalars['ID'];
  owner: User;
  messageCount: Scalars['Int'];
};

export type CreateDiscussionInput = {
  topic: Scalars['String'];
  description: Scalars['String'];
  commonId: Scalars['String'];
  proposalId?: Scalars['String'];
};

export type CreateDiscussionMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'createDiscussion'
>;

export type CreateDiscussionMutationVariables = Exact<{
  discussion: CreateDiscussionInput;
}>;

export const CreateDiscussionDocument = gql`
  mutation createNewDiscussion($discussion: CreateDiscussionInput!) {
    createDiscussion(input: $discussion) {
      id
    }
  }
`;

export type DiscussionWhereInput = {
  commonId?: Scalars['String'];
  commonMemberId?: Scalars['String'];
  userId?: Scalars['String'];
};

export type getDiscussionsVariable = {
  where: DiscussionWhereInput;
  paginate: Pagination;
};

export const GetDiscussionDocument = gql`
  query GetDiscussions(
    $where: DiscussionWhereInput
    $paginate: PaginateInput! = {take: 10, skip: 0}
  ) {
    discussions(where: $where, paginate: $paginate) {
      id
      title: topic
      description
      messageCount
      createTime: createdAt
      userId
      owner {
        displayName
        photo
      }
    }
  }
`;
