import {observable, action, computed, decorate} from 'mobx';
import UserService from '~/Services/UserService';

export class UserListStore {
    //TODO: typing: userList: Array<IUserEntity> = []
    userList: Array<any> = []
    isLoading: boolean = true

    constructor() {
      this.loadUsers();
    }

    // Fetches all Users from the firestore.
    loadUsers() {
      this.isLoading = true;
      UserService.getInstance().subscribeToUsers(this.updateUserList);
    }

    updateUserList(updatedUserList: any) {
      this.userList = updatedUserList;
      // TODO: improve the update to be only for changed users, or it's properties
      // updatedUserList.forEach((updatedUser: any) => this.updateUser(updatedUser));
      this.isLoading = false;
    }

    getUserById(uid: any) {
      return this.userList.find((currUser) => currUser.uid === uid);
    }
}

decorate(UserListStore, {
  userList: observable,
  isLoading: observable,
  getUserById: computed,
  updateUserList: action,
});
