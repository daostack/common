import EditProfileFormStore from '../FormStores/EditProfileFormStore';
import FundingRequestFormStore from '../FormStores/FundingRequestFormStore';
import CreateCommonFormStore from '../FormStores/CreateCommonFormStore';
import RequestToJoinFormStore from '../FormStores/RequestToJoinFormStore';
import UserStore from './UserStore';

export default {
  editProfileFormStore: new EditProfileFormStore(),
  createCommonFormStore: new CreateCommonFormStore(),
  fundingRequestFormStore: new FundingRequestFormStore(),
  requestToJoinFormStore: new RequestToJoinFormStore(),
  userStore: new UserStore(),
};
