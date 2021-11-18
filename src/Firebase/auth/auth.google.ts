import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {firebaseWebClientId} from '~/config';
import {AuthProviderActions} from './types';

// Google Auth flow
GoogleSignin.configure({
  webClientId: firebaseWebClientId,
});

const clearGoogleSignInCache = async (): Promise<void> => {
  const {accessToken} = await GoogleSignin.getTokens();
  await GoogleSignin.clearCachedAccessToken(accessToken);
};

const googleSignOut = async (): Promise<void> => {
  await GoogleSignin.signOut();
};

async function signOut() {
  try {
    await googleSignOut();
    await auth().signOut();
  } catch (error) {
    const {accessToken} = await GoogleSignin.getTokens();
    await GoogleSignin.clearCachedAccessToken(accessToken);
    return error;
  }
}

async function getCurrentLoggedUser() {
  return await GoogleSignin.getCurrentUser();
}

export async function googleSignIn() {
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
    await clearGoogleSignInCache();
    await googleSignOut();
    throw error;
  }
  return signedInUser;
}

export const googleAuthProvider: AuthProviderActions = {
  signOut,
  getCurrentLoggedUser,
};
