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

export enum CommonContributionType {
  OneTime = 'OneTime',
  Monthly = 'Monthly',
}

export type CommonMember = {
  __typename?: 'CommonMember';
  /** The user ID of the member */
  userId: Scalars['ID'];
  /** The date, at witch the member joined the common */
  joinedAt?: Maybe<Scalars['Date']>;
};

export type GetCommonDataQueryVariables = Exact<{
  paginate?: Pagination;
}>;

/** The common type */
export type Common = {
  __typename?: 'Common';
  /** The unique identifier of the common */
  id: Scalars['ID'];
  /** The date, at which the common was created */
  createdAt?: Maybe<Scalars['Date']>;
  /** The date, at which the common was last updated */
  updatedAt?: Maybe<Scalars['Date']>;
  /** The display name of the common */
  name: Scalars['String'];
  /** The currently available funds of the common */
  balance: Scalars['Int'];
  /** The total amount of money, raised by the common */
  raised: Scalars['Int'];
  byline: Scalars['String'];
  description: Scalars['String'];
  fundingMinimumAmount: Scalars['Int'];
  links: Array<Link>;
  fundingType: CommonContributionType;
  members: Array<CommonMember>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  openJoinRequests: Scalars['Int'];
  openFundingRequests: Scalars['Int'];
  image: Scalars['String'];
  whitelisted: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates new user in the settings */
  createUser: User;
  updateUser: User;
  createCommon: Common;
  updateCommon: Common;
  createDiscussion: Discussion;
};

export type GetCommonsDataQuery = {__typename?: 'Query'} & {
  commons?: Array<
    {__typename?: 'Common'} & Common & {
        members?: Maybe<
          Array<
            Maybe<{__typename?: 'CommonMember'} & Pick<CommonMember, 'userId'>>
          >
        >;
      }
  >;
};

export const GetCommonProposals = gql`
  query getCommonProposals(
    $where: ProposalWhereInput
    $paginate: PaginateInput! = {take: 10, skip: 0}
  ) {
    proposals(where: $where, paginate: $paginate) {
      id
      state
      createdAt
      updatedAt
      links
      files
      images
      votesFor
      votesAgainst
      title
      description
      discussions {
        id
        topic
        description
        latestMessage
        type
        userId
        owner {
          id
          displayName
          lastName
          firstName
        }
        messages {
          message
          type
          flag
          reports {
            status
            message {
              message
              type
              flag
            }
            for
            note
            reporterId
          }
        }
      }
      funding {
        id
        fundingState
        amount
      }
      join {
        id
        funding
        fundingType
        paymentState
      }
    }
  }
`;

export type DiscussionWhereInput = {
  commonId: Scalars['ID'];
};

export type GetCommonDiscussionsQueryVariables = Exact<{
  where: DiscussionWhereInput;
}>;

export const GetCommonDiscussions = gql`
  query getCommonDiscussions($where: DiscussionWhereInput) {
    discussions(where: $where) {
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
export type GetCommonDiscussionsQuery = {
  discussions?: Maybe<Array<Discussion>>;
};

export function useGetCommonDiscussions(
  baseOptions: Apollo.QueryHookOptions<
    GetCommonDiscussionsQuery,
    GetCommonDiscussionsQueryVariables
  >,
) {
  return Apollo.useQuery<
    GetCommonDiscussionsQuery,
    GetCommonDiscussionsQueryVariables
  >(GetCommonDiscussions, baseOptions);
}

export type GetCommonProposalsQuery = {
  proposals?: Maybe<Array<Proposal>>;
};
export type GetCommonByIdQuery = {
  common?: Maybe<Common>;
};

export type CommonWhereUniqueInput = {
  id: Scalars['ID'];
};

export type GetCommonByIdQueryVariables = Exact<{
  where: CommonWhereUniqueInput;
}>;

export const GetCommonByIdDocument = gql`
  query getCommon($where: CommonWhereUniqueInput!) {
    common(where: $where) {
      id
      name
      image
      balance
      raised
      members {
        userId
        joinedAt: createdAt
        roles
        user {
          id
        }
      }
      rules
      links
      whitelisted
      action
      byline
      description
      fundingType
      fundingMinimumAmount
    }
  }
