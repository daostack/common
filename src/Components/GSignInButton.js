import {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, text, layout} from '../Theme';

import React from 'react';

import Icon from '../Assets/iconfont/Icon';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import GoogleDriveService from '../Services/GoogleDriveService';
import {GOOGLE_SIGNIN_PERMISSIONS} from '../Util';
import {NativeModules} from 'react-native';
import {auth} from 'firebase';

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
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const mnemonic = await _getMnemonic();
      await NativeModules.WalletModule.storeMnemonic(mnemonic);
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      await auth().signInWithCredential(googleCredential);

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

  _getMnemonic = async () => {
    const tokens = await GoogleSignin.getTokens();
    const googleDriveService = GoogleDriveService.getInstance(
      tokens.accessToken,
    );

    let appData = await googleDriveService.getAppData();
    if (appData.files && appData.files.length > 0) {
      const fileContent = await googleDriveService.getFileById(
        appData.files[0].id,
      );
      const jsonContent = JSON.parse(fileContent);
      return jsonContent.mnemonic;
    } else {
      initialAppDataContent.mnemonic = await NativeModules.WalletModule.generateMnemonic();
      await googleDriveService.setAppData(
        JSON.stringify(initialAppDataContent),
      );
      return initialAppDataContent.mnemonic;
    }
  };

  _signOut = async () => {
    try {
      //await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      setSignInError(null);
    } catch (error) {
      setSignInError(error);
    }
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

  renderLogOutBtn = () => {
    return (
      <>
        <TouchableOpacity style={layout.btnPrimary} onPress={_signOut}>
          <Text style={text.buttonblack}>Log out</Text>
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
