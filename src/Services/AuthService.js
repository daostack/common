import {NativeModules, Platform} from 'react-native';
import RNFS from 'react-native-fs';

import {GOOGLE_SIGNIN_PERMISSIONS, AUTH_PROVIDER_ID} from '../Util';
import WalletManager from '../Util/WalletManager';
import {firebaseWebClientId} from '../Config';

// Firebase imports
import {auth} from '../Firebase';
import FirebaseService from './FirebaseService';

// Google imports
import {GoogleSignin} from '@react-native-community/google-signin';
import GoogleDriveService from './GoogleDriveService';

// Apple imports
import appleAuth, {
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import IClouldService from './IClouldService';

export default class AuthService {
  static serviceInstance = null;

  initialAppDataContent = {
    mnemonic: null,
    version: '0.1',
  };

  constructor() {
    GoogleSignin.configure({
      scopes: [GOOGLE_SIGNIN_PERMISSIONS.APP_DATA_RW],
      webClientId: firebaseWebClientId,
    });
  }

  static getInstance = () => {
    if (AuthService.serviceInstance == null) {
      AuthService.serviceInstance = new AuthService();
    }
    return this.serviceInstance;
  };

  // Apple Auth flow
  async signInApple() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });

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
    GoogleDriveService.init(accessToken);

    const googleCredential = auth.GoogleAuthProvider.credential(
      idToken,
      accessToken,
    );
    return await auth().signInWithCredential(googleCredential);
  }

  async signOut() {
    if (Platform.OS === 'android') {
      await GoogleSignin.revokeAccess();
    }
    await GoogleSignin.signOut();
    await auth().signOut();
  }

  // Firebase
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

  async loadMnemonic(uid, providerId) {
    try {
      const mnemonicFromStore = await NativeModules.WalletModule.retrieveMnemonic(
        uid,
      );

      if (mnemonicFromStore) {
        return mnemonicFromStore;
      }

      switch (providerId) {
        case AUTH_PROVIDER_ID.APPLE:
          return await this._loadMnemonicFromiCloud(uid);
        case AUTH_PROVIDER_ID.GOOGLE:
          return await this._loadMnemonicFromGoogleDrive(uid);
        default:
      }
    } catch (err) {
      console.log(err);
      console.log('[AUTH] Invalid session. Please login again.');
      await this.signOut();
    }
  }

  // Private functions

  async _loadMnemonicFromGoogleDrive(uid) {
    await GoogleSignin.signInSilently();
    const {accessToken} = await GoogleSignin.getTokens();
    GoogleDriveService.init(accessToken);

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
        // TBD: Do we need to handle that case anymore ?
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
        return this._generateAndStoreMnemonicGCloud(uid);
      }
      await NativeModules.WalletModule.storeMnemonic(uid, jsonContent.mnemonic);
      return jsonContent.mnemonic;
    }

    // 3. Generate mnemonic and store in Google Drive app data
    return this._generateAndStoreMnemonicGCloud(uid);
  }

  // APPLE
  async _loadMnemonicFromiCloud(uid) {
    // 2. Read mnemonic From the iClould app data
    let appData = await IClouldService.getInstance().getAppData();

    if (appData && appData.files && appData.files.length > 0) {
      const appDataLocalPath = appData.files[0].path;

      const fileContent = await RNFS.readFile(appDataLocalPath, 'utf8');

      let jsonContent;
      try {
        jsonContent = JSON.parse(fileContent);
      } catch (error) {
        // TBD: Do we need to handle that case anymore ?
        console.log('ERROR IN PARSING JSON with content: ', fileContent);
        console.log(error);
        throw error;
      }

      await NativeModules.WalletModule.storeMnemonic(uid, jsonContent.mnemonic);
      return jsonContent.mnemonic;
    }

    // 3. Generate mnemonic and store in Google Drive app data
    return this._generateAndStoreMnemonicICloud(uid);
  }

  async _generateAndStoreMnemonicGCloud(uid) {
    this.initialAppDataContent.mnemonic = await NativeModules.WalletModule.generateAndStoreMnemonic(
      uid,
    );
    await GoogleDriveService.getInstance().setAppData(
      JSON.stringify(this.initialAppDataContent),
    );
    return this.initialAppDataContent.mnemonic;
  }

  async _generateAndStoreMnemonicICloud(uid) {
    this.initialAppDataContent.mnemonic = await NativeModules.WalletModule.generateAndStoreMnemonic(
      uid,
    );
    await IClouldService.getInstance().setAppData(
      JSON.stringify(this.initialAppDataContent),
    );
    return this.initialAppDataContent.mnemonic;
  }
}
