import RootStore from './RootStore';

const rootStore = new RootStore();

export default {
  rootStore,
  authStore: rootStore.authStore,
  userStore: rootStore.userStore,
  commonStore: rootStore.commonStore,
  proposalStore: rootStore.proposalStore,
  discussionStore: rootStore.discussionStore,
  discussionMessageStore: rootStore.discussionMessageStore,
  uiStore: rootStore.uiStore,
};
