import EditProfileFormStore from '../FormStores/EditProfileFormStore';
import FundingRequestFormStore from '../FormStores/FundingRequestFormStore';
import CompleteAccountFormStore from '../FormStores/CompleteAccountFormStore';
import CreateCommonFormStore from '../FormStores/CreateCommonFormStore';
import UserStore from './UserStore';
import DaoStore from './DaoStore';

export default {
  completeAccountFormStore: new CompleteAccountFormStore(),
  createCommonFormStore: new CreateCommonFormStore(),
  editProfileFormStore: new EditProfileFormStore(),
  fundingRequestFormStore: new FundingRequestFormStore(),
  userStore: new UserStore(),
  daoStore: new DaoStore(),
};
