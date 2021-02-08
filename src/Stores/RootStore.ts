import {create} from 'mobx-persist';
import UserStore from './AppStores/UserStore';
import CommonStore from './AppStores/CommonStore';
import AuthStore from './AuthStore';
import ProposalStore from './AppStores/ProposalStore';
import AsyncStorage from '@react-native-community/async-storage';
import DiscussionStore from './AppStores/DiscussionStore';
import DiscussionMessageStore from './AppStores/DiscussionMessageStore';

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

export default class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  commonStore: CommonStore;
  proposalStore: ProposalStore;
  discussionStore: DiscussionStore;
  discussionMessageStore: DiscussionMessageStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.commonStore = new CommonStore(this);
    this.proposalStore = new ProposalStore(this);
    this.discussionStore = new DiscussionStore(this);
    this.discussionMessageStore = new DiscussionMessageStore(this);

    Promise.all([
      hydrate('authStore', this.authStore),
      hydrate('userStore', this.userStore),
      hydrate('commonStore', this.commonStore),
      hydrate('proposalStore', this.proposalStore),
    ]).then(() => console.log('AFTER ALL STORE INITI'));
  }
}
