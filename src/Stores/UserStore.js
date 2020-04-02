import {observable, action, decorate} from 'mobx';

export const userInfoFields = [
  'id',
  'name',
  'intro',
  'profilePicture',
  'photo',
  'byLine',
  'email',
  'ethereumAddress',
  'preferences',
];

class UserStore {
  userInfo;
  constructor() {
    userInfo = null;
  }

  setSignedInUser = newUserInfo => {
    if (newUserInfo) {
      let newUserObj = {};
      if (newUserInfo.id) newUserObj.id = newUserInfo.id;
      if (newUserInfo.email) newUserObj.email = newUserInfo.email;
      if (newUserInfo.name) newUserObj.name = newUserInfo.name;
      if (newUserInfo.photo) newUserObj.photo = newUserInfo.photo;
      if (newUserInfo.profilePicture)
        newUserObj.profilePicture = newUserInfo.profilePicture;
      if (newUserInfo.intro) newUserObj.intro = newUserInfo.intro;
      if (newUserInfo.ethereumAddress)
        newUserObj.ethereumAddress = newUserInfo.ethereumAddress;
      if (newUserInfo.preferences)
        newUserObj.preferences = newUserInfo.preferences;
      if (newUserInfo.byLine) newUserObj.byLine = newUserInfo.byLine;

      this.userInfo = newUserObj;
    } else {
      this.userInfo = null;
    }
  };
}

decorate(UserStore, {
  setSignedInUser: action,
  userInfo: observable,
});

export default UserStore;
