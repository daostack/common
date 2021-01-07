import {observable, action, computed, decorate, set, get, ObservableMap} from 'mobx';
import UserService from '~/Services/UserService';
//import {IUserEntity} from '~/Firebase/Databasee/EntityTypes';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import { UserModelStore } from './UserModelStore';

export class UserListStore {
  //TODO: typing: userList: Array<IUserEntity> = []
  userList: ObservableMap<string, IUserEntity>;
  isLoading: boolean;

  constructor() {
    this.userList = observable.map({
      test: {uid: 'test'} as IUserEntity,
    });
    this.isLoading = true;
    this.loadUsers();
  }

  // Fetches all Users from the firestore.
  loadUsers = () => {
    this.isLoading = true;
    UserService.getInstance().subscribeToUsers(this.updateUserList);
  }

  updateUserList = (updatedUserList: Array<IUserEntity>) => {
    updatedUserList.forEach((userEntity: IUserEntity) => {
      set(this.userList, userEntity.uid, UserModelStore(userEntity));
    });
    this.isLoading = false;
  }

  getUserById = (uid: string): IUserEntity | undefined => get(this.userList, uid);
}

decorate(UserListStore, {
  //userList: observable,
  isLoading: observable,
  getUserById: observable,
  //getUserById: computed,
  updateUserList: action,
});
