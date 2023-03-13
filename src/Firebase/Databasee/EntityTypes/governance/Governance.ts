import {ACTIONS} from '~/Shared/enums/actions';
import {IBaseEntity} from '../IBaseEntity';
import {Proposals} from './proposals';
import {Circles} from './Circles';
import {Consequences} from './Consequences';
import {UnstructuredRules} from './UnstructuredRules';

export interface Governance extends IBaseEntity {
  actions: Partial<{[key in ACTIONS]: {cost: number}}>;
  proposals: Partial<Proposals>;
  circles: Circles;
  tokenPool: number;
  unstructuredRules: UnstructuredRules;
  consequences: Partial<Consequences>;
  readonly commonId: string;
}

export interface CreateGovernancePayload {
  actions: Partial<{[key in ACTIONS]: {cost: number}}>;
  proposals: Partial<Proposals>;
  circles: Circles[];
  tokenPool: number;
  unstructuredRules: UnstructuredRules;
  consequences: Partial<Consequences>;
  readonly commonId: string;
}
