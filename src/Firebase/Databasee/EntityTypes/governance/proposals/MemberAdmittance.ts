import {PROPOSALS} from '~/Shared/enums/proposals';
import {BaseProposal} from './BaseProposal';
import {BasicArgsProposal} from './BaseProposal';
import {firebase} from '~/Firebase';

export interface MemberAdmittance extends BaseProposal {
  data: {
    expiresOn: firebase.firestore.Timestamp;
    args: MemberAdmittanceArgs;
  };
  type: PROPOSALS.MEMBER_ADMITTANCE;
  local: {
    defaultCircle: string;
    optimisticAdmittance: boolean;
  };
}

export interface MemberAdmittanceArgs extends BasicArgsProposal {}
