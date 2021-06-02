import {observable} from 'mobx';
import {BaseModel} from './BaseModel';
import {IVoteEntity} from '~/Firebase/Databasee/EntityTypes/IVoteEntity';

export class Vote extends BaseModel<IVoteEntity> {
  @observable
  id: string;

  @observable
  proposalId: string;

  @observable
  commonId: string;

  @observable
  voterId: string;

  constructor(newVoteInfo: IVoteEntity) {
    super(newVoteInfo);

    this.id = newVoteInfo.id;
    this.createdAt = newVoteInfo.createdAt;
    this.updatedAt = newVoteInfo.updatedAt;
    this.proposalId = newVoteInfo.proposalId;
    this.commonId = newVoteInfo.commonId;
    this.voterId = newVoteInfo.voterId;
  }
}
