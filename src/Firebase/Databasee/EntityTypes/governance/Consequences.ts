import {CONSEQUENCES} from '~/Shared/enums/consequences';
import {MATH} from '~/Shared/enums/MATH';

export interface Consequences {
  [CONSEQUENCES.SUCCESSFUL_INVITATION]: {
    tokens: number;
    action: MATH;
  };
  [CONSEQUENCES.POST_REPORTED]: {
    tokens: number;
    action: MATH;
  };
  [CONSEQUENCES.PROPOSAL_ACCEPTED]: {
    tokens: number;
    action: MATH;
  };
  [CONSEQUENCES.PROPOSAL_REJECTED]: {
    tokens: number;
    action: MATH;
  };
  [CONSEQUENCES.CORRECT_VOTE]: {
    tokens: number;
    action: MATH;
  };
  [CONSEQUENCES.WRONG_VOTE]: {
    tokens: number;
    action: MATH;
  };
}
