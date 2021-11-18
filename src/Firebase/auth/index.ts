import auth from '@react-native-firebase/auth';
import {AuthProviderActions} from './types';
import {appleAuthProvider} from './auth.apple';
import {googleAuthProvider} from './auth.google';

export {isAppleLoginSupported, appleSignIn} from './auth.apple';
export {googleSignIn} from './auth.google';

export const AUTH_PROVIDER_ID = {
  APPLE: 'apple.com',
  GOOGLE: 'google.com',
};

const Providers: Record<string, AuthProviderActions> = {
  [AUTH_PROVIDER_ID.APPLE]: appleAuthProvider,
  [AUTH_PROVIDER_ID.GOOGLE]: googleAuthProvider,
};

export const getCurrentUser = () => auth().currentUser;

function getProviderActions() {
  if (getCurrentUser() && Providers[getCurrentUser()!.providerId]) {
    return Providers[getCurrentUser()!.providerId];
  }
}

export async function getCurrentLoggedUser() {
  return getProviderActions()?.getCurrentLoggedUser();
}

export async function signOut() {
  return getProviderActions()?.signOut();
}
