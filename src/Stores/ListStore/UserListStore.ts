import {decorate, computed, ObservableMap} from 'mobx';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {UserModelStore} from '../ModelStore/UserModelStore';
import ListStore from './ListStore';
import {
  subscribeToAllUsers,
  subscribeToCommonlUsers,
} from '~/Services/ListServices/UserListService';

export type FirestoreUnsubscribeFn = () => void;
export default class UserListStore extends ListStore<IUserEntity> {
  // Fields
  get users(): ObservableMap<string, IUserEntity> {
    return super.data;
  }

  // Data List consuming methods
  getUserById = (uid: string): IUserEntity | undefined =>
    super.getDataById(uid);

  // Functions
  fetchAllUsers = (): FirestoreUnsubscribeFn =>
    subscribeToAllUsers(this._updateUserList);

  // NOTE: the subscribeToCommonlUsers method is not implemented yet. That's only an example of arch of the DomainStore
  fetchCommonUsers = (commonId: string) =>
    subscribeToCommonlUsers(commonId, this._updateUserList);

  // Private function
  _updateUserList = (updatedUserList: Array<IUserEntity>) => {
    updatedUserList.forEach((userEntity: IUserEntity) => {
      super.setData(userEntity.uid, new UserModelStore(userEntity));
    });
  };
}

decorate(UserListStore, {
  users: computed,
});
