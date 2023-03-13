import {number} from 'yup';
import {BasicArgsProposal, basicArgsProposal} from './basicArgsProposal';

export const fundsAllocationArgs = basicArgsProposal.shape({
  amount: number().min(0).required(),
});

export interface FundsAllocationArgs extends BasicArgsProposal {
  amount: number;
}
