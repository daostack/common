import CreateDiscussionStore from '~/FormStores/CreateDiscussionStore';

import UserStore from './UserStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';

export default {
  createDiscussionStore: new CreateDiscussionStore(),

  userStore: new UserStore(),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
