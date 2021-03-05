import {observable, action} from 'mobx';
import {isDaoMemberByUserId} from '~/Util';
import logger from '~/Services/Logger';
import AuthService from '~/Services/AuthService';
import NotificationService from '~/Services/NotificationService';
import {auth} from '~/Firebase';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {subscribeToUser} from '~/Services/ListServices/UserListService';
import {UserModel} from './Models/UserModel';
import {FirestoreUnsubscribeFn, IFirebaseDoc} from '~/Firebase/types';
import RootStore from './RootStore';
import {ICommonMember} from '~/Firebase/Databasee/EntityTypes/ICommonEntity';
import {persist} from 'mobx-persist';

type SignInErrorWithCode = any;

class AuthStore {
  @persist('object')
  @observable
  userInfo: UserModel | null = null;

  @persist
  @observable
  signedInUser: string | null = null;

  @observable
  loginInProgress: string[] = [];

  @observable
  isLoading: boolean = false;

  @observable
  signInError: SignInErrorWithCode;

  @observable
  rootStore: RootStore;

  unsubscribeFromUser: FirestoreUnsubscribeFn | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  // TODO: Create type for incoming user from firebase onAuthStateChanged and reuse the type
  onAuthStateChanged = (user: any) => {
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

          this._processUser(user);
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

  @action
  setSignInError = (error: SignInErrorWithCode) => {
    this.signInError = error;
  };

  @action
  setIsLoading = (loading: boolean) => {
    this.isLoading = loading;
  };
  @action
  addLoginInProgress = (uid: any) => {
    !this.isLoginInProgressExists(uid) && this.loginInProgress.push(uid);
  };
  @action
  removeLoginInProgress = (uid: any) => {
    this.loginInProgress = this.loginInProgress.filter(
      (item: any) => item !== uid,
    );
  };

  @action
  setSignedInUser = (newUserInfo: any) => {
    const isUserChanged = newUserInfo?.uid !== this.userInfo?.uid;
    this.userInfo = newUserInfo;
    if (isUserChanged) {
      this.signedInUser = newUserInfo?.uid;
    }
  };

  getPermission = async (commonId: string, userInfo: UserModel) => {
    const roles = [...(Array.isArray(userInfo.roles) ? userInfo.roles : [])];
    const roleData = roles.find(
      (roleObj) => roleObj.data.commonId === commonId,
    );
    let role = roleData?.role;

    const common = await this.rootStore.commonStore.getCommonById(commonId);

    // for older daos who don't have roles assigned to users
    if (!role && common.metadata.founderId === userInfo.uid) {
      role = 'founder';
    }
    return role;
  };

  isDaoMember = (members: ICommonMember[]) =>
    this.userInfo ? isDaoMemberByUserId(members, this.userInfo.uid) : false;
  isProposer = (proposal: any) =>
    this.userInfo ? this.userInfo.uid === proposal.proposerId : false;

  isLoginInProgressExists = (uid: any) =>
    this.loginInProgress.filter((item: any) => item === uid).length > 0;

  isCurrentlyLogged = (userId: string) => this.userInfo?.uid === userId

  // Private functions
  async _processUser(user: any) {
    this.unsubscribeFromUser && this.unsubscribeFromUser();
    this.unsubscribeFromUser = subscribeToUser(
      user?.uid,
      async (updatedUserDoc: IFirebaseDoc<IUserEntity>) => {
        const updatedUser = updatedUserDoc.data();
        const isNewUser = !updatedUser;
        if (isNewUser) {
          const providerUserInfo = await AuthService.getInstance().getCurrentLoggedUser(
            user.providerData[0].providerId,
          );
          const userInfo = {
            ...user._user,
            ...{
              firstName: providerUserInfo.user.givenName,
              lastName: providerUserInfo.user.familyName,
            },
          };
          AuthService.getInstance().createUser(userInfo);
        } else {
          updatedUser && this.setSignedInUser(new UserModel(updatedUser));
          NotificationService.saveTokenToDatabase();
          this.removeLoginInProgress(updatedUser?.uid);
          this.setIsLoading(false);
        }
      },
    );
  }
}

export default AuthStore;
