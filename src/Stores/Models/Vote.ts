import {makeAutoObservable} from 'mobx';
import {firebase} from '~/Firebase';
import {
  IVoteEntity,
  VoteOutcome,
} from '~/Firebase/Databasee/EntityTypes/IVoteEntity';

export class Vote implements IVoteEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  voterId: string;
  commonId: string;
  proposalId: string;
  outcome: VoteOutcome;

  constructor(newVoteInfo: IVoteEntity) {
    this.id = newVoteInfo.id;
    this.createdAt = newVoteInfo.createdAt;
    this.updatedAt = newVoteInfo.updatedAt;
    this.voterId = newVoteInfo.voterId;
    this.commonId = newVoteInfo.commonId;
    this.proposalId = newVoteInfo.proposalId;
    this.outcome = newVoteInfo.outcome;
    makeAutoObservable(this);
  }
}
