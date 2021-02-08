import DaoStore from './DaoStore';
import RootStore from './RootStore';
import BottomSheetStore from './BottomSheetStore';

const rootStore = new RootStore();

export default {
  rootStore,
  authStore: rootStore.authStore,
  userStore: rootStore.userStore,
  commonStore: rootStore.commonStore,
  proposalStore: rootStore.proposalStore,
  discussionStore: rootStore.discussionStore,
  discussionMessageStore: rootStore.discussionMessageStore,

  //TODO: move in UIStore and add ref to rootStore.
  bottomSheetStore: new BottomSheetStore(),
  //TODO: rework DaoStore as UserListStore.
  daoStore: new DaoStore(),
};
