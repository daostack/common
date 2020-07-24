import {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, text, layout} from '../../Theme';
import React from 'react';
import Icon from '../../Assets/iconfont/Icon';
import { statusCodes } from '@react-native-community/google-signin';
import { observer, inject } from 'mobx-react';

import AuthService from '../../Services/AuthService';

const GSignInButton = ({ onSignIn, userStore}) => {
  const [signInError, setSignInError] = useState(null);

  const _signIn = async () => {
    try {
      // That loading status will be changed to false in the onAuthStateChanged method in App.js
      userStore.setIsLoading(true);
      const userInfo = await AuthService.getInstance().signIn();
      if (onSignIn) {
        onSignIn(userInfo);
      }
      setSignInError(null);
    } catch (error) {
      userStore.setIsLoading(false);
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

  const renderSignInButton = () => {
    return (
      <>
        <TouchableOpacity style={layout.btnOutline} onPress={_signIn}>
          <Icon style={layout.btnLeftIcon} name="google" size={32} />
          <Text style={text.buttonblack}>Continue with Google</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderError = () => {
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

export default inject('userStore')(observer(GSignInButton));
