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

  constructor(newProposalInfo: IProposalEntity) {
    super();
    // Filter the provided newProposalInfo values in order to be sure there are no extra data.
    // Currently there are proposals with displayName prop in the DB,
    // but here the displayName is computed field which can't be assigned a value to.
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

  //computed

  //actions
  setProposal: action,
});
