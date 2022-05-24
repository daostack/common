import {string, array, object} from 'yup';
import {FundsAllocationArgs} from './fundingAllocation';
import {MembershipAdmittance} from './memberAdmittance';

export const basicArgsProposal = object({
  commonId: string().uuid().required(),

  proposerId: string().required(),

  title: string().default('').required(),

  description: string().default('').required(),

  images: array().of(string()).required(),

  files: array().of(string()).required(),
});

export interface BasicArgsProposal {
  readonly commonId: string;

  readonly proposerId: string;

  title: string;

  description: string;

  images: string[];

  files: string[];
}

export type ProposalType = FundsAllocationArgs | MembershipAdmittance;

//import {MembershipAdmittance} from '~/Firebase/Databasee/EntityTypes/memberAdmittance';