`;

export type GetCommonDataQuery = {
  commons?: Maybe<Array<Common>>;
};

export type GetCommonProposalsQueryVariables = Exact<{
  where: {
    type?: ProposalType;
    state?: ProposalState;
    commonId?: Scalars['ID'];
    commonMemberId?: Scalars['ID'];
    userId?: Scalars['ID'];
  };
  paginate?: Pagination;
}>;

export function useGetCommonProposals(
  baseOptions: Apollo.QueryHookOptions<
    GetCommonProposalsQuery,
    GetCommonProposalsQueryVariables
  >,
) {
  return Apollo.useQuery<
    GetCommonProposalsQuery,
    GetCommonProposalsQueryVariables
  >(GetCommonProposals, baseOptions);
}

export type CreateCommonInput = {
  name: Scalars['String'];
  fundingMinimumAmount: Scalars['Int'];
  fundingType: Maybe<CommonContributionType>;
  image: Scalars['String'];
  description: Scalars['String'];
  action: Scalars['String'];
  byline: Scalars['String'];
  links: Array<Link>;
  rules: Array<Rule>;
};

export type CreateCommonMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'createCommon'
>;

export type CreateCommonMutationVariables = Exact<{
  common: CreateCommonInput;
}>;

export const CreateCommonDocument = gql`
  mutation CreateCommon($common: CreateCommonInput!) {
    createCommon(input: $common) {
      id
      name
      links
      rules
    }
  }
`;

export function useCreateCommonMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCommonMutation,
    CreateCommonMutationVariables
  >,
) {
  return Apollo.useMutation<
    CreateCommonMutation,
    CreateCommonMutationVariables
  >(CreateCommonDocument, baseOptions);
}

export type UpdateCommonInfoInput = {
  commonId: Scalars['String'];
  name?: Scalars['String'];
  image?: Scalars['String'];
  action?: Scalars['String'];
  byline?: Scalars['String'];
  description?: Scalars['String'];
  links: Array<Link>;
  rules: Array<Rule>;
};

export type UpdateCommonInfoMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'updateCommon'
>;

export type UpdateCommonInfoMutationVariables = Exact<{
  common: UpdateCommonInfoInput;
}>;

export const UpdateCommonInfoDocument = gql`
  mutation UpdateCommonInfo($common: UpdateCommonInfoInput!) {
    updateCommon(input: $common) {
      id
    }
  }
`;

export function useUpdateCommonInfoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCommonInfoMutation,
    UpdateCommonInfoMutationVariables
  >,
) {
  return Apollo.useMutation<
    UpdateCommonInfoMutation,
    UpdateCommonInfoMutationVariables
  >(UpdateCommonInfoDocument, baseOptions);
}

export const GetUserPendingCommonsDocument = gql`
query PendingCommons {
  user {
    proposals(where: {state: ${ProposalState.Countdown}, type: ${ProposalType.JoinRequest}}) {
      common {
        id
        name
        image
        balance
        raised
        members {
          userId
          joinedAt: createdAt
          roles
          user {
            id
            displayName
            photoURL: photo
          }
        }
        rules
        links
        whitelisted
        action
        byline
        description
        fundingType
        fundingMinimumAmount
      }
    }
  }
}
`;

export const GetUserCommonsDocument = gql`
  query MyCommons {
    user {
      commons {
        id
        name
        image
        balance
        raised
        members {
          userId
          joinedAt: createdAt
          roles
          user {
            id
            displayName
            photoURL: photo
          }
        }
        rules
        links
        whitelisted
        action
        byline
        description
        fundingType
        fundingMinimumAmount
      }
    }
  }
`;

export type CommonsWhereInput = {
  ids: Array<string>;
  page: number;
};

export const GetCommonsDocument = gql`
  query AllCommons(
    $where: [String!]
    $paginate: PaginateInput! = {take: 10, skip: 0}
  ) {
    commons(where: {id: {notIn: $where}}, paginate: $paginate) {
      id
      name
      image
      balance
      raised
      members {
        userId
        joinedAt: createdAt
        roles
        user {
          id
          displayName
          photoURL: photo
        }
      }
      rules
      links
      whitelisted
      action
      byline
      description
      fundingType
      fundingMinimumAmount
    }
  }
`;

export const GetCommonPendingMembers = gql`
query CommonPendingMembers($commonId: UUID!) {
    proposals(where: {state: ${ProposalState.Countdown}, type: ${ProposalType.FundingRequest}, commonId: $commonId}) {
      common {
        members {
          user {
            id
            displayName
            photoURL: photo
          }
        }
      }
    }
  }
`;

export const GetCommonHistoryMembers = gql`
  query CommonHistoryMembers($commonId: UUID!) {
    proposals(
      where: {
        commonId: $commonId
        OR: [
          {type: JoinRequest, state: Rejected}
          {type: FundingRequest, OR: [{state: Countdown}, {state: Rejected}]}
        ]
      }
    ) {
      common {
        members {
          user {
            id
            displayName
            photoURL: photo
          }
        }
      }
    }
  }
`;
