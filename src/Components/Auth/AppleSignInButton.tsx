import {useState} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, text, layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {observer, inject} from 'mobx-react';
import {AppleAuthError} from '@invertase/react-native-apple-authentication';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import UserStore from '~/Stores/UserStore';
type AppleSignInButtonProps = {
  onSignIn?: any,
  userStore: UserStore,
  customStyle?: any
};

const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({
  onSignIn,
  userStore,
  customStyle,
}: AppleSignInButtonProps) => {
  const [signInError, setSignInError] = useState <any>(null);
  const _signIn = async () => {
    try {
      // That loading status will be changed to false in the onAuthStateChanged method in App.js
      userStore.setIsLoading(true);
      const userInfo = await AuthService.getInstance().signInApple();
      if (onSignIn) {
        onSignIn(userInfo);
      }
      setSignInError(null);
    } catch (error) {
      userStore.setIsLoading(false);
      logger.log(error);
      switch (error.code) {
      case AppleAuthError.CANCELED:
        setSignInError('Canceled');
        break;
      case AppleAuthError.FAILED:
        setSignInError('Failed');
        break;
      case AppleAuthError.INVALID_RESPONSE:
        setSignInError('Invalid response');
        break;
      case AppleAuthError.NOT_HANDLED:
        setSignInError('Not handled');
        break;
      case AppleAuthError.UNKNOWN:
        setSignInError('Unknown error');
        break;
      default:
        setSignInError(error);
      }
    }
  };
  const renderSignInButton = () => (
    <TouchableOpacity
      style={{...styles.buttonOutline, ...customStyle}}
      onPress={_signIn}
    >
      <Icon
        style={{marginRight: 5, marginBottom: 5}}
        name="apple-logo"
        size={22}
      />
      <Text style={{...text.buttonblack, fontWeight: '600', width: '100%'}}>
        Continue with Apple
      </Text>
    </TouchableOpacity>
  );
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
  buttonOutline: {
    ...layout.btnOutline,
    borderWidth: 1.5,
    borderColor: colors.iconBlack,
    justifyContent: 'flex-end',
  },
});

export default inject('userStore')(observer(AppleSignInButton));
