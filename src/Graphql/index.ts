import {gql} from '@apollo/client';
import * as Apollo from '@apollo/client';
import {Common, CommonContributionType} from './Common';
import {Discussion} from './Discussion';

export type Maybe<T> = T | null;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type BaseEntity = {
  id: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export enum ReportFor {
  Nudity = 'Nudity',
  Violence = 'Violence',
  Harassment = 'Harassment',
  FalseNews = 'False News',
  Spam = 'Spam',
  HateSpeech = 'Hate Speech',
  SomethingElse = 'Something Else',
}

enum ReportStatus {
  Active = 'Active',
  Clossed = 'Clossed',
}

export type Report = BaseEntity & {
  status: ReportStatus;
  for: ReportFor;
  note: Scalars['String'];
  reviewedOn: Scalars['Date'];
  reporterId: Scalars['ID'];
  reporter: User;
  messageId: Scalars['ID'];
};

export enum ProposalType {
  FundingRequest = 'FundingRequest',
  JoinRequest = 'JoinRequest',
}

export enum ProposalState {
  Countdown = 'Countdown',
  Finalizing = 'Finalizing',
  Rejected = 'Rejected',
  Accepted = 'Accepted',
}

export enum ProposalVoteOutcome {
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum ProposalPaymentState {
  NotAttempted = 'notAttempted',
  NotRelevant = 'notRelevant',
  Confirmed = 'confirmed',
  Pending = 'pending',
  Failed = 'failed',
}

export enum ProposalFundingState {
  NotRelevant = 'notRelevant',
  NotAvailable = 'notAvailable',
  Available = 'available',
  Funded = 'funded',
}

/** The proposals type */
export type Proposal = {
  __typename?: 'Proposal';
  id: Scalars['ID'];
  title: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  commonId: Scalars['ID'];
  proposerId: Scalars['ID'];
  votesFor: Scalars['Int'];
  votesAgainst: Scalars['Int'];
  state: ProposalState;
  description: ProposalDescription;
  type: ProposalType;
  paymentState?: Maybe<ProposalPaymentState>;
  fundingState?: Maybe<ProposalFundingState>;
  /** Details about the funding request. Exists only on funding request proposals */
  funding?: Maybe<ProposalFunding>;
  /** Details about the join request. Exists only on join request proposals */
  join?: Maybe<ProposalJoin>;
  votes?: Maybe<Array<Maybe<ProposalVote>>>;
  common: Common;
  proposer: User;
};

export type ProposalDescription = {
  __typename?: 'ProposalDescription';
  title?: Maybe<Scalars['String']>;
  description: Scalars['String'];
};

export type ProposalFunding = {
  __typename?: 'ProposalFunding';
  amount: Scalars['Int'];
};

export type ProposalJoin = {
  __typename?: 'ProposalJoin';
  cardId: Scalars['ID'];
  funding: Scalars['Int'];
  fundingType?: Maybe<CommonContributionType>;
};

export type ProposalVote = {
  __typename?: 'ProposalVote';
  voteId: Scalars['ID'];
  voterId: Scalars['ID'];
  outcome: ProposalVoteOutcome;
  voter?: Maybe<User>;
};

export enum SubscriptionStatus {
  Pending = 'pending',
  Active = 'active',
  CanceledByUser = 'canceledByUser',
  CanceledByPaymentFailure = 'canceledByPaymentFailure',
  PaymentFailed = 'paymentFailed',
}

export type Subscription = {
  __typename?: 'Subscription';
  id: Scalars['ID'];
  cardId: Scalars['ID'];
  userId: Scalars['ID'];
  proposalId: Scalars['ID'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
  charges: Scalars['Int'];
  amount: Scalars['Int'];
  lastChargedAt?: Maybe<Scalars['Date']>;
  dueDate?: Maybe<Scalars['Date']>;
  revoked: Scalars['Boolean'];
  status: SubscriptionStatus;
  metadata: SubscriptionMetadata;
};

export type SubscriptionMetadata = {
  __typename?: 'SubscriptionMetadata';
  common?: Maybe<SubscriptionMetadataCommon>;
};

export type SubscriptionMetadataCommon = {
  __typename?: 'SubscriptionMetadataCommon';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  uid: Scalars['ID'];
  displayName: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  photoURL: Scalars['String'];
  joinedAt: Maybe<Scalars['Date']>;
  tokens?: Maybe<Array<Maybe<Scalars['String']>>>;
  permissions?: Array<Scalars['String']>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  subscriptions?: Maybe<Array<Maybe<Subscription>>>;
};

export type Link = {
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Rule = {
  title: Scalars['String'];
  description: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates new user in the settings */
  createUser: User;
  updateUser: User;
  createCommon: Common;
  createJoinProposal: Proposal;
  createFundingProposal: Proposal;
  updateCommon: Common;
  createDiscussion: Discussion;
};

export type DiscussionWhereInput = {
  commonId: Scalars['ID'];
};

export const GetDiscussionById = gql`
  query getDiscussionById($id: ID!) {
    discussion(id: $id) {
      id
      createdAt
      messages {
        id
        message
        createdAt
        updatedAt
        type
        flag
        owner {
          displayName
          firstName
          lastName
          photo
        }
      }
      title: topic
      description
      userId
      owner {
        firstName
        lastName
        displayName
        photo
      }
    }
  }
`;

export const GetUserPermissionsDocument = gql`
  query getUserPermissions($userId: ID!) {
    user(id: $userId) {
      permissions
    }
  }
`;

export type GetUserPermissionsQuery = {__typename?: 'Query'} & {
  user?: Maybe<{__typename?: 'User'} & Pick<User, 'permissions'>>;
};

export type GetUserPermissionsQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;

export type Pagination = {
  skip: Scalars['Int'];
  take: Scalars['Int'];
};

export function useGetUserPermissionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUserPermissionsQuery,
    GetUserPermissionsQueryVariables
  >,
) {
  return Apollo.useQuery<
    GetUserPermissionsQuery,
    GetUserPermissionsQueryVariables
  >(GetUserPermissionsDocument, baseOptions);
}

export const LoadUserContextDocument = gql`
  query loadUserContext {
    user {
      uid: id
      firstName
      lastName
      email
      photoURL: photo
      country
      intro
      joinedAt: createdAt
    }
  }
`;

export type LoadUserContextQuery = {
  user?: Pick<
    User,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'email'
    | 'photo'
    | 'permissions'
  >;
};

export type LoadUserContextQueryVariables = Exact<{[key: string]: never}>;

export function useLoadUserContextQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoadUserContextQuery,
    LoadUserContextQueryVariables
  >,
) {
  return Apollo.useQuery<LoadUserContextQuery, LoadUserContextQueryVariables>(
    LoadUserContextDocument,
    baseOptions,
  );
}

export type CreateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  photo: Scalars['String'];
  country: Scalars['String'];
};

export type CreateUserMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'createUser'
>;

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;

export const CreateUserDocument = gql`
  mutation CreateUser($user: CreateUserInput!) {
    createUser(input: $user) {
      id
    }
  }
`;

export function useCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateUserMutation,
    CreateUserMutationVariables
  >,
) {
  return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
    baseOptions,
  );
}

