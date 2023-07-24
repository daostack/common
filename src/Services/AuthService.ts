import {firebaseWebClientId} from '~/Config';

// Firebase imports
import {auth, firebase} from '~/Firebase';
import UserService from '~/Services/UserService';
import NotificationService from '~/Services/NotificationService';

// Google imports
import {GoogleSignin, User} from '@react-native-community/google-signin';

// Apple imports
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthRequestResponse,
} from '@invertase/react-native-apple-authentication';

import {AccessToken, LoginManager} from 'react-native-fbsdk-next';

import {
  IUserEntity,
  UserPublicData,
} from '~/Firebase/Databasee/EntityTypes/IUserEntity';

export const AUTH_PROVIDER_ID = {
  APPLE: 'apple.com',
  GOOGLE: 'google.com',
};

interface UserInfo {
  user: {givenName?: string | null; familyName?: string | null};
}

class AuthService {
  constructor() {
    GoogleSignin.configure({
      webClientId: firebaseWebClientId,
      offlineAccess: true,
    });
  }

  isAppleLoginSupported() {
    return appleAuth.isSupported;
  }

  // Apple Auth flow
  signInApple = async (): Promise<{
    userInfo: IUserEntity;
    credentials: any;
  }> => {
    const appleAuthRequestResponse = await this._applePerformRequest();

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce, authorizationCode, email, fullName} =
      appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    NotificationService.saveTokenToDatabase();
    return {
      userInfo: {
        email,
        firstName: fullName?.givenName,
        lastName: fullName?.familyName,
      } as IUserEntity,
      credentials: {...appleCredential, secret: authorizationCode, nonce},
    };
  };

  // Facebook signIn
  signInFacebook = async (): Promise<{
    userInfo: IUserEntity;
    credentials: any;
  }> => {
    const result = await LoginManager.logInWithPermissions(['public_profile']);
    if (result.isCancelled) {
      throw result;
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    NotificationService.saveTokenToDatabase();
    return {
      userInfo: await auth().signInWithCredential(facebookCredential),
      credentials: facebookCredential,
    };
  };

  sendSms = async (phoneNumber: string): Promise<any> => {
    return await auth().signInWithPhoneNumber(phoneNumber);
  };
  // phone number signIn
  signInPhone = async (
    verificationId,
    verificationCode,
    userInfo,
  ): Promise<any> => {
    const phoneCredential = auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode,
    );
    NotificationService.saveTokenToDatabase();
    return {
      userInfo,
      credentials: phoneCredential,
    };
  };

  // Google Auth flow
  signIn = async (): Promise<{
    userInfo: IUserEntity;
    credentials: any;
  }> => {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();

    const {idToken, accessToken} = await GoogleSignin.getTokens();
    const googleCredential = auth.GoogleAuthProvider.credential(
      idToken,
      accessToken,
    );

    let userInfo = null;
    try {
      userInfo = await auth().signInWithCredential(googleCredential);
    } catch (error) {
      await this.clearGoogleSignInCache();
      await this.googleSignOut();
      throw error;
    }

    NotificationService.saveTokenToDatabase();
    return {
      userInfo: {
        uid: userInfo.user.uid,
        email: userInfo.additionalUserInfo?.profile.email,
        firstName: userInfo.additionalUserInfo?.profile.given_name,
        lastName: userInfo.additionalUserInfo?.profile.family_name,
      } as IUserEntity,
      credentials: googleCredential,
    };
  };

  clearGoogleSignInCache = async (): Promise<void> => {
    const {accessToken} = await GoogleSignin.getTokens();
    await GoogleSignin.clearCachedAccessToken(accessToken);
  };

  googleSignOut = async (): Promise<void> => {
    await GoogleSignin.signOut();
  };

  facebookSignOut = async (): Promise<void> => {
    LoginManager.logOut();
  };

  signOut = async (): Promise<void | unknown> => {
    try {
      await this.googleSignOut();
      await this.facebookSignOut();
      await auth().signOut();
    } catch (error) {
      const {accessToken} = await GoogleSignin.getTokens();
      await GoogleSignin.clearCachedAccessToken(accessToken);
      return error;
    }
  };

  getCurrentLoggedUser = async (
    providerId: string,
  ): Promise<User | UserInfo | null | undefined> => {
    switch (providerId) {
      case AUTH_PROVIDER_ID.APPLE: {
        const {fullName} = await this._applePerformRequest();
        return {
          user: {
            givenName: fullName?.givenName,
            familyName: fullName?.familyName,
          },
        };
      }
      case AUTH_PROVIDER_ID.GOOGLE:
        return await GoogleSignin.getCurrentUser();
      default:
    }
  };

  // Firebase
  async updateUserData(userData: IUserEntity, publicData: IUserEntity) {
    const currentUser = await auth().currentUser;
    currentUser.updateProfile(userData);

    return await UserService.updateUser(currentUser.uid, {
      ...publicData,
      ...userData,
      email: currentUser?.email || userData?.email,
    });
  }

  createUser = async (
    user: IUserEntity & {
      email: string;
      displayName: string;
      photoURL: string;
      metadata: {
        creationTime: firebase.firestore.timestamp;
      };
      phoneNumber: string;
      provider: string;
    },
  ) => {
    const splittedDisplayName = user?.displayName?.split(' ') || [
      user?.email?.split('@')[0] || user?.phoneNumber,
    ];
    const userPhotoUrl = user?.photoURL
      ? user.photoURL
      : `https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${
          user.displayName ? user.displayName : user.email
        }&rounded=true`;
    const userPublicData: UserPublicData = {
      firstName:
        user.firstName || splittedDisplayName?.length >= 1
          ? splittedDisplayName[0]
          : '',
      lastName:
        user.lastName || splittedDisplayName?.length >= 2
          ? splittedDisplayName[1]
          : splittedDisplayName[0],
      photoURL: userPhotoUrl,
      phoneNumber: user?.phoneNumber || '',
      provider: user.provider,
    };
    await UserService.addUser(user.uid, userPublicData, user?.email);
    return userPublicData;
  };

  _applePerformRequest = async (): Promise<AppleAuthRequestResponse> =>
    await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });
}

export default new AuthService();
