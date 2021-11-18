import {firebaseWebClientId} from '~/Config';

// Firebase imports
import {auth, Timestamp} from '~/Firebase';

// Google imports
import {GoogleSignin} from '@react-native-community/google-signin';

// Apple imports
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthRequestResponse,
} from '@invertase/react-native-apple-authentication';
import {IUserEntity, UserPublicData} from '~/Types/EntityTypes/IUserEntity';

export const AUTH_PROVIDER_ID = {
  APPLE: 'apple.com',
  GOOGLE: 'google.com',
};

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
  signInApple = async () => {
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
  signIn = async () => {
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

  createUser = async (
    user: IUserEntity & {
      email: string;
      displayName: string;
      photoURL: string;
      metadata: {
        creationTime: Timestamp;
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
      createdAt: user.metadata.creationTime.toDate(),
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
