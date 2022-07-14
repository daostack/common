import {TouchableOpacity} from 'react-native';
import {layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
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
    try {
      authStore.setIsLoading(true);
      const authInfo = await AuthService.signInFacebook();
      if (onSignIn) {
        onSignIn(authInfo);
      }
      authStore.setSignInError(null);
    } catch (error: any) {
      authStore.setIsLoading(false);
      logger.log(error);
      if (error.isCancelled) {
        authStore.setSignInError('Canceled');
      } else if (error.declinedPermissions) {
        authStore.setSignInError('Permission denied');
      } else {
        authStore.setSignInError(
          `Login success with permission: ${error.grantedPermissions.toString()}`,
        );
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
