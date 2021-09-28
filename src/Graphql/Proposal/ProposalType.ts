import {FileInput, ImageInput, LinkInput, Maybe, Scalars} from '~/Graphql';
import {CommonContributionType} from '~/Graphql/Common';
import {MessageReport, REPORT_FLAG} from '~/Graphql/Report';
import {UserModel} from '~/Stores/Models/UserModel';
import {Discussion} from '../Discussion';
import {Vote} from '../Votes';

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
