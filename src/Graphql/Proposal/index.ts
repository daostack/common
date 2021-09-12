import {gql} from '@apollo/client';
import {CommonContributionType} from '~/Graphql/Common';
import {
  Exact,
  FileInput,
  ImageInput,
  LinkInput,
  Maybe,
  Mutation,
  Scalars,
} from '~/Graphql';
import {MessageReport, REPORT_FLAG, gqlReportProps} from '~/Graphql/Report';

import {Vote} from '../Votes';
import {Discussion} from '../Discussion';
import {UserModel} from '~/Stores/Models/UserModel';

export enum ProposalState {
  ACCEPTED = 'Accepted',
  COUNTDOWN = 'Countdown',
  FINALIZING = 'Finalizing',
  REJECTED = 'Rejected',
}

export enum RequestToJoinState {
  COUNTDOWN = 'countdown',
  PASSED = 'passed',
  FAILED = 'failed',
}

export enum ProposalPaymentState {
  NOT_ATTEMPTED = 'notAttempted',
  PENDING = 'pending',
  FAILED = 'failed',
  CONFIRMED = 'confirmed',
  NOT_RELEVANT = 'notRelevant',
}

export enum FundingState {
  NOT_ELIGIBLE = 'NotEligible',
  ELIGIBLE = 'Eligible',
  REDEEMED = 'Redeemed',
}

export enum ProposalType {
  FUNDING_REQUEST = 'FundingRequest',
  JOIN_REQUEST = 'JoinRequest',
}

export enum VoteOutcome {
  APPROVE = 'Approve',
  CONDEMN = 'Condemn',
}

interface BaseProposal {
  id: string;
  userId: string;
  user: UserModel;
  title: string;
  type: ProposalType;
  state: string;
  commonId: string;
  description: string;
  links?: Maybe<Array<LinkInput>>;
  files?: Maybe<Array<FileInput>>;
  images?: Maybe<Array<ImageInput>>;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: number;
  votesFor: number;
  votesAgainst: number;
  votes: Vote[];
  discussions: Discussion[];
  reports: MessageReport[];
  flag: REPORT_FLAG;
}

export interface FundingProposalEntity extends BaseProposal {
  type: ProposalType.FUNDING_REQUEST;
  funding: ProposalFunding;
  fundingState: FundingState;
}

export interface JoinRequestEntity extends BaseProposal {
  type: ProposalType.JOIN_REQUEST;
  state: RequestToJoinState;
  paymentState: ProposalPaymentState;
  join: ProposalJoin;
}

export type ProposalEntity = JoinRequestEntity | FundingProposalEntity;

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
    id
    firstName
    lastName
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

export const getProposalDocument = gql`
  query getProposalDocument($where: ProposalWhereUniqueInput!) {
    proposal(where: $where) {
      ${gqlProposalProps}
    }
  }
`;

export const getProposalsDocument = gql`
  query getProposalsDocument($where: ProposalWhereInput!) {
    proposals(where: $where) {
      ${gqlProposalProps}
    }
  }
`;
