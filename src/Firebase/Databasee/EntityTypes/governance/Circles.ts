import {ACTIONS} from '~/Shared/enums/actions';
import {PROPOSALS} from '~/Shared/enums/proposals';
import {Reputation} from './Reputation';

export type AllowedActions = {[key in ACTIONS]?: true};

export type AllowedProposals = {
  [PROPOSALS.FUNDS_ALLOCATION]?: true;
  [PROPOSALS.ASSIGN_CIRCLE]?: circleIndex[];
  [PROPOSALS.REMOVE_CIRCLE]?: circleIndex[];
};

// i.e role
export interface Circles {
  readonly id: string;
  name: string;
  reputation: Partial<Reputation>; // each property will be mapped to a validation function that recieves the value, i.e: minContribution(number) => number > minContributionNumber
  allowedActions: {
    [key in ACTIONS]?: true;
  };
  allowedProposals: {
    [key in PROPOSALS]?: true;
  };
}

export type circleIndex =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;
