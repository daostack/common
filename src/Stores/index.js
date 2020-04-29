import EditProfileFormStore from '../FormStores/EditProfileFormStore';
import FundingRequestFormStore from '../FormStores/FundingRequestFormStore';
import CreateCommonFormStore from '../FormStores/CreateCommonFormStore';
import UserStore from './UserStore';

export default {
  editProfileFormStore: new EditProfileFormStore(),
  createCommonFormStore: new CreateCommonFormStore(),
  fundingRequestFormStore: new FundingRequestFormStore(),
  userStore: new UserStore(),
};
