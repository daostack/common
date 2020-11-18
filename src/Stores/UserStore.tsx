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
];
type SignInErrorWithCode = any
type UserInfo = any
class UserStore {
  userInfo: UserInfo;
  signedInUser: any;
  loginInProgress: any;
  isLoading: boolean;
  signInError: SignInErrorWithCode;
  myCommons: any;
  myProposals: any;
  address: any;
  constructor() {
    this.userInfo = null;
    this.isLoading = false;
    this.loginInProgress = [];
  }
  setSignInError = (error: SignInErrorWithCode) => {
    this.signInError = error;
  };
  isDaoMember = (members: UserInfo[]) =>
    this.userInfo ? isDaoMemberByUserId(members, this.userInfo.uid) : false;
  isProposer = (proposal: any) =>
    this.userInfo ? this.userInfo.uid === proposal.proposerId : false;
  setIsLoading = (loading: boolean) => {
    this.isLoading = loading;
  };
  addLoginInProgress = (uid: any) => {
    this.loginInProgress.push(uid);
  };
  removeLoginInProgress = (uid: any) => {
    this.loginInProgress = this.loginInProgress.filter((item: any) => item !== uid);
  };
  isLoginInProgressExists = (uid: any) =>
    this.loginInProgress.filter((item: any) => item === uid).length > 0;
  setSignedInUser = (newUserInfo: any) => {
    const isUserChanged = newUserInfo.uid !== this.userInfo.uid;
    if (newUserInfo) {
      let newUserObj = {} as any;
      if (newUserInfo.uid) {
        newUserObj.uid = newUserInfo.uid;
      }
      if (newUserInfo.email) {
        newUserObj.email = newUserInfo.email;
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
      newUserObj.following = newUserInfo.following || [];
      newUserObj.follower = newUserInfo.follower || [];
      newUserObj.displayName = `${newUserInfo.firstName || ''} ${newUserInfo.lastName || ''}`;

      Cache.set(newUserInfo.uid, newUserObj);
      this.userInfo = newUserObj;
    } else {
      this.userInfo = null;
    }
    if (isUserChanged) {
      this.signedInUser = newUserInfo.uid;
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
