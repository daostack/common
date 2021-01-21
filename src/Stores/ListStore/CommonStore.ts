import {decorate, computed, observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {subscribeToAllCommons} from '~/Services/ListServices/CommonListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {Common} from '../Models/Common';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {DAO_REGISTERED} from '~/Firebase/Databasee';

export default class CommonStore extends ListStore<Common> {
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.isLoading = false;
  }

  // Computed fields
  get myCommons() {
    //console.log('MY COMMONS -> ', super.getDataArray);
    return this.isLoading
      ? []
      : this.getDataArray?.filter((common: Common) =>
          this.rootStore.authStore.isDaoMember(common?.members),
        );
  }

  get pendingCommons() {
    // TODO: filter data
    return this.data;
  }

  get featuredCommons() {
    // return super.data;
    return this.isLoading
      ? []
      : this.getDataArray?.filter(
          (common: Common) =>
            !this.myCommons.includes(common) &&
            common.register === DAO_REGISTERED,
        );
  }

  // Data consuming methods
  getCommonById = (id: string): ICommonEntity | undefined =>
    this.getDataById(id);

  //Actions
  subscribeToAllCommons = (): FirestoreUnsubscribeFn =>
    subscribeToAllCommons(this._updateCommonList);

  // Private function
  _updateCommonList = (updatedUserList: Array<ICommonEntity>) => {
    runInAction(() => {
      this.isLoading = true;
    });

    updatedUserList.forEach((commonEntity: ICommonEntity) => {
      console.log();
      super.setData(commonEntity.id, new Common(commonEntity));
    });

    runInAction(() => {
      this.isLoading = false;
    });
  };
}

decorate(CommonStore, {
  //observables
  isLoading: observable,
  //computed
  myCommons: computed,
  pendingCommons: computed,
  featuredCommons: computed,
});
