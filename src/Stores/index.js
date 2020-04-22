import EditProfileFormStore from '../FormStores/EditProfileFormStore';
import CreateCommonFormStore from '../FormStores/CreateCommonFormStore';
import CreateDiscussionStore from '../FormStores/CreateDiscussionStore';
import UserStore from './UserStore';

export default {
  editProfileFormStore: new EditProfileFormStore(),
  createCommonFormStore: new CreateCommonFormStore(),
  createDiscussionStore: new CreateDiscussionStore(),
  userStore: new UserStore(),
};
