import UserListStore from './ListStore/UserListStore';
import CommonStore from './ListStore/CommonStore';
import UserStore from './UserStore';
import ProposalStore from './ListStore/ProposalStore';

export default class RootStore {
  authStore: UserStore;
  userListStore: UserListStore;
  commonStore: CommonStore;
  proposalStore: ProposalStore;

  constructor() {
    this.authStore = new UserStore(this);
    this.userListStore = new UserListStore(this);
    this.commonStore = new CommonStore(this);
    this.proposalStore = new ProposalStore(this);
  }
}
