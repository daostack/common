import {decorate, computed} from 'mobx';
import ListStore from './ListStore';
import {subscribeToAllUsers} from '~/Services/ListServices/UserListService';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from '../RootStore';
import {CommonModel} from '../Models/CommonModel';
import {ICommonEntity} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';

export default class CommonListStore extends ListStore<CommonModel> {
  rootStore: RootStore;

  // Computed fields
  get myCommons() {
    // TODO: filter data
    return super.data;
  }

  get pendingCommons() {
    // TODO: filter data
    return super.data;
  }

  get featuredCommons() {
    // TODO: filter data
    return super.data;
  }

  constructor(rootStore: RootStore) {
    super();
    this.rootStore = rootStore;
  }

  // Data consuming methods
  getCommonById = (id: string): ICommonEntity | undefined =>
    super.getDataById(id);

  //Actions
  subscribeToAllCommons = (): FirestoreUnsubscribeFn =>
    subscribeToAllUsers(this._updateCommonList);

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
