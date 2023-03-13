import {makeAutoObservable, observable, ObservableMap} from 'mobx';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import {
  getDataArray,
  getDataById,
  updateStoreData,
} from '~/Util/firebaseHelper';
import {IVoteEntity} from '~/Firebase/Databasee/EntityTypes/IVoteEntity';
import {Vote} from '~/Stores/Models/Vote';
import VoteService from '~/Services/VoteService';

export default class VoteStore {
  private votes: ObservableMap<string, Vote> = observable.map({});

  constructor() {
    makeAutoObservable(this);
  }

  getProposalVotes = (proposalId: string): Vote[] | undefined => {
    return getDataArray(this.votes).filter(
      (vote: Vote) => vote.proposalId === proposalId,
    );
  };

  getVoteById = (id: string): Vote | undefined => {
    return getDataById<Vote>(this.votes, id);
  };

  getVoteEntityModel(entity: IVoteEntity): Vote {
    return new Vote(entity);
  }

  resetVotes(): void {
    this.votes.clear();
  }

  subscribeToProposalVotes = (proposalId: string): FirestoreUnsubscribeFn =>
    VoteService.subscribeToProposalVotes(
      proposalId,
      updateStoreData<IVoteEntity, Vote>(this.votes, this.getVoteEntityModel),
    );
}
