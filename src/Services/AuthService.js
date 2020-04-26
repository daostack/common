import {GoogleSignin} from '@react-native-community/google-signin';
import {GOOGLE_SIGNIN_PERMISSIONS} from '../Util';
import {firebase} from '../Firebase';
import FirebaseService from './FirebaseService';

export default class AuthService {
  static serviceInstance = null;

  constructor() {
    GoogleSignin.configure({
      scopes: [GOOGLE_SIGNIN_PERMISSIONS.APP_DATA_RW],
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
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = firebase.auth.GoogleAuthProvider.credential(
      idToken,
    );
    return await firebase.auth().signInWithCredential(googleCredential);
  }

  async updateUserData(userData, publicData) {
    const currentUser = await firebase.auth().currentUser;
    currentUser.updateProfile(userData);

    return await FirebaseService.getInstance().editUser(currentUser.uid, {
      ...publicData,
      ...userData,
    });
  }
}
