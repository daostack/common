import {TouchableOpacity} from 'react-native';
import {layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {statusCodes} from '@react-native-google-signin/google-signin';
import {observer} from 'mobx-react';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import {func, InferProps} from 'prop-types';
import {useStore} from '~/Util/hooks/useStore';

const props = {
  onSignIn: func,
};
const GSignInButton: React.FC<InferProps<typeof props>> = ({onSignIn}) => {
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
          authStore.setSignInError('Please, try again');
          GoogleSignin.signOut();
        }
      }
    }
  };

  return (
    <TouchableOpacity style={layout.signUpButton} onPress={_signIn}>
      <Icon name="google" size={50} />
    </TouchableOpacity>
  );
};

GSignInButton.propTypes = props;

export default observer(GSignInButton);
