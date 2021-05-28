import {create} from 'mobx-persist';
import {ApolloClient, NormalizedCacheObject} from '@apollo/client';
import UserStore from './DataStores/UserStore';
import CommonStore from './DataStores/CommonStore';
import AuthStore from './AuthStore';
import ProposalStore from './DataStores/ProposalStore';
import AsyncStorage from '@react-native-community/async-storage';
import DiscussionStore from './DataStores/DiscussionStore';
import NotificationStore from './DataStores/NotificationStore';
import DiscussionMessageStore from './DataStores/DiscussionMessageStore';
import UIStore from './UIStore';
import {apollo} from '~/Util/helpers/apolloHelper';

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
  notificationStore: NotificationStore;
  uiStore: UIStore;
  apollo: ApolloClient<NormalizedCacheObject>;

  constructor() {
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.commonStore = new CommonStore(this);
    this.proposalStore = new ProposalStore(this);
    this.discussionStore = new DiscussionStore(this);
    this.discussionMessageStore = new DiscussionMessageStore(this);
    this.notificationStore = new NotificationStore(this);
    this.uiStore = new UIStore(this);
    this.apollo = apollo;

    Promise.all([
      hydrate('authStore', this.authStore),
      hydrate('userStore', this.userStore),
      hydrate('commonStore', this.commonStore),
      hydrate('proposalStore', this.proposalStore),
      hydrate('notificationStore', this.notificationStore),
    ]);
  }
}
