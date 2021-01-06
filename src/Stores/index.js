import UserStore from './UserStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';
import {UserListStore} from './DbStores/UserListStore';

export default {
  userStore: new UserStore(),
  userListStore: new UserListStore(),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
