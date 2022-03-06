import {TouchableOpacity} from 'react-native';
import {layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {statusCodes} from '@react-native-community/google-signin';
import {observer} from 'mobx-react';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import {func, InferProps} from 'prop-types';
import {useStore} from '~/Util/hooks/useStore';

const props = {
  onSignIn: func.isRequired,
};
const FacebookSignInButton: React.FC<InferProps<typeof props>> = ({
  onSignIn,
}) => {
  const authStore = useStore('authStore');

  const _signIn = async () => {
    if (!authStore.userInfo) {
      try {
        authStore.setIsLoading(true);
        const userInfo = await AuthService.signInFacebook();
        if (onSignIn) {
          onSignIn(userInfo, true);
        }
        authStore.setSignInError(null);
      } catch (error: any) {
        authStore.setIsLoading(false);
        logger.log(error);
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
    }
  };

  return (
    <TouchableOpacity style={layout.signUpButton} onPress={_signIn}>
      <Icon name="facebook" size={50} />
    </TouchableOpacity>
  );
};

FacebookSignInButton.propTypes = props;

export default observer(FacebookSignInButton);
