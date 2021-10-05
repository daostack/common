import {gql} from '@apollo/client';
import {
  Exact,
  FileInput,
  ImageInput,
  LinkInput,
  Maybe,
  Mutation,
  Scalars,
} from '~/Graphql';
import {
  ProposalFunding,
  ProposalJoin,
  ProposalState,
  ProposalType,
} from './ProposalType';
import {gqlUserProps} from '~/Graphql/User';

export * from './ProposalType';

type CreateProposalInput = {
  title: Scalars['String'];
  commonId: Scalars['String'];
  description: Scalars['String'];
  links?: Maybe<Array<LinkInput>>;
};

export type CreateJoinProposalInput = CreateProposalInput & {
  fundingAmount: Scalars['Int'];
  cardId: Scalars['String'];
  join: ProposalJoin;
};

export type CreateFundingProposalInput = CreateProposalInput & {
  amount: Scalars['Int'];
  files?: Maybe<Array<FileInput>>;
  images?: Maybe<Array<ImageInput>>;
  funding: ProposalFunding;
};

export type CreateVoteInput = {
  outcome: string;
  proposalId: string;
};

export type ProposalWhereInput = {
  id?: Scalars['String'];
  type?: ProposalType;
  state?: ProposalState;
  commonId?: Scalars['String'];
  commonMemberId?: Scalars['String'];
  userId?: Scalars['String'];
  title?: Scalars['String'];
  description?: Scalars['String'];
  AND?: Array<ProposalWhereInput>;
  OR?: Array<ProposalWhereInput>;
};

export type CreateFundingProposalMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'createFundingProposal'
>;

export type CreateJoinProposalMutation = {__typename?: 'Mutation'} & Pick<
  Mutation,
  'createJoinProposal'
>;

// Input Variables

export type CreateFundingProposalMutationVariables = Exact<{
  proposal: CreateFundingProposalInput;
}>;

export type CreateJoinProposalMutationVariables = Exact<{
  proposal: CreateJoinProposalMutation;
}>;

export type CreateJoinProposalVariables = Exact<{
  proposal: CreateJoinProposalInput;
}>;

export type CreateFundingProposalVariables = Exact<{
  proposal: CreateFundingProposalInput;
}>;

export const proposalsStateFilterQueryPart = (
  states: Array<ProposalState>,
): Array<ProposalWhereInput> => states.map((currState) => ({state: currState}));

export const CreateJoinProposalDocument = gql`
  mutation CreateJoinProposal($proposal: CreateJoinProposalInput!) {
    createJoinProposal(input: $proposal) {
      id
      title
      commonId
      description
      links
    }
  }
`;

export const CreateFundingProposalDocument = gql`
  mutation CreateFundingProposal($proposal: CreateFundingProposalInput!) {
    createFundingProposal(input: $proposal) {
      id
      title
      commonId
      description
      links
      files
      images
      funding {
        amount
      }
    }
  }
`;

export const CreateProposalVoteDocument = gql`
  mutation CreateVote($proposalVote: CreateVoteInput!) {
    createVote(input: $proposalVote) {
      id
    }
  }
`;

/* TODO add this when backend is updated with reports
  reports {
    ${gqlReportProps}
  }
 */
const gqlProposalProps = `
  id
  userId
  user {
    ${gqlUserProps}
  }
  title
  type
  state
  commonId
  description
  links
  files
  images
  flag
  funding {
    amount
  }
  join {
    funding
  }
  createdAt
  updatedAt
  expiresAt
  votesFor
  votesAgainst
  votes {
    voterId
    outcome
    voter {
      id
      user {
        id
      }
    }
  }
  discussions {
    id
  }
  `;

export const onProposalChangeDocument = gql`
  subscription ($proposalId: ID!){
    onProposalChange(proposalId: $proposalId) {
      ${gqlProposalProps}
    }
  }
`;

export const finalizeProposalDocument = gql`
  mutation ($proposalId: ID!) {
    finalizeProposal(proposalId: $proposalId)
  }
`;

export const getProposalsDocument = gql`
  query getProposalsDocument($where: ProposalWhereInput!) {
    proposals(where: $where) {
      ${gqlProposalProps}
    }
  }
`;

export const getProposalDocumentById = gql`
  query getProposalDocumentById($where: ProposalWhereUniqueInput!) {
    proposal(where: $where) {
      ${gqlProposalProps}
    }
  }
`;
