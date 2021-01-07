import UserStore from './UserStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';
import {UserListStore} from './DbStores/UserListStore';

const userListStore = new UserListStore();

export default {
  userListStore,
  userStore: new UserStore(userListStore),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
