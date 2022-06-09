import {ACTIONS} from '~/Shared/enums/actions';
import {CreateProposal} from './CreateProposal';

export interface Actions {
  [ACTIONS.CREATE_PROPOSAL]: CreateProposal;
  // Expended for each action
}
