import {firebaseWebClientId} from '~/Config';

// Firebase imports
import {auth, firebase} from '~/Firebase';
import UserService from '~/Services/UserService';

// Google imports
import {GoogleSignin, User} from '@react-native-community/google-signin';

// Apple imports
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthRequestResponse,
} from '@invertase/react-native-apple-authentication';
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
    });
  }

  isAppleLoginSupported() {
    return appleAuth.isSupported;
  }

  // Apple Auth flow
  signInApple = async (): Promise<IUserEntity> => {
    const appleAuthRequestResponse = await this._applePerformRequest();

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  };

  // Google Auth flow
  signIn = async (): Promise<IUserEntity> => {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();

    const {idToken, accessToken} = await GoogleSignin.getTokens();
    const googleCredential = auth.GoogleAuthProvider.credential(
      idToken,
      accessToken,
    );
    let signedInUser = null;
    try {
      signedInUser = await auth().signInWithCredential(googleCredential);
    } catch (error) {
      await this.clearGoogleSignInCache();
      await this.googleSignOut();
      throw error;
    }
    return signedInUser;
  };

  clearGoogleSignInCache = async (): Promise<void> => {
    const {accessToken} = await GoogleSignin.getTokens();
    await GoogleSignin.clearCachedAccessToken(accessToken);
  };

  googleSignOut = async (): Promise<void> => {
    await GoogleSignin.signOut();
  };

  signOut = async (): Promise<void | unknown> => {
    try {
      await this.googleSignOut();
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
    },
  ) => {
    const splittedDisplayName = user?.displayName?.split(' ') || [
      user?.email.split('@')[0],
    ];
    const userPhotoUrl = user.photoURL
      ? user.photoURL
      : `https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${
          user.displayName ? user.displayName : user.email
        }&rounded=true`;
    const userPublicData: UserPublicData = {
      createdAt: new Date(user.metadata.creationTime),
      firstName:
        user.firstName || splittedDisplayName?.length >= 1
          ? splittedDisplayName[0]
          : '',
      lastName:
        user.lastName || splittedDisplayName?.length >= 2
          ? splittedDisplayName[1]
          : '',
      email: user.email,
      photoURL: userPhotoUrl,
      uid: user.uid,
    };

    await UserService.addUser(user.uid, userPublicData);
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
