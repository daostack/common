import UserListStore from './ListStore/UserListStore';
import UserStore from './UserStore';

export default class RootStore {
  authStore: UserStore;
  userListStore: UserListStore;

  constructor() {
    this.authStore = new UserStore(this);
    this.userListStore = new UserListStore(this);
  }
}
