import {decorate, computed, observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {subscribeToAllProposals} from '~/Services/ListServices/ProposalListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {ProposalModel} from '../Models/ProposalModel';
import {IProposalEntity} from '~/Firebase/Databasee/EntityTypes/IProposalEntity';

export default class ProposalListStore extends ListStore<ProposalModel> {
  rootStore: RootStore;
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super();
    this.rootStore = rootStore;
    this.isLoading = false;
  }
  // Computed fields
  get myProposals() {
    //console.log('MY COMMONS -> ', super.getDataArray);
    return this.isLoading ? [] : super.data; // TODO; filter
  }

  get myPendingProposals() {
    return this.isLoading ? [] : super.data; // TODO; filter
  }

  // Data consuming methods
  getProposalById = (id: string): IProposalEntity | undefined =>
    super.getDataById(id);

  //Actions
  subscribeToAllProposals = (): FirestoreUnsubscribeFn =>
    subscribeToAllProposals(this._updateProposalList);

  // Private function
  _updateProposalList = (updatedUserList: Array<IProposalEntity>) => {
    runInAction(() => {
      this.isLoading = true;
    });

    updatedUserList.forEach((proposalEntity: IProposalEntity) => {
      console.log();
      super.setData(proposalEntity.id, new ProposalModel(proposalEntity));
    });

    runInAction(() => {
      this.isLoading = false;
    });
  };
}

decorate(ProposalListStore, {
  //observables
  isLoading: observable,
  //computed
  myProposals: computed,
  myPendingProposals: computed,
});
