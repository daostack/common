import {create} from 'mobx-persist';
import UserListStore from './ListStore/UserListStore';
import CommonStore from './ListStore/CommonStore';
import UserStore from './UserStore';
import ProposalStore from './ListStore/ProposalStore';
import AsyncStorage from '@react-native-community/async-storage';

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

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

    Promise.all([
      hydrate('auth', this.authStore),
      hydrate('user', this.userListStore),
      hydrate('auth', this.commonStore),
      hydrate('user', this.proposalStore),
    ]).then(() => console.log('AFTER ALL STORE INITI'));
  }
}
