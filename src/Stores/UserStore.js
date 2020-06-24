import {observable, action, decorate} from 'mobx';

export const userInfoFields = [
  'uid',
  'displayName',
  'email',
  'photoURL',
  'ethereumAddress',
  'intro',
  'byLine',
  'preferences',
  'createdAt',
  'following',
  'follower',
  'safeAddress',
];

class UserStore {
  userInfo;
  isLoading;
  isLogin;
  myCommons;
  myProposals;
  constructor() {
    this.userInfo = null;
    this.isLoading = false;
    this.isLogin = false;
  }

  isDaoMember = members => {
    return members.some(
      member =>
        member.address === this.userInfo.safeAddress?.toLowerCase()
    );
  };

  setIsLoading = loading => {
    this.isLoading = loading;
  };

  setIsLogin = login => {
    this.isLogin = login;
  }

  setSignedInUser = newUserInfo => {
    if (newUserInfo) {
      let newUserObj = {};
      if (newUserInfo.uid) {
        newUserObj.uid = newUserInfo.uid;
      }
      if (newUserInfo.email) {
        newUserObj.email = newUserInfo.email;
      }
      if (newUserInfo.displayName) {
        newUserObj.displayName = newUserInfo.displayName;
      }
      if (newUserInfo.photoURL) {
        newUserObj.photoURL = newUserInfo.photoURL;
      }
      if (newUserInfo.intro) {
        newUserObj.intro = newUserInfo.intro;
      }
      if (newUserInfo.ethereumAddress) {
        newUserObj.ethereumAddress = newUserInfo.ethereumAddress;
      }
      if (newUserInfo.preferences) {
        newUserObj.preferences = newUserInfo.preferences;
      }
      if (newUserInfo.byLine) {
        newUserObj.byLine = newUserInfo.byLine;
      }
      if (newUserInfo.safeAddress) {
        newUserObj.safeAddress = newUserInfo.safeAddress;
      }

      newUserObj.following = newUserInfo.following || [];
      newUserObj.follower = newUserInfo.follower || [];
      // console.log('newUserObj', newUserObj);

      this.userInfo = newUserObj;
    } else {
      this.userInfo = null;
    }
  };
}

decorate(UserStore, {
  address: observable,
  setSignedInUser: action,
  setIsLogin: action,
  userInfo: observable,
  isLoading: observable,
  isLogin: observable,
  myCommons: observable,
  myProposals: observable,
});

export default UserStore;
