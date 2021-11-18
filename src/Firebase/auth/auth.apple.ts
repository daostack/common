import auth from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {AuthProviderActions} from './types';

async function applePerformRequest() {
  return await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
}

function signOut() {
  return Promise.resolve();
}

async function getCurrentLoggedUser() {
  const user = await applePerformRequest();
  if (user.fullName) {
    const {givenName, familyName} = user.fullName;
    return {
      user: {
        givenName,
        familyName,
      },
    };
  } else {
    throw 'Did not find user name in Apple Id';
  }
}

export const appleAuthProvider: AuthProviderActions = {
  signOut,
  getCurrentLoggedUser,
};

export function isAppleLoginSupported() {
  return appleAuth.isSupported;
}

export async function appleSignIn() {
  // 1). start a apple sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  // 2). if the request was successful, extract the token and nonce
  const {identityToken, nonce} = appleAuthRequestResponse;

  // can be null in some scenarios
  if (identityToken) {
    // 3). create a Firebase `AppleAuthProvider` credential
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
    //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
    //     to link the account to an existing user
    const userCredential = await auth().signInWithCredential(appleCredential);

    // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
    console.warn(
      `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`,
    );
  } else {
    // handle this - retry?
  }
}
