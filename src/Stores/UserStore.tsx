import {observable, action, decorate} from 'mobx';
import {isDaoMemberByUserId} from '~/Util';
import logger from '~/Services/Logger';
import AuthService from '~/Services/AuthService';
import NotificationService from '~/Services/NotificationService';
import {auth} from '~/Firebase';
import {filterObjectByKeys} from '~/Util';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {
  getUserById,
  subscribeToUser,
} from '~/Services/ListServices/UserListService';
import {UserModel} from './Models/UserModel';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import RootStore from './RootStore';

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

class UserStore {
  userInfo: UserModel | null;
  signedInUser: any;
  loginInProgress: any;
  isLoading: boolean;
  signInError: SignInErrorWithCode;
  myCommons: any;
  myProposals: any;
  address: any;
  rootStore: RootStore;

  unsubscribeFromUser: FirestoreUnsubscribeFn | null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.userInfo = null;
    this.isLoading = false;
    this.loginInProgress = [];
    this.unsubscribeFromUser = null;

    auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  // TODO: Create type for incoming user from firebase onAuthStateChanged and reuse the type
  onAuthStateChanged = async (user: any) => {
    logger.log(
      'AUTH STATE CHANGED:',
      user?.uid,
      user?.email,
      user?.displayName,
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

          const loggedUser: UserModel = await this._processUser(user);

          this.setSignedInUser(loggedUser);
          this.removeLoginInProgress(loggedUser.uid);
          this.setIsLoading(false);

          this.unsubscribeFromUser && this.unsubscribeFromUser();
          this.unsubscribeFromUser = subscribeToUser(
            loggedUser?.uid,
            (updatedUser: IUserEntity | null) => {
              updatedUser && this.setSignedInUser(new UserModel(updatedUser));
            },
          );
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
    this.userInfo = newUserInfo;
    if (isUserChanged) {
      this.signedInUser = newUserInfo?.uid;
    }

    // TODO: Apply mobx-persist instead of local storage
    // Cache.set(newUserInfo.uid, newUserObj);
  };

  // Private functions
  async _processUser(user: any): Promise<UserModel> {
    const providerId = user.providerData[0].providerId;

    // TODO: Use mobx-persist instead of local storage cache.
    // The code bellow was the previous one using the cache.
    // For the current PR we keep our implementation simple and will add the cache as a second step.
    //
    // let appUser = Cache.get(user.uid);
    // if (!appUser) {
    //   appUser = UserService.getInstance().getUserById(user.uid);
    // }

    let appUser = await getUserById(user.uid);
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

    NotificationService.saveTokenToDatabase();

    const filteredUser: IUserEntity = filterObjectByKeys(
      {
        ...user._user,
        ...appUser,
      },
      userInfoFields,
    ) as IUserEntity;

    return new UserModel(filteredUser);
  }
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
