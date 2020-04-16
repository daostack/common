import EditProfileFormStore from '../FormStores/EditProfileFormStore';
import CreateCommonFormStore from '../FormStores/CreateCommonFormStore';
import UserStore from './UserStore';

export default {
  editProfileFormStore: new EditProfileFormStore(),
  createCommonFormStore: new CreateCommonFormStore(),
  userStore: new UserStore(),
};
