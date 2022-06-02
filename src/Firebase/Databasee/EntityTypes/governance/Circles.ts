import {ACTIONS} from '~/Shared/enums/actions';
import {PROPOSALS} from '~/Shared/enums/proposals';
import {Reputation} from './Reputation';

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
