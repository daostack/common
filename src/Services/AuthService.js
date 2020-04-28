import {GoogleSignin} from '@react-native-community/google-signin';
import {GOOGLE_SIGNIN_PERMISSIONS, WEB_CLIENT_ID} from '../Util';
import {auth} from '../Firebase';
import FirebaseService from './FirebaseService';

export default class AuthService {
  static serviceInstance = null;

  constructor() {
    GoogleSignin.configure({
      scopes: [GOOGLE_SIGNIN_PERMISSIONS.APP_DATA_RW],
      webClientId: WEB_CLIENT_ID,
    });
  }

  static getInstance = () => {
    if (AuthService.serviceInstance == null) {
      AuthService.serviceInstance = new AuthService();
    }
    return this.serviceInstance;
  };

  async signIn() {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
    const {idToken, accessToken} = await GoogleSignin.getTokens();

    const googleCredential = auth.GoogleAuthProvider.credential(
      idToken,
      accessToken,
    );
    return await auth().signInWithCredential(googleCredential);
  }

  async signOut() {
    await GoogleSignin.revokeAccess();
    await auth().signOut();
  }

  async updateUserData(userData, publicData) {
    const currentUser = await auth().currentUser;
    currentUser.updateProfile(userData);

    return await FirebaseService.getInstance().editUser(currentUser.uid, {
      ...publicData,
      ...userData,
    });
  }

  async getTokens() {
    await GoogleSignin.getTokens();
  }
}
