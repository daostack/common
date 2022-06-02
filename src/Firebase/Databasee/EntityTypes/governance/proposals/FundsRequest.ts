import {PROPOSALS} from '~/Shared/enums/proposals';
import {BaseProposal} from './BaseProposal';
import {BasicArgsProposal} from './BaseProposal';
import {firebase} from '~/Firebase';

export enum FUNDING_TYPES {
  MONTHLY = 'MONTHLY',
  SINGLE = 'SINGLE',
}

export type FundsRequestArgs = BasicArgsProposal;

export interface FundsRequest extends BaseProposal {
  type: PROPOSALS.FUNDS_REQUEST;
  data: {args: FundsRequestArgs; expiresOn: firebase.firestore.Timestamp};
  limitations: {
    minAmount: number;
    maxAmount: number;
  };
  local: {
    allowedPaymentTypes: {
      [FUNDING_TYPES.MONTHLY]: boolean;
      [FUNDING_TYPES.SINGLE]: boolean;
    };
  };
}
