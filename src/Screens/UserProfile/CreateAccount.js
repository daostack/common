import {observer} from 'mobx-react';
import {bool, func} from 'prop-types';
import React from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppleSignInButton from '~/Components/Auth/AppleSignInButton';
import GSignInButton from '~/Components/Auth/GSignInButton';
import AuthService from '~/Services/AuthService';
import logger from '~/Services/Logger';
import {colors, layout, text} from '~/Theme';

const CreateAccount = ({onSignedIn, hidePlaceholder}) => {
  const onSignIn = async (userInfo, isSignedWithApple = false) => {
    if (onSignedIn) {
     if (userInfo.additionalUserInfo.isNewUser) {
        const profile = userInfo.additionalUserInfo?.profile;
        const userPhotoUrl =
          profile?.picture ||
          `https://eu.ui-avatars.com/api/?background=7786ff&color=fff&name=${profile?.email}&rounded=true`;
        try {
          await AuthService.getInstance().createUser({
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email,
            photo: userPhotoUrl,
          });
        } catch (error) {
          logger.log('Error -> ', error);
        }
      }
      onSignedIn(userInfo.additionalUserInfo.isNewUser, isSignedWithApple);
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

      <GSignInButton style={styles.googleSignInButton} onSignIn={onSignIn} />

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
