import {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, text, layout} from '../Theme';

import React from 'react';

import Icon from '../Assets/iconfont/Icon';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import GoogleDriveService from '../Services/GoogleDriveService';
import {GOOGLE_SIGNIN_PERMISSIONS} from '../Util';
import {NativeModules} from 'react-native';
import AuthService from '../Services/AuthService';

let initialAppDataContent = {
  mnemonic: null,
  version: '0.1',
};

const GSignInButton = ({onSignIn}) => {
  const [signInError, setSignInError] = useState(null);

  GoogleSignin.configure({
    scopes: [GOOGLE_SIGNIN_PERMISSIONS.APP_DATA_RW],
  });

  _signIn = async () => {
    try {
      const userInfo = await AuthService.getInstance().signIn();
      await _loadMnemonic(userInfo.user.uid);
      if (onSignIn) {
        onSignIn(userInfo);
      }
      setSignInError(null);
    } catch (error) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          setSignInError('Canceled');
          break;
        case statusCodes.IN_PROGRESS:
          console.log('SignIn in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          setSignInError('play services not available or outdated');
          break;
        default:
          setSignInError(error);
      }
    }
  };

  _loadMnemonic = async uid => {
    // 1. Read mnemonic from the store
    /*
    const mnemonicFromStore = NativeModules.WalletModule.retrieveMnemonic(uid);
    if (mnemonicFromStore) {
      return mnemonicFromStore;
    }
    */

    // 2. Read mnemonic From the Google Drive app data
    const tokens = await GoogleSignin.getTokens();
    const googleDriveService = GoogleDriveService.getInstance(
      tokens.accessToken,
    );

    let appData = await googleDriveService.getAppData();

    if (appData.files && appData.files.length > 0) {
      const appDataFileId = appData.files[0].id;
      const fileContent = await googleDriveService.getFileById(appDataFileId);

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
        await googleDriveService.deleteAppDataFileById(appDataFileId);
        // And then generate and store new mnemonic for the user
        return _generateAndStoreMnemonic();
      }
      await NativeModules.WalletModule.storeMnemonic(uid, jsonContent.mnemonic);
      return jsonContent.mnemonic;
    }

    // 3. Generate mnemonic and store in Google Drive app data
    return _generateAndStoreMnemonic();
  };

  _generateAndStoreMnemonic = async uid => {
    initialAppDataContent.mnemonic = await NativeModules.WalletModule.generateAndStoreMnemonic(
      uid,
    );
    await googleDriveService.setAppData(JSON.stringify(initialAppDataContent));
    return initialAppDataContent.mnemonic;
  };

  renderSignInButton = () => {
    return (
      <>
        <TouchableOpacity style={layout.btnOutline} onPress={_signIn}>
          <Icon style={layout.btnLeftIcon} name="google" size={32} />
          <Text style={text.buttonblack}>Sign in with Google</Text>
        </TouchableOpacity>
      </>
    );
  };

  renderError = () => {
    if (signInError) {
      const errorText = `${signInError.toString()} ${
        signInError.code ? signInError.code : ''
      }`;
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.errorMessage}>{errorText}</Text>
          <View style={layout.messageErrorTriangle} />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderError()}
      {renderSignInButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingHorizontal: 24,
  },
  messageContainer: {
    ...layout.messageError,
    ...layout.marginBottomM,
  },
  errorMessage: {
    color: colors.error,
  },
});

export default GSignInButton;
