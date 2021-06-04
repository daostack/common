
import {gql} from '@apollo/client';
import * as Apollo from '@apollo/client';
import {CommonContributionType, Exact, FileInput, ImageInput, LinkInput, Maybe, Mutation, Scalars} from '~/Graphql';
import {COUNTDOWN_STATES} from '~/Services/ProposalService';

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

export enum ProposalState {
  ACCEPTED = 'Accepted',
  COUNTDOWN = 'Countdown',
  FINALIZING = 'Finalizing',
  REJECTED = 'Rejected',
}

export enum ProposalType {
  FUNDING_REQUEST = 'FundingRequest',
  JOIN_REQUEST = 'JoinRequest',
}

export type ProposalWhereInput = {
    id?: Scalars['String'];
    type?: ProposalType
    state?: ProposalState
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

export const CreateJoinProposalDocument = gql`
  mutation CreateJoinProposal($proposal: CreateJoinProposalInput!) {
    createJoinProposal(input: $proposal) {
      id
      title
      commonId
      description
      links
      fundingAmount
      cardId
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

export const onProposalChangeDocument = gql`
  subscription ($proposalId: ID!){
    onProposalChange(proposalId: $proposalId) {
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

export const finalizeProposalDocument = gql`
  mutation ($proposalId: ID!){
    finalizeProposal(proposalId: $proposalId)
  }
`;

export const proposalsStateFilterQueryPart = (states: Array<ProposalState>): Array<ProposalWhereInput> => states.map((currState) => ({state: currState}));

export const getProposalsDocument = gql`
  query ($where: ProposalWhereInput!){
    proposals( where: $where) {
      id
      title
      type
      commonId
      description
      links
      files
      images
      funding {
          amount
      }
      createdAt
      expiresAt
    }
  }
`;

