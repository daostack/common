import {observable, action, decorate} from 'mobx';

export const userInfoFields = [
  'id',
  'name',
  'intro',
  'profileImage',
  'photo',
  'byLine',
  'email',
  'ethereumAddress',
  'preferences',
];

class UserStore {
  userInfo;
  isLoading;
  myCommons;
  myProposals;
  constructor() {
    userInfo = null;
    isLoading = false;
  }

  setIsLoading = loading => {
    this.isLoading = loading;
  };

  setSignedInUser = newUserInfo => {
    if (newUserInfo) {
      let newUserObj = {};
      if (newUserInfo.id) newUserObj.id = newUserInfo.id;
      if (newUserInfo.email) newUserObj.email = newUserInfo.email;
      if (newUserInfo.name) newUserObj.name = newUserInfo.name;
      if (newUserInfo.photo) newUserObj.photo = newUserInfo.photo;
      if (newUserInfo.profileImage)
        newUserObj.profileImage = newUserInfo.profileImage;
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
  isLoading: observable,
  myCommons: observable,
  myProposals: observable,
});

export default UserStore;
