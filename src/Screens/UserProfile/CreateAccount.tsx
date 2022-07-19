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
import GSignInButton from '~/Components/Auth/GSignInButton';
//import FacebookSignInButton from '~/Components/Auth/FacebookSignInButton';
//import PhoneSignInButton from '~/Components/Auth/PhoneSignInButton';
import {layout, text, colors} from '~/Theme';
import {observer} from 'mobx-react';
import AppleSignInButton from '~/Components/Auth/AppleSignInButton';
import AuthService from '~/Services/AuthService';
import {func, bool} from 'prop-types';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';
import {useStore} from '~/Util/hooks/useStore';
import {LINKS} from '~/Util/constants/links';

interface CreateAccountProps {
  onSignedIn: (
    isNewUser: {userInfo: IUserEntity; credentials: any},
    isSignedWithApple: boolean,
    isPhoneLogin: boolean,
  ) => void;
  hidePlaceholder: boolean;
  goToNextScreen: () => void;
  width: string | '';
}

const CreateAccount = (props: CreateAccountProps) => {
  const {onSignedIn, hidePlaceholder, goToNextScreen, width} = props;
  const authStore = useStore('authStore');
  const onSignIn = async (
    authInfo: {userInfo: IUserEntity; credentials: any},
    isSignedWithApple = false,
    isPhoneLogin = false,
  ) => {
    if (onSignedIn) {
      await onSignedIn(authInfo, isSignedWithApple, isPhoneLogin);
    }
    if (goToNextScreen) {
      setTimeout(goToNextScreen, 0);
    }
  };

  const isIos = Platform.OS === 'ios';
  const isLoginWithAppleEnabled = isIos
    ? AuthService.isAppleLoginSupported()
    : false;

  const renderError = () => {
    if (authStore.signInError) {
      let errorText = `${authStore.signInError.toString()} ${
        authStore.signInError.code ? authStore.signInError.code : ''
      }`;
      if (errorText.includes('reCAPTCHA') || errorText.includes('cancelled')) {
        errorText = 'Canceled';
      }
      return (
        <>
          <View style={styles.errorTriangle} />
          <View style={styles.messageContainer}>
            <Text style={styles.errorMessage}>{errorText}</Text>
          </View>
        </>
      );
    }
  };

  return (
    <View>
      {!hidePlaceholder && (
        <View style={styles.sectionContainer}>
          <Image
            source={require('~/Assets/Account/account-place-holder.png')}
          />
        </View>
      )}

      <Text style={styles.connectWithText}>Connect with</Text>

      <View style={{...styles.buttonContainer, width}}>
        {isIos && isLoginWithAppleEnabled && (
          <AppleSignInButton onSignIn={onSignIn} />
        )}

        <GSignInButton onSignIn={onSignIn} />
        {/*
        <FacebookSignInButton onSignIn={onSignIn} />

        <PhoneSignInButton onSignIn={onSignIn} /> */}
      </View>

      {renderError()}

      <View style={styles.termsOfUseContainer}>
        <Text style={styles.termsOfUseText}>
          By using Common you agree to the app’s
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(LINKS.TERMS)}>
          <Text style={styles.termsOfUseTextBtn}>terms of use</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

CreateAccount.propTypes = {
  onSignedIn: func,
  hidePlaceholder: bool,
  goToNextScreen: func,
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
  buttonContainer: {
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  messageContainer: {
    ...layout.messageError,
    ...layout.marginBottomM,
    marginTop: 5,
    alignSelf: 'center',
  },
  errorMessage: {
    color: colors.error,
  },
  errorTriangle: {
    ...layout.messageErrorTriangle,
    transform: [{rotate: '180deg'}],
    position: 'relative',
  },
  connectWithText: {
    ...text.smallGreyText,
  },
});

export default observer(CreateAccount);
