import {useEffect, useState} from 'react';
import {Button, Alert, Text, View} from 'react-native';

import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {GOOGLE_SIGNIN_PERMISSIONS} from '../Util';

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

  _signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
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
