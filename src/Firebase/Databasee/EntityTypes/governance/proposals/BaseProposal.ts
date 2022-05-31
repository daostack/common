import {firebase} from '~/Firebase';
import {PROPOSALS, PROPOSAL_STATE} from '~/Shared/enums/proposals';
import {IBaseEntity} from '../../IBaseEntity';
import {IModerationEntity} from '../../IModerationEntity';
import {VOTE_STATUSES} from '~/Util/constants/votes';

export interface VoteTracker {
  [key: string]: {
    [VOTE_STATUSES.APPROVED]: number;
    [VOTE_STATUSES.ABSTAINED]: number;
    [VOTE_STATUSES.REJECTED]: number;
  };
}

export interface BaseProposal extends IBaseEntity {
  global: {
    duration: number; // time in hours
    quorum: number; // required percentage of common member votes (any vote)
    weights: {circles: [string, ...string[]]; value: number}[]; // sum of values is 100%, ordered array by value (descending)
    minApprove: number; // weight based percentage
    maxReject: number; // weight based percentage
  };

  local: Record<string, unknown>;

  limitations: Record<string, unknown>;

  votes: {
    circles: VoteTracker;

    totalWeightedApproved: number;

    totalWeightedAbstained: number;

    totalWeightedRejected: number;

    totalVotes: number;
  };

  data: {expiresOn: firebase.firestore.Timestamp} & Record<string, unknown>;

  state: PROPOSAL_STATE;

  approvalDate: firebase.firestore.Timestamp | null;

  type: PROPOSALS;

  moderation: IModerationEntity;
}

export interface BasicArgsProposal {
  readonly commonId: string;

  readonly proposerId: string;

  title: string;

  description: string;

  images: {title: string; value: string}[];

  files: {title: string; value: string}[];

  links: {
    title: string;
    value: string;
  }[];
}
