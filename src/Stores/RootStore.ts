import {create} from 'mobx-persist';
import UserListStore from './ListStore/UserListStore';
import CommonStore from './ListStore/CommonStore';
import UserStore from './UserStore';
import ProposalStore from './ListStore/ProposalStore';
import AsyncStorage from '@react-native-community/async-storage';
import DiscussionStore from './ListStore/DiscussionStore';
import DiscussionMessageStore from './ListStore/DiscussionMessageStore';

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

export default class RootStore {
  authStore: UserStore;
  userListStore: UserListStore;
  commonStore: CommonStore;
  proposalStore: ProposalStore;
  discussionStore: DiscussionStore;
  discussionMessageStore: DiscussionMessageStore;

  constructor() {
    this.authStore = new UserStore(this);
    this.userListStore = new UserListStore(this);
    this.commonStore = new CommonStore(this);
    this.proposalStore = new ProposalStore(this);
    this.discussionStore = new DiscussionStore(this);
    this.discussionMessageStore = new DiscussionMessageStore(this);

    Promise.all([
      hydrate('auth', this.authStore),
      hydrate('common', this.commonStore),
    ]);
  }
}
