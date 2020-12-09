import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import {colors, text, layout} from '~/Theme';
import {inject, observer} from 'mobx-react';
import CreateAccount from '../UserProfile/CreateAccount';
import {string, func, shape} from 'prop-types';

const LoginSheetScreen = ({bottomSheetStore, message = null}) => (
  <View style={styles.contentContainer}>
    <Text style={styles.sheetTitleStyle}>Be a part of Common</Text>
    <Text
      style={{
        ...styles.sheetTextStyle,
        ...layout.marginBottomXL,
      }}>
      {message || 'Connect your account to join this Common'}
    </Text>

    <View style={layout.flexRow}>
      <CreateAccount hidePlaceholder={true} onSignedIn={() => bottomSheetStore.hideBottomSheet()} />
    </View>
  </View>
);

LoginSheetScreen.propTypes = {
  bottomSheetStore: shape({
    hideBottomSheet: func,
  }),
  message: string,
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  sheetTitleStyle: {
    ...text.centered,
    ...text.h2Black,
    ...layout.marginTopM,
  },

  googleSignInButton: {
    alignSelf: 'stretch',
    height: 56,
    borderWidth: 1,
    borderRadius: 28,
    borderStyle: 'solid',
    borderColor: '#eeeeee',

    shadowOpacity: 0,
    shadowColor: colors.white,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 0,
    elevation: 3,
  },

  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
});

export default inject('bottomSheetStore')(observer(LoginSheetScreen));


