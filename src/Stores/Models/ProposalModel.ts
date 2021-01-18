import {observable, decorate, action} from 'mobx';
import {
  IProposalEntity,
  IProposalVote,
  ProposalType,
} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';
import {filterObjectByKeys} from '~/Util';
import {BaseModel} from './BaseModel';

export const proposalInfoFields = [
  'id',
  'proposerId',
  'commonId',
  'type',
  'votes',
  'state',
  'countdownPeriod',
  'quietEndingPeriod',
  'votesFor',
  'votesAgainst',
  'paymentState',
];
export class ProposalModel extends BaseModel<IProposalEntity> {
  // Fields
  id: string = '';
  proposerId: string = '';
  commonId: string = '';
  type: ProposalType = 'join';
  votes: IProposalVote[] = [];
  state: string = '';
  countdownPeriod: number = 0;
  quietEndingPeriod: number = 0;
  votesFor: number = 0;
  votesAgainst: number = 0;
  paymentState: string = '';

  constructor(newProposalInfo: IProposalEntity) {
    super();
    const filteredProposal: IProposalEntity = filterObjectByKeys(
      newProposalInfo,
      proposalInfoFields,
    ) as IProposalEntity;

    this.setProposal(filteredProposal);
  }

  setProposal(newProposalInfo: IProposalEntity) {
    Object.keys(newProposalInfo).forEach((key) => {
      this[key] = newProposalInfo[key];
    });
  }
}

decorate(ProposalModel, {
  //observables
  id: observable,
  proposerId: observable,
  commonId: observable,
  type: observable,
  votes: observable,
  state: observable,
  countdownPeriod: observable,
  quietEndingPeriod: observable,
  votesFor: observable,
  votesAgainst: observable,
  paymentState: observable,

  //computed

  //actions
  setProposal: action,
});
