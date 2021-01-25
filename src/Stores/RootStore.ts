import UserListStore from './ListStore/UserListStore';
import CommonStore from './ListStore/CommonStore';
import UserStore from './UserStore';

export default class RootStore {
  authStore: UserStore;
  userListStore: UserListStore;
  commonStore: CommonStore;

  constructor() {
    this.authStore = new UserStore(this);
    this.userListStore = new UserListStore(this);
    this.commonStore = new CommonStore(this);
  }
}
