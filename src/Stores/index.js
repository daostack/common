import EditProfileFormStore from '../FormStores/EditProfileFormStore';
import CompleteAccountFormStore from '../FormStores/CompleteAccountFormStore';
import CreateCommonFormStore from '../FormStores/CreateCommonFormStore';
import UserStore from './UserStore';

export default {
  completeAccountFormStore: new CompleteAccountFormStore(),
  createCommonFormStore: new CreateCommonFormStore(),
  editProfileFormStore: new EditProfileFormStore(),
  userStore: new UserStore(),
};
