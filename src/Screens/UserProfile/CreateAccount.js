import React from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';

import GSignInButton from '../../Components/Auth/GSignInButton';
import {layout, text, colors} from '../../Theme';
import {observer, inject} from 'mobx-react';
import AppleSignInButton from '../../Components/Auth/AppleSignInButton';
import AuthService from '../../Services/AuthService';

const CreateAccount = ({onSignedIn, hidePlaceholder}) => {
  const onSignIn = async userInfo => {
    if (onSignedIn) {
      onSignedIn(userInfo.additionalUserInfo.isNewUser);
    }
  };

  const isIos = Platform.OS === 'ios';
  const isLoginWithAppleEnabled = isIos
    ? AuthService.getInstance().isAppleLoginSupported()
    : false;

  return (
    <View>
      {!hidePlaceholder && (
        <View style={styles.sectionContainer}>
          <Image
            source={require('../../Assets/Account/account-place-holder.png')}
          />
        </View>
      )}

      {isIos && isLoginWithAppleEnabled ? (
        <AppleSignInButton
          customStyle={layout.marginBottomM}
          onSignIn={onSignIn}
        />
      ) : null}

      <GSignInButton style={styles.googleSignInButton} onSignIn={onSignIn} />

      <View style={styles.termsOfUseContainer}>
        <Text style={styles.termsOfUseText}>
          By using Common you agree to the app’s
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://common.io/tos')}>
          <Text style={styles.termsOfUseTextBtn}>terms of use</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },

  sectionContainer: {
    ...layout.content,
  },
  buttonsArea: {
    alignSelf: 'stretch',
    marginTop: 60,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginHorizontal: 24,
    backgroundColor: '#3cc7e1',
  },
  termsOfUseContainer: {
    ...layout.content,
    paddingHorizontal: 40,
  },
  termsOfUseText: {
    ...text.smallGreyText,
    ...text.greyText,
    textAlign: 'center',
  },
  termsOfUseTextBtn: {
    ...text.smallBlackText,
  },
});

export default inject('userStore')(observer(CreateAccount));
