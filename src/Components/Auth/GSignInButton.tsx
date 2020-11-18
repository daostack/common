import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, text, layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {statusCodes} from '@react-native-community/google-signin';
import {observer, inject} from 'mobx-react';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import UserStore from '~/Stores/UserStore';

type GSignInButtonProps = {
  onSignIn?: any,
  userStore: UserStore
};
const GSignInButton: React.FC<GSignInButtonProps> = ({
  onSignIn,
  userStore,
}: GSignInButtonProps) => {
  const _signIn = async () => {
    try {
      // That loading status will be changed to false in the onAuthStateChanged method in App.js
      userStore.setIsLoading(true);
      const userInfo = await AuthService.getInstance().signIn();
      if (onSignIn) {
        onSignIn(userInfo);
      }
      userStore.setSignInError(null);
    } catch (error) {
      userStore.setIsLoading(false);
      switch (error.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        userStore.setSignInError('Canceled');
        break;
      case statusCodes.IN_PROGRESS:
        logger.log('SignIn in progress');
        break;
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        userStore.setSignInError('play services not available or outdated');
        break;
      default:
        userStore.setSignInError(error);
      }
    }
  };
  const renderSignInButton = () => (
    <TouchableOpacity style={styles.buttonOutline} onPress={_signIn}>
      <Icon name="google" size={32} />
      <Text style={{...text.buttonblack, fontWeight: '600', width: '100%'}}>
        Continue with Google
      </Text>
    </TouchableOpacity>
  );
  const renderError = () => {
    if (userStore.signInError) {
      const errorText = `${userStore.signInError.toString()} ${
        userStore.signInError.code ? userStore.signInError.code : ''
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
  buttonOutline: {
    ...layout.btnOutline,
    borderWidth: 1.5,
    borderColor: colors.iconBlack,
    justifyContent: 'flex-end',
  },
});

export default inject('userStore')(observer(GSignInButton));
