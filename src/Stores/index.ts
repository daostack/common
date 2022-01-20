import RootStore from './RootStore';
import {configure} from 'mobx';

configure({
  enforceActions: 'never',
});

const rootStore = new RootStore();

export default {
  rootStore,
  authStore: rootStore.authStore,
  userStore: rootStore.userStore,
  commonStore: rootStore.commonStore,
  proposalStore: rootStore.proposalStore,
  discussionStore: rootStore.discussionStore,
  discussionMessageStore: rootStore.discussionMessageStore,
  notificationStore: rootStore.notificationStore,
  uiStore: rootStore.uiStore,
};
