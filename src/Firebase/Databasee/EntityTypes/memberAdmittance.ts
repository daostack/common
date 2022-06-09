import {string} from 'yup';
import {BasicArgsProposal, basicArgsProposal} from './basicArgsProposal';

export const memberAdmittanceArgs = basicArgsProposal.shape({
  circle: string().uuid().optional(),
});

export interface MembershipAdmittance extends BasicArgsProposal {
  circles?: string;
}
