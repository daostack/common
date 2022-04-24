import {TouchableOpacity} from 'react-native';
import {layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import {func, InferProps} from 'prop-types';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

const props = {
  onSignIn: func,
};
const PhoneSignInButton: React.FC<InferProps<typeof props>> = ({onSignIn}) => {
  const navigation = useNavigation();
  const _signIn = async () => {
    // @ts-expect-error
    navigation.navigate(NAVIGATION_SCREENS.PHONE_NUMBER_STEP_1, {onSignIn});
  };

  return (
    <TouchableOpacity style={layout.signUpButton} onPress={_signIn}>
      <Icon name="phone" size={50} />
    </TouchableOpacity>
  );
};

PhoneSignInButton.propTypes = props;

export default observer(PhoneSignInButton);
