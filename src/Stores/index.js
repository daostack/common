import EditProfileFormStore from '../FormStores/EditProfileFormStore';
import FundingRequestFormStore from '../FormStores/FundingRequestFormStore';
import CompleteAccountFormStore from '../FormStores/CompleteAccountFormStore';
import CreateCommonFormStore from '../FormStores/CreateCommonFormStore';
import CreateDiscussionStore from '../FormStores/CreateDiscussionStore';
import RequestToJoinFormStore from '../FormStores/RequestToJoinFormStore';

import {
  PaymentFormStore,
  PersonalContributionFormStore,
  IntroduceYourselfFormStore,
} from '../FormStores/RequestToJoin';

import UserStore from './UserStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';

export default {
  completeAccountFormStore: new CompleteAccountFormStore(),
  createCommonFormStore: new CreateCommonFormStore(),
  createDiscussionStore: new CreateDiscussionStore(),
  editProfileFormStore: new EditProfileFormStore(),
  fundingRequestFormStore: new FundingRequestFormStore(),
  requestToJoinFormStore: new RequestToJoinFormStore(),

  // RequestToJoin Form Stores
  paymentFormStore: new PaymentFormStore(),
  personalContributionFormStore: new PersonalContributionFormStore(),
  introduceYourselfFormStore: new IntroduceYourselfFormStore(),

  userStore: new UserStore(),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
