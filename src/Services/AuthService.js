import {firebaseWebClientId} from '~/Config';

// Firebase imports
import {auth} from '~/Firebase';
import UserService from './UserService';

// Google imports
import {GoogleSignin} from '@react-native-community/google-signin';

// Apple imports
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

export const AUTH_PROVIDER_ID = {
  APPLE: 'apple.com',
  GOOGLE: 'google.com',
};

export default class AuthService {
  static serviceInstance = null;

  constructor() {
    GoogleSignin.configure({
      webClientId: firebaseWebClientId,
    });
  }

  static getInstance = () => {
    if (AuthService.serviceInstance == null) {
      AuthService.serviceInstance = new AuthService();
    }
    return this.serviceInstance;
  };

  isAppleLoginSupported() {
    return appleAuth.isSupported;
  }

  // Apple Auth flow
  async signInApple() {
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
  }

  // Google Auth flow
  async signIn() {
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
  }

  async clearGoogleSignInCache() {
    const {accessToken} = await GoogleSignin.getTokens();
    await GoogleSignin.clearCachedAccessToken(accessToken);
  }

  async googleSignOut() {
    await GoogleSignin.signOut();
  }

  async signOut() {
    try {
      await this.googleSignOut();
      await auth().signOut();
    } catch (error) {
      const {accessToken} = await GoogleSignin.getTokens();
      await GoogleSignin.clearCachedAccessToken(accessToken);
      return error;
    }
  }

  async getCurrentLoggedUser(providerId) {
    switch (providerId) {
    case AUTH_PROVIDER_ID.APPLE: {
      const {fullName} = await this._applePerformRequest();
      return {user: {
        givenName: fullName.givenName,
        familyName: fullName.familyName,
      }};
    }
    case AUTH_PROVIDER_ID.GOOGLE:
      return await GoogleSignin.getCurrentUser();
    default:
    }
  }

  // Firebase
  async updateUserData(userData, publicData) {
    const currentUser = await auth().currentUser;
    currentUser.updateProfile(userData);

    return await UserService.getInstance().editUser(currentUser.uid, {
      ...publicData,
      ...userData,
    });
  }

  async createUser(user) {
    const splittedDisplayName = user?.displayName?.split(' ') || [user?.email.split('@')[0]];
    const userPhotoUrl = user.photoURL
      ? user.photoURL
      : `https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${
        user.displayName ? user.displayName : user.email
      }&rounded=true`;
    const userPublicData = {
      createdAt: new Date(user.metadata.creationTime),
      firstName: user.firstName || splittedDisplayName?.length >= 1 ? splittedDisplayName[0] : '',
      lastName: user.lastName || splittedDisplayName?.length >= 2 ? splittedDisplayName[1] : '',
      email: user.email,
      photoURL: userPhotoUrl,
      uid: user.uid,
    };

    await UserService.getInstance().addUser(user.uid, userPublicData);
    return userPublicData;
  }

  async _applePerformRequest() {
    return await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });
  }
}
