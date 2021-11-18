import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {layout, text, colors} from '~/Theme';
import {observer} from 'mobx-react';
import {AppleSignInButton} from './apple-signin-button';
import {GoogleSignInButton} from './google-signin-button';

export const CreateAccountScreen: React.FC<{
  hidePlaceholder: boolean;
}> = observer(({hidePlaceholder}) => (
  <View>
    {!hidePlaceholder && (
      <View style={styles.sectionContainer}>
        <Image source={require('~/Assets/Account/account-place-holder.png')} />
      </View>
    )}
    {<AppleSignInButton customStyle={layout.marginBottomM} />}

    <GoogleSignInButton />

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
));

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
  googleSignInButton: {
    alignSelf: 'stretch',
    height: 56,
    borderWidth: 1,
    borderRadius: 28,
    borderStyle: 'solid',
    borderColor: colors.grey4,

    shadowOpacity: 0,
    shadowColor: colors.white,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 0,
    elevation: 3,
  },
});
