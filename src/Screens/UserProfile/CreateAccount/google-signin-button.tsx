import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors, text, layout} from '~/Theme';
import {observer} from 'mobx-react-lite';
import Icongoogle from '~/Assets/iconfont/Icongoogle';
import {useStore} from '~/Stores';

export const GoogleSignInButton: React.FC = observer(() => {
  const {authStore} = useStore();
  const renderSignInButton = () => (
    <TouchableOpacity
      style={styles.buttonOutline}
      onPress={authStore.googleSignIn}>
      <Icongoogle size={32} />
      <Text style={{...text.buttonblack, fontWeight: '600', width: '100%'}}>
        Continue with Google
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
