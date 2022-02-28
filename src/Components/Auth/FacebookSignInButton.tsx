import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {statusCodes} from '@react-native-community/google-signin';
import {observer} from 'mobx-react';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import {func, InferProps} from 'prop-types';
import {useStore} from '~/Util/hooks/useStore';

const props = {
  onSignIn: func,
};
const FacebookSignInButton: React.FC<InferProps<typeof props>> = ({
  onSignIn,
}) => {
  const authStore = useStore('authStore');
  const _signIn = async () => {
    try {
      // That loading status will be changed to false in the onAuthStateChanged method in App.js
      authStore.setIsLoading(true);
      const userInfo = await AuthService.signIn();
      if (onSignIn) {
        onSignIn(userInfo);
      }
      authStore.setSignInError(null);
    } catch (error: any) {
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
      <Icon name="facebook" size={50} />
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
    <>
      {renderError()}
      {renderSignInButton()}
    </>
  );
};

FacebookSignInButton.propTypes = props;

const styles = StyleSheet.create({
  messageContainer: {
    ...layout.messageError,
    ...layout.marginBottomM,
  },
  errorMessage: {
    color: colors.error,
  },
  buttonOutline: {
    alignSelf: 'center',
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1,
    shadowRadius: 15,
    borderRadius: 100,
    padding: 10,
  },
});

export default observer(FacebookSignInButton);
