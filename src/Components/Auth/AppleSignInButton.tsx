import {TouchableOpacity} from 'react-native';
import {layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {observer} from 'mobx-react';
import {AppleAuthError} from '@invertase/react-native-apple-authentication';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import {func, object, InferProps} from 'prop-types';
import {useStore} from '~/Util/hooks/useStore';

const props = {
  onSignIn: func,
  customStyle: object,
};

const AppleSignInButton: React.FC<InferProps<typeof props>> = ({onSignIn}) => {
  const authStore = useStore('authStore');
  const _signIn = async () => {
    try {
      // That loading status will be changed to false in the onAuthStateChanged method in App.js
      authStore.setIsLoading(true);
      const authInfo = await AuthService.signInApple();
      if (onSignIn) {
        onSignIn(authInfo, true);
      }
      authStore.setSignInError(null);
    } catch (error: any) {
      authStore.setIsLoading(false);
      logger.log(error);
      switch (error.code) {
        case AppleAuthError.CANCELED:
          authStore.setSignInError('Canceled');
          break;
        case AppleAuthError.FAILED:
          authStore.setSignInError('Failed');
          break;
        case AppleAuthError.INVALID_RESPONSE:
          authStore.setSignInError('Invalid response');
          break;
        case AppleAuthError.NOT_HANDLED:
          authStore.setSignInError('Not handled');
          break;
        case AppleAuthError.UNKNOWN:
          authStore.setSignInError('Unknown error');
          break;
        default:
          authStore.setSignInError(error);
      }
    }
  };

  return (
    <TouchableOpacity style={layout.signUpButton} onPress={_signIn}>
      <Icon
        style={{marginRight: 5, marginBottom: 5}}
        name="apple-logo"
        size={45}
      />
    </TouchableOpacity>
  );
};

AppleSignInButton.propTypes = props;

export default observer(AppleSignInButton);
