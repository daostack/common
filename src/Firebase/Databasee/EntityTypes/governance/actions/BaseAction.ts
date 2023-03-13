import {ACTIONS} from '~/Shared/enums/actions';

export interface BaseAction {
  cost: number;
  type: ACTIONS;
}
