import DaoStore from './DaoStore';
import RootStore from './RootStore';
import BottomSheetStore from './BottomSheetStore';

const rootStore = new RootStore();

export default {
  rootStore,
  userStore: rootStore.authStore,
  userListStore: rootStore.userListStore,
  commonListStore: rootStore.commonListStore,

  //TODO: move in UIStore and add ref to rootStore.
  bottomSheetStore: new BottomSheetStore(),
  //TODO: rework DaoStore as UserListStore.
  daoStore: new DaoStore(),
};
