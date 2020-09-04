import { Text, View, StyleSheet } from 'react-native';

import React from 'react';
import { colors, text, layout } from '~/Theme';
import { inject, observer } from 'mobx-react';
import { BOTTOM_SHEET_TEMPLATES } from '~/Stores/BottomSheetStore';
import CreateAccount from '../UserProfile/CreateAccount';

const LoginSheetScreen = ({ bottomSheetStore, ...props }) => {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sheetTitleStyle}>Be a part of Common</Text>
      <Text
        style={{
          ...styles.sheetTextStyle,
          ...layout.marginBottomXL,
        }}>
        {props.message ? props.message : 'Connect your account to join this Common'}
      </Text>

      <View style={layout.flexRow}>
        <CreateAccount hidePlaceholder={true} onSignedIn={() => bottomSheetStore.hideBottomSheet(BOTTOM_SHEET_TEMPLATES.LOGIN_SHEET_SCREEN)} />
      </View>

      {/**
      <View style={layout.flexRow}>
        <GSignInButton style={styles.googleSignInButton} onSignIn={() => bottomSheetStore.hideBottomSheet(BOTTOM_SHEET_TEMPLATES.LOGIN_SHEET_SCREEN)} />
      </View>

      <View style={layout.paddingHorizontalXL}>
        <Text
          style={{
            ...styles.sheetTextStyle,
            ...layout.marginTopL,
          }}>
          By clicking next you are accepting the Common app terms of use
        </Text>
      </View>
      */}
    </View>
  );
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


