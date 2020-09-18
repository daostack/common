import {observable, action, decorate} from 'mobx';
import {isDaoMemberBySafeAddress} from '~/Util';

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
  isLoading;
  signInError;
  myCommons;
  myProposals;
  constructor() {
    this.userInfo = null;
    this.isLoading = false;
  }

  setSignInError = (error) => {
    this.signInError = error;
  }

  isDaoMember = (members) => (
    this.userInfo ? isDaoMemberBySafeAddress(members, this.userInfo.safeAddress) : false
  )

  isProposer = (proposal) =>
    this.userInfo
      ? this.userInfo.safeAddress === proposal.proposer
      : false;

  setIsLoading = (loading) => {
    this.isLoading = loading;
  };

  setSignedInUser = (newUserInfo) => {
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
  userInfo: observable,
  setSignInError: observable,
  isLoading: observable,
  myCommons: observable,
  myProposals: observable,
});

export default UserStore;
