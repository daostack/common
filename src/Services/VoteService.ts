import {VotesCollection} from '~/Firebase/Databasee/Collections/VotesCollection';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';

class VoteService {
  subscribeToProposalVotes = (
    proposalId: string,
    callback: any,
  ): FirestoreUnsubscribeFn => {
    return VotesCollection.where('proposalId', '==', proposalId).onSnapshot(
      (snapshot: any) => {
        callback(snapshot);
      },
    );
  };
}

export default new VoteService();
