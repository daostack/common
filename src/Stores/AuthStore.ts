import {observable, action, decorate} from 'mobx';
import {isDaoMemberByUserId} from '~/Util';
import logger from '~/Services/Logger';
import AuthService from '~/Services/AuthService';
import NotificationService from '~/Services/NotificationService';
import {auth} from '~/Firebase';
import {UserListStore} from './DbStores/UserListStore';
import {filterObjectByKeys} from '~/Util';

export const userInfoFields = [
  'uid',
  'firstName',
  'lastName',
  'email',
  'photoURL',
  'updatedAt',
  'createdAt',
];
type SignInErrorWithCode = any;
type UserInfo = any;

class AuthStore {
  userInfo: UserInfo;
  signedInUser: any;
  loginInProgress: any;
  isLoading: boolean;
  signInError: SignInErrorWithCode;
  myCommons: any;
  myProposals: any;
  address: any;

  userListStore: UserListStore;

  constructor(userListStore: UserListStore) {
    this.userInfo = null;
    this.isLoading = false;
    this.loginInProgress = [];
    this.userListStore = userListStore;

    auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = async (user) => {
    logger.log(
      'AUTH STATE CHANGED:',
      user?.uid,
      user?.email,
      user?.displayName,
      user,
    );
    try {
      // onAuthStateChanged method is called on many events, not only when the logged in user is changed.
      // In order to prevent unwanted rerendering we need to make some checks.
      if (
        !this.isLoginInProgressExists(user?.uid) &&
        this.userInfo?.uid !== user?.uid
      ) {
        if (user) {
          this.setIsLoading(true);
          this.addLoginInProgress(user?.uid);
          const providerId = user.providerData[0].providerId;

          // TODO: discuss cache using and apply it for users
          let appUser = null; // await Cache.get(user.uid);

          if (!appUser) {
            appUser = this.userListStore.getUserById(user.uid);
          }
          const isNewUser = !appUser;

          if (isNewUser) {
            const providerUserInfo = await AuthService.getInstance().getCurrentLoggedUser(
              providerId,
            );
            const userInfo = {
              ...user._user,
              ...{
                firstName: providerUserInfo.user.givenName,
                lastName: providerUserInfo.user.familyName,
              },
            };
            appUser = await AuthService.getInstance().createUser(userInfo);
          }

          const allUserInfo = {
            ...user._user,
            ...appUser,
          };

          NotificationService.saveTokenToDatabase();

          const filteredUser = filterObjectByKeys(allUserInfo, userInfoFields);
          this.setSignedInUser(filteredUser);
          this.removeLoginInProgress(filteredUser.uid);
          this.setIsLoading(false);

          this.setIsLoading(false);
        } else {
          this.setSignedInUser(null);
          this.setIsLoading(false);
        }
      }
    } catch (error) {
      logger.log(error);
      throw error;
    }
  };

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
    this.loginInProgress = this.loginInProgress.filter(
      (item: any) => item !== uid,
    );
  };
  isLoginInProgressExists = (uid: any) =>
    this.loginInProgress.filter((item: any) => item === uid).length > 0;
  setSignedInUser = (newUserInfo: any) => {
    const isUserChanged = newUserInfo?.uid !== this.userInfo?.uid;
    if (newUserInfo) {
      this.userInfo = this.userListStore.getUserById(newUserInfo?.uid);
    } else {
      this.userInfo = null;
    }
    if (isUserChanged) {
      this.signedInUser = newUserInfo?.uid;
    }
  };
}
decorate(AuthStore, {
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

export default AuthStore;
