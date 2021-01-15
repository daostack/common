import UserListStore from './ListStore/UserListStore';
import CommonListStore from './ListStore/CommonListStore';
import UserStore from './UserStore';

export default class RootStore {
  authStore: UserStore;
  userListStore: UserListStore;
  commonListStore: CommonListStore;

  constructor() {
    this.authStore = new UserStore(this);
    this.userListStore = new UserListStore(this);
    this.commonListStore = new CommonListStore(this);
  }
}
