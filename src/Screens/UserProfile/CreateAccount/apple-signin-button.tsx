/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import {colors, text, layout} from '~/Theme';
import React from 'react';
import Icon from '~/Assets/iconfont/Icon';
import {observer} from 'mobx-react-lite';
import {useStore} from '~/Stores';

export const AppleSignInButton: React.FC<{
  customStyle: ViewStyle;
}> = observer(({customStyle}) => {
  const {authStore} = useStore();
  const isIos = Platform.OS === 'ios';
  const isLoginWithAppleEnabled = isIos
    ? authStore.isAppleLoginSupported()
    : false;
  if (!isLoginWithAppleEnabled) {
    return <></>;
  }

  const renderSignInButton = () => (
    <TouchableOpacity
      style={{...styles.buttonOutline, ...customStyle}}
      onPress={authStore.appleSignIn}>
      <Icon
        name="apple-logo"
        style={{marginRight: 5, marginBottom: 5}}
        size={22}
      />
      <Text style={{...text.buttonblack, fontWeight: '600', width: '100%'}}>
        Continue with Apple
      </Text>
    </TouchableOpacity>
  );
  const renderError = () => {
    if (authStore.error) {
      const errorText = `${authStore.error.toString()} ${
        authStore.error ? authStore.error : ''
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
});

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
