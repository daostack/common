import AuthStore from './AuthStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';
import {UserListStore} from './DbStores/UserListStore';

const userListStore = new UserListStore();

export default {
  userListStore,
  authStore: new AuthStore(userListStore),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
