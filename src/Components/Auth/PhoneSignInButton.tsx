import {TouchableOpacity} from 'react-native';
import {layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {observer} from 'mobx-react';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import {func, InferProps, shape} from 'prop-types';
import {useStore} from '~/Util/hooks/useStore';
import {WithNavigationRef} from '~/Types/navigation';

const props = {
  onSignIn: func,
  navigation: shape({
    navigate: func.isRequired,
  }).isRequired,
};
const PhoneSignInButton: React.FC<InferProps<typeof props>> = ({
  onSignIn,
  navigation,
}) => {
  //const authStore = useStore('authStore');
  const _signIn = async () => {
    navigation.navigate('PhoneNumber', {onSignIn});
  };

  return (
    <TouchableOpacity style={layout.signUpButton} onPress={_signIn}>
      <Icon name="phone" size={50} />
    </TouchableOpacity>
  );
};

PhoneSignInButton.propTypes = props;

export default observer(PhoneSignInButton);
