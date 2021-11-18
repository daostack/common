import {
  UserStore,
  CommonStore,
  ProposalStore,
  DiscussionStore,
  NotificationStore,
  DiscussionMessageStore,
} from './DataStores';
import {AuthStore} from './auth-store';
import UIStore from './UIStore';
import {createFormStores} from './FormStores';
import {LocalStoageStore} from './local-storage-store';

export default class RootStore {
  authStore = new AuthStore();
  userStore = new UserStore();
  commonStore = new CommonStore();
  proposalStore = new ProposalStore();
  discussionStore = new DiscussionStore();
  discussionMessageStore = new DiscussionMessageStore();
  notificationStore = new NotificationStore();
  uiStore = new UIStore();
  formStores = createFormStores();
  local = new LocalStoageStore();

  constructor() {}
}
