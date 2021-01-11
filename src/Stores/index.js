import UserStore from './UserStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';
import {UserStore} from './ListStore/UserListStore';

const userStore = new UserStore();

export default {
  userStore,
  userStore: new UserStore(userStore),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