export type UpdateUserInput = {
  id?: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  photo: Scalars['String'];
  country: Scalars['String'];
  intro?: Scalars['String'];
};

export type UpdateUserMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'createUser'
>;

export type UpdateUserMutationVariables = Exact<{
  user: UpdateUserInput;
}>;

export const UpdateUserDocument = gql`
  mutation UpdateUser($user: UpdateUserInput!) {
    updateUser(input: $user) {
      uid: id
      firstName
      lastName
      email
      photoURL: photo
      country
      intro
      joinedAt: createdAt
    }
  }
`;

export function useUpdateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >,
) {
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    baseOptions,
  );
}

/** Multi fields inputs */
export type LinkInput = {
  /** The display title of the link */
  title: Scalars['String'];
  /** The actual link part of the link */
  url: Scalars['String'];
};

export type FileInput = {
  value: Scalars['String'];
};

export type ImageInput = {
  value: Scalars['String'];
};

export type UserWhereUniqueInput = {
  userId: Scalars['ID'];
};

export type GetUserInfoQueryVariables = Exact<{
  where: UserWhereUniqueInput;
}>;

export const GetUserInfoDocument = gql`
  query getUserInfo($where: UserWhereUniqueInput!) {
    user(where: $where) {
      uid: id
      email
      photoURL: photo
      firstName
      lastName
      displayName
      country
      intro
      joinedAt: createdAt
    }
  }
`;
