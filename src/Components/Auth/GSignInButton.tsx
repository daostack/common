import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, text, layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {statusCodes} from '@react-native-community/google-signin';
import {observer, inject} from 'mobx-react';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import {func, InferProps} from 'prop-types';
import {authStorePropTypes} from '~/Types/propTypes';

const props = {
  onSignIn: func,
  authStore: authStorePropTypes.isRequired,
};
const GSignInButton: React.FC<InferProps<typeof props>> = ({
  onSignIn,
  authStore,
}) => {
  const _signIn = async () => {
    try {
      // That loading status will be changed to false in the onAuthStateChanged method in App.js
      authStore.setIsLoading(true);
      const userInfo = await AuthService.signIn();
      if (onSignIn) {
        onSignIn(userInfo);
      }
      authStore.setSignInError(null);
    } catch (error) {
      authStore.setIsLoading(false);
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          authStore.setSignInError('Canceled');
          break;
        case statusCodes.IN_PROGRESS:
          logger.log('SignIn in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          authStore.setSignInError('play services not available or outdated');
          break;
        default:
          authStore.setSignInError(error);
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
    if (authStore.signInError) {
      const errorText = `${authStore.signInError.toString()} ${
        authStore.signInError.code ? authStore.signInError.code : ''
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

GSignInButton.propTypes = props;

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

export default inject('authStore')(observer(GSignInButton));
