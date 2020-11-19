import EditProfileFormStore from '~/FormStores/EditProfileFormStore';
import CompleteAccountFormStore from '~/FormStores/CompleteAccountFormStore';
import CreateDiscussionStore from '~/FormStores/CreateDiscussionStore';

import {
  GeneralInfoFormStore,
  FundingFormStore,
  AgendaFormStore,
  ReviewFormStore,
} from '~/FormStores/CreateCommon';

import UserStore from './UserStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';

export default {
  completeAccountFormStore: new CompleteAccountFormStore(),

  createDiscussionStore: new CreateDiscussionStore(),
  editProfileFormStore: new EditProfileFormStore(),

  // Create Common Form Stores
  generalInfoFormStore: new GeneralInfoFormStore(),
  fundingFormStore: new FundingFormStore(),
  agendaFormStore: new AgendaFormStore(),
  reviewFormStore: new ReviewFormStore(),

  userStore: new UserStore(),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
