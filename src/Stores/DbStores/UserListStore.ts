import {observable, action, decorate, set, get, ObservableMap} from 'mobx';
import UserService from '~/Services/UserService';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {UserModelStore} from './UserModelStore';

export class UserListStore {
  // Fields
  userList: ObservableMap<string, IUserEntity>;
  isLoading: boolean;

  constructor() {
    this.userList = observable.map({});
    this.isLoading = true;
    this.loadUsers();
  }

  // Actions
  updateUserList = (updatedUserList: Array<IUserEntity>) => {
    updatedUserList.forEach((userEntity: IUserEntity) => {
      set(this.userList, userEntity.uid, UserModelStore(userEntity));
    });
    this.isLoading = false;
  };

  // Functions
  loadUsers = () => {
    this.isLoading = true;
    UserService.getInstance().subscribeToUsers(this.updateUserList);
  };

  getUserById = (uid: string): IUserEntity | undefined =>
    get(this.userList, uid);
}

decorate(UserListStore, {
  isLoading: observable,
  getUserById: observable,
  updateUserList: action,
});
