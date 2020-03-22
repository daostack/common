import {useEffect, useState} from 'react';
import {Button, Alert, Text, View} from 'react-native';

import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import GoogleDriveService from '../Services/GoogleDriveService';
import {GOOGLE_SIGNIN_PERMISSIONS} from '../Util';
import {NativeModules} from 'react-native';

let initialAppDataContent = {
  mnemonic: null,
  version: '0.1',
};

const GSignInButton = props => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);

  GoogleSignin.configure({
    scopes: [GOOGLE_SIGNIN_PERMISSIONS.APP_DATA_RW],
  });

  useEffect(() => {
    _isUserSignedIn = async () => {
      try {
        const isSignedIn = await GoogleSignin.isSignedIn();
        setIsSignedIn(isSignedIn);
        isSignedIn ? props.navigation.navigate('CommonHome') : null;
        setError(null);
      } catch (error) {
        const errorMessage =
          error.code === statusCodes.SIGN_IN_REQUIRED
            ? 'Please sign in'
            : error.message;
        setError(new Error(errorMessage));
      }
    };

    _isUserSignedIn();
  }, [isSignedIn]);

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      setIsSignedIn(true);
      // TODO: Use generated mnemonic
      const mnemonic = await _generateMnemonic();
      props.onSignIn();
      setError(null);
    } catch (error) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          Alert.alert('cancelled');
          break;
        case statusCodes.IN_PROGRESS:
          Alert.alert('in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert('play services not available or outdated');
          break;
        default:
          setError(error);
      }
    }
  };

  _generateMnemonic = async () => {
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
      await googleDriveService.setAppData(initialAppDataContent);
      return initialAppDataContent.mnemonic;
    }
  };

  _signOut = async () => {
    try {
      //await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      setIsSignedIn(false);
      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  renderSignInButton = () => {
    return (
      <>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Auto}
          onPress={_signIn}
        />
        {renderError()}
      </>
    );
  };

  renderLogOutBtn = () => {
    return (
      <>
        <Button onPress={_signOut} title="Log out" />
        {renderError()}
      </>
    );
  };

  renderError = () => {
    if (!error) {
      return null;
    }
    const text = `${error.toString()} ${error.code ? error.code : ''}`;
    return <Text>{text}</Text>;
  };

  return <View>{isSignedIn ? renderLogOutBtn() : renderSignInButton()}</View>;
};

export default GSignInButton;
