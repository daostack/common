import {GoogleSignin} from '@react-native-community/google-signin';
import {GOOGLE_SIGNIN_PERMISSIONS} from '../Util';

export default class AuthService {
  constructor() {
    GoogleSignin.configure({
      scopes: [GOOGLE_SIGNIN_PERMISSIONS.APP_DATA_RW],
    });
  }

  async getGoogleSignedInUser() {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      return await GoogleSignin.signInSilently();
    }

    return null;
  }
}
