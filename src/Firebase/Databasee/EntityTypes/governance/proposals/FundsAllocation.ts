import {PROPOSALS} from '~/Shared/enums/proposals';
import {FUNDING_ALLOCATION_STATUS} from '~/Shared/enums/fundingAllocationStatus';
import {BaseProposal} from './BaseProposal';
import {DocInfo} from '../../DocInfo';
import {firebase} from '~/Firebase';
import {BasicArgsProposal} from './BaseProposal';

export interface FundsAllocationLegal {
  payoutDocs: DocInfo[];

  payoutDocsUserComment: string | null;

  totalInvoicesAmount: number | null;

  payoutDocsRejectionReason: string | null;
}

export interface FundsAllocationTracker {
  status: FUNDING_ALLOCATION_STATUS;

  invoicesNotUploadedNotificationsCounter: number;

  trusteeApprovedAt: firebase.firestore.Timestamp | null;

  withdrawnAt: firebase.firestore.Timestamp | null;
}

export interface FundsAllocation extends BaseProposal {
  data: {
    expiresOn: firebase.firestore.Timestamp;
    args: FundsAllocationArgs;
    legal: FundsAllocationLegal;
    tracker: FundsAllocationTracker;
  };
  type: PROPOSALS.FUNDS_ALLOCATION;
}

export interface FundsAllocationArgs extends BasicArgsProposal {
  amount: number;
}
