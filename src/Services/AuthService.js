// Apple imports
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
// Google imports
import {GoogleSignin} from '@react-native-community/google-signin';
import {firebaseWebClientId} from '~/Config';
// Firebase imports
import {auth} from '~/Firebase';
import {UpdateUserDocument, CreateUserDocument} from '~/Graphql';
import {apollo} from '~/Util/helpers/apolloHelper';

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
        return {
          user: {
            givenName: fullName.givenName,
            familyName: fullName.familyName,
          },
        };
      }
      case AUTH_PROVIDER_ID.GOOGLE:
        return await GoogleSignin.getCurrentUser();
      default:
    }
  }

  // Firebase
  async createUser(user) {
    const {data} = apollo.mutate({
      mutation: CreateUserDocument,
      variables: {
        user,
      },
    });

    return data?.user;
  }

  // Firebase
  async updateUserData(user) {
    const currentUser = await auth().currentUser;
    currentUser.updateProfile(user);

    const {data} = await apollo.mutate({
      mutation: UpdateUserDocument,
      variables: {
        user,
      },
    });

    return data?.updateUser;
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
