import UserStore from './UserStore';
import UserListStore from './ListStore/UserListStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';

export default {
  userStore: new UserStore(),
  userListStore: new UserListStore(),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
