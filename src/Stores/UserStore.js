import {observable, action, decorate} from 'mobx';
import {isDaoMemberByUserId} from '~/Util';
import Cache from '../Util/Cache';

export const userInfoFields = [
  'uid',
  'displayName',
  'firstName',
  'lastName',
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
  signedInUser;
  loginInProgress;
  isLoading;
  signInError;
  myCommons;
  myProposals;
  constructor() {
    this.userInfo = null;
    this.isLoading = false;
    this.loginInProgress = [];
  }

  setSignInError = (error) => {
    this.signInError = error;
  }

  isDaoMember = (members) => (
    this.userInfo ? isDaoMemberByUserId(members, this.userInfo.uid) : false
  )

  isProposer = (proposal) =>
    this.userInfo
      ? this.userInfo.uid === proposal.proposerId
      : false;

  setIsLoading = (loading) => {
    this.isLoading = loading;
  };

  addLoginInProgress = (uid) => {
    this.loginInProgress.push(uid);
  }

  removeLoginInProgress = (uid) => {
    this.loginInProgress = this.loginInProgress.filter((item) => item !== uid);
  }

  isLoginInProgressExists = (uid) => this.loginInProgress.filter((item) => item === uid).length > 0;

  setSignedInUser = (newUserInfo) => {
    const isUserChanged = newUserInfo?.uid !== this.userInfo?.uid;

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
      if (newUserInfo.firstName) {
        newUserObj.firstName = newUserInfo.firstName;
      }
      if (newUserInfo.lastName) {
        newUserObj.lastName = newUserInfo.lastName;
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

      Cache.set(newUserInfo.uid, newUserObj);
      this.userInfo = newUserObj;
    } else {
      this.userInfo = null;
    }

    if (isUserChanged) {
      this.signedInUser = newUserInfo?.uid;
    }
  };
}

decorate(UserStore, {
  address: observable,
  setSignedInUser: action,
  setIsLoading: action,
  userInfo: observable,
  signedInUser: observable,
  setSignInError: observable,
  isLoading: observable,
  myCommons: observable,
  myProposals: observable,
});

export default UserStore;
