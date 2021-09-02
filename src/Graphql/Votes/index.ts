import {User} from '~/Graphql';

export enum VoteOutcome {
  APPROVE = 'Approve',
  REJECT = 'Condemn',
}

export type Voter = {
	id: string;
	user: User
}

export type Vote = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  outcome: VoteOutcome;
  voter: Voter
};
