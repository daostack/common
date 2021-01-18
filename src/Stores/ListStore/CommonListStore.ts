import {decorate, computed, observable, runInAction} from 'mobx';
import ListStore from './ListStore';
import {subscribeToAllCommons} from '~/Services/ListServices/CommonListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {CommonModel} from '../Models/CommonModel';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {DAO_REGISTERED} from '~/Firebase/Databasee';

export default class CommonListStore extends ListStore<CommonModel> {
  rootStore: RootStore;
  isLoading: boolean;

  constructor(rootStore: RootStore) {
    super();
    this.rootStore = rootStore;
    this.isLoading = false;
  }

  // Computed fields
  get myCommons() {
    //console.log('MY COMMONS -> ', super.getDataArray);
    return this.isLoading
      ? []
      : super.getDataArray?.filter((common: CommonModel) =>
          this.rootStore.authStore.isDaoMember(common?.members),
        );
  }

  get pendingCommons() {
    // TODO: filter data
    return super.data;
  }

  get featuredCommons() {
    // return super.data;
    return this.isLoading
      ? []
      : super.getDataArray?.filter(
          (common: CommonModel) =>
            !this.myCommons.includes(common) &&
            common.register === DAO_REGISTERED,
        );
  }

  // Data consuming methods
  getCommonById = (id: string): ICommonEntity | undefined =>
    super.getDataById(id);

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
      super.setData(commonEntity.id, new CommonModel(commonEntity));
    });

    runInAction(() => {
      this.isLoading = false;
    });
  };
}

decorate(CommonListStore, {
  //observables
  isLoading: observable,
  //computed
  myCommons: computed,
  pendingCommons: computed,
  featuredCommons: computed,
});
