import {decorate, computed} from 'mobx';
import ListStore from './ListStore';
import {subscribeToAllCommons} from '~/Services/ListServices/CommonListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {CommonModel} from '../Models/CommonModel';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {DAO_REGISTERED} from '~/Firebase/Databasee';

export default class CommonListStore extends ListStore<CommonModel> {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    super();
    this.rootStore = rootStore;
  }

  // Computed fields
  get myCommons() {
    //console.log('MY COMMONS -> ', super.getDataArray);
    return super.getDataArray?.filter((common: CommonModel) =>
      this.rootStore.authStore.isDaoMember(common?.members),
    );
  }

  get pendingCommons() {
    // TODO: filter data
    return super.data;
  }

  get featuredCommons() {
    // return super.data;
    return super.getDataArray?.filter(
      (common: CommonModel) =>
        !this.myCommons.includes(common) && common.register === DAO_REGISTERED,
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
    updatedUserList.forEach((commonEntity: ICommonEntity) => {
      super.setData(commonEntity.id, new CommonModel(commonEntity));
    });
  };
}

decorate(CommonListStore, {
  //computed
  myCommons: computed,
  pendingCommons: computed,
  featuredCommons: computed,
});
