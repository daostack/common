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
import {layout, text, colors} from '~/Theme';
import {observer} from 'mobx-react';
import AppleSignInButton from '~/Components/Auth/AppleSignInButton';
import AuthService from '~/Services/AuthService';
import {func, InferProps, bool} from 'prop-types';
import {IUserEntity} from '~/Firebase/Databasee/EntityTypes/IUserEntity';

const props = {
  onSignedIn: func,
  hidePlaceholder: bool,
  goToNextScreen: func,
};

const CreateAccount: React.FC<InferProps<typeof props>> = ({onSignedIn, hidePlaceholder, goToNextScreen}) => {
  const onSignIn = async (userInfo: IUserEntity, isSignedWithApple = false) => {
    if (onSignedIn) {
      await onSignedIn(
        userInfo.additionalUserInfo.isNewUser,
        isSignedWithApple,
      );
    }
    if (goToNextScreen) {
      setTimeout(goToNextScreen, 0);
    }
  };

  const isIos = Platform.OS === 'ios';
  const isLoginWithAppleEnabled = isIos
    ? AuthService.isAppleLoginSupported()
    : false;

  return (
    <View>
      {!hidePlaceholder && (
        <View style={styles.sectionContainer}>
          <Image
            source={require('~/Assets/Account/account-place-holder.png')}
          />
        </View>
      )}

      {isIos && isLoginWithAppleEnabled && (
        <AppleSignInButton
          customStyle={layout.marginBottomM}
          onSignIn={onSignIn}
        />
      )}

      <GSignInButton onSignIn={onSignIn} />

      <View style={styles.termsOfUseContainer}>
        <Text style={styles.termsOfUseText}>
          By using Common you agree to the app’s
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://common.io/tos')}>
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

export default observer(CreateAccount);
