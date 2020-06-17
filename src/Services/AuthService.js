import {GoogleSignin} from '@react-native-community/google-signin';
import {GOOGLE_SIGNIN_PERMISSIONS, WEB_CLIENT_ID} from '../Util';
import {auth} from '../Firebase';
import FirebaseService from './FirebaseService';
import WalletManager from '../Util/WalletManager';
import GoogleDriveService from './GoogleDriveService';
import {NativeModules} from 'react-native';

export default class AuthService {
  static serviceInstance = null;

  initialAppDataContent = {
    mnemonic: null,
    version: '0.1',
  };

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
    GoogleDriveService.init(accessToken);

    const googleCredential = auth.GoogleAuthProvider.credential(
      idToken,
      accessToken,
    );
    return await auth().signInWithCredential(googleCredential);
  }

  async signOut() {
    //await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
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

  async createUserAndWallet(user) {
    const manager = await WalletManager.getInstance(user.uid);
    const userPublicData = {
      ethereumAddress: await manager.getAddress(),
      // store the google user info in the firestore DB
      ...{
        createdAt: new Date(user._user.metadata.creationTime),
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      },
    };

    await FirebaseService.getInstance().addUser(user.uid, userPublicData);
    return userPublicData;
  }

  async loadMnemonic(uid) {
    try {
      await GoogleSignin.signInSilently();
      const {accessToken} = await GoogleSignin.getTokens();
      GoogleDriveService.init(accessToken);
      // console.log('accessToken 2 -> ', accessToken);
      // 1. Read mnemonic from the store
      const mnemonicFromStore = await NativeModules.WalletModule.retrieveMnemonic(
        uid,
      );

      if (mnemonicFromStore) {
        return mnemonicFromStore;
      }

      // console.log('Google Drive-> ');
      // 2. Read mnemonic From the Google Drive app data
      let appData = await GoogleDriveService.getInstance().getAppData();

      if (appData.files && appData.files.length > 0) {
        const appDataFileId = appData.files[0].id;
        const fileContent = await GoogleDriveService.getInstance().getFileById(
          appDataFileId,
        );

        let jsonContent;
        try {
          jsonContent = JSON.parse(fileContent);
        } catch (error) {
          /*
          FIX FOR USESRS WITH BROKEN APP DATA FILES
          TBD: Discuss on removing that logic or replace with better one.
          */

          // The file content is not a valid json
          // In that case we are deleting the file

          await GoogleDriveService.getInstance().deleteAppDataFileById(
            appDataFileId,
          );
          // And then generate and store new mnemonic for the user
          return this._generateAndStoreMnemonic(uid);
        }
        await NativeModules.WalletModule.storeMnemonic(uid, jsonContent.mnemonic);
        return jsonContent.mnemonic;
      }
      // 3. Generate mnemonic and store in Google Drive app data
      return this._generateAndStoreMnemonic(uid);
    } catch (err) {
      // console.error(err);
      await GoogleSignin.signOut();
      await this.signOut();
    }
  }

  // Private functions

  async _generateAndStoreMnemonic(uid) {
    this.initialAppDataContent.mnemonic = await NativeModules.WalletModule.generateAndStoreMnemonic(
      uid,
    );
    await GoogleDriveService.getInstance().setAppData(
      JSON.stringify(this.initialAppDataContent),
    );
    return this.initialAppDataContent.mnemonic;
  }
}
