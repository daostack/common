import EditProfileFormStore from '~/FormStores/EditProfileFormStore';
import FundingRequestFormStore from '~/FormStores/FundingRequestFormStore';
import CompleteAccountFormStore from '~/FormStores/CompleteAccountFormStore';
import CreateDiscussionStore from '~/FormStores/CreateDiscussionStore';

import {
  PaymentFormStore,
  PersonalContributionFormStore,
  IntroduceYourselfFormStore,
} from '~/FormStores/RequestToJoin';

import {
  GeneralInfoFormStore,
  FundingFormStore,
  AgendaFormStore,
  ReviewFormStore,
} from '~/FormStores/CreateCommon';

import UserStore from './UserStore';
import DaoStore from './DaoStore';
import BottomSheetStore from './BottomSheetStore';

import {BillingDetailsFormStore} from '../FormStores/RequestToJoin';

export default {
  completeAccountFormStore: new CompleteAccountFormStore(),

  createDiscussionStore: new CreateDiscussionStore(),
  editProfileFormStore: new EditProfileFormStore(),
  fundingRequestFormStore: new FundingRequestFormStore(),

  // Request To Join Form Stores
  paymentFormStore: new PaymentFormStore(),
  personalContributionFormStore: new PersonalContributionFormStore(),
  introduceYourselfFormStore: new IntroduceYourselfFormStore(),
  billingDetailsFormStore: new BillingDetailsFormStore(),

  // Create Common Form Stores
  generalInfoFormStore: new GeneralInfoFormStore(),
  fundingFormStore: new FundingFormStore(),
  agendaFormStore: new AgendaFormStore(),
  reviewFormStore: new ReviewFormStore(),

  userStore: new UserStore(),
  daoStore: new DaoStore(),
  bottomSheetStore: new BottomSheetStore(),
};
