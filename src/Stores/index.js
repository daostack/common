import EditProfileFormStore from '~/FormStores/EditProfileFormStore';
import CompleteAccountFormStore from '~/FormStores/CompleteAccountFormStore';
import CreateDiscussionStore from '~/FormStores/CreateDiscussionStore';

import UserStore from './UserStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';

export default {
  completeAccountFormStore: new CompleteAccountFormStore(),

  createDiscussionStore: new CreateDiscussionStore(),
  editProfileFormStore: new EditProfileFormStore(),

  userStore: new UserStore(),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
