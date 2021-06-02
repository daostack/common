import {runInAction} from 'mobx';
import BaseStore from './BaseStore';
import {fetchProposalVoteById} from '~/Services/ListServices/ProposalListService';
import {IFirebaseDoc} from '~/Firebase/types';
import RootStore from '../RootStore';
import {showBackendError} from '~/Util';
import {IVoteEntity} from '~/Firebase/Databasee/EntityTypes/IVoteEntity';
import {Vote} from '~/Stores/Models/Vote';

export default class VoteStore extends BaseStore<Vote, IVoteEntity> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  getEntityModel(entity: IVoteEntity): Vote {
    return new Vote(entity);
  }

  getVoteById = (id: string): Vote | undefined => {
    try {
      return this.getDataById(id);
    } catch (err) {
      fetchProposalVoteById(id)
        .then((vote: IFirebaseDoc<IVoteEntity>) => {
          if (vote.exists) {
            runInAction(() => {
              this.setData(
                id,
                this.getEntityModel(this.firestoreDocToEntity(vote)),
              );
            });
          }
        })
        .catch(() => {
          showBackendError({
            bottomSheetStore: this.rootStore.uiStore.bottomSheetStore,
          });
        });
      return undefined;
    }
  };
}
