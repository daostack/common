import EditProfileFormStore from '../FormStores/EditProfileFormStore';
import CompleteAccountFormStore from '../FormStores/CompleteAccountFormStore';
import UserStore from './UserStore';

export default {
  completeAccountFormStore: new CompleteAccountFormStore(),
  editProfileFormStore: new EditProfileFormStore(),
  userStore: new UserStore(),
};
