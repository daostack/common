import {observable, decorate, computed, ObservableMap} from 'mobx';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {UserModelStore} from '../ModelStore/UserModelStore';
import ListStore from './ListStore';
import {
  subscribeToAllUsers,
  subscribeToCommonlUsers,
} from '~/Services/ListServices/UserListService';

export class UserListStore extends ListStore<IUserEntity> {
  // Fields
  get getUserList(): ObservableMap<string, IUserEntity> {
    return super.dataList;
  }

  // Data List consuming methods
  getUserById = (uid: string): IUserEntity | undefined =>
    super.getDataById(uid);

  // Functions
  loadAllUsers = () => {
    super.subscribeToDataChanges(subscribeToAllUsers(this._updateUserList));
  };

  loadCommonUsers = (commonId: string) => {
    super.subscribeToDataChanges(
      subscribeToCommonlUsers(commonId, this._updateUserList),
    );
  };

  // Private function
  _updateUserList = (updatedUserList: Array<IUserEntity>) => {
    updatedUserList.forEach((userEntity: IUserEntity) => {
      super.setData(userEntity.uid, new UserModelStore(userEntity));
    });
    this.isLoading = false;
  };
}

decorate(UserListStore, {
  getUserList: computed,
  getUserById: observable,
});
