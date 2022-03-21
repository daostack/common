import {Text, View, StyleSheet, Platform} from 'react-native';
import React from 'react';
import {text, layout} from '~/Theme';
import {inject, observer} from 'mobx-react';
import CreateAccount from '../UserProfile/CreateAccount';
import {func, string} from 'prop-types';
import {uiStorePropTypes} from '~/Types/propTypes';

const LoginSheetScreen = ({uiStore, message = null, goToNextScreen}) => (
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
      <CreateAccount
        hidePlaceholder={true}
        onSignedIn={() => uiStore.bottomSheetStore.hideBottomSheet()}
        goToNextScreen={goToNextScreen}
        width={Platform.OS === 'ios' ? '90%' : '70%'}
      />
    </View>
  </View>
);

LoginSheetScreen.propTypes = {
  uiStore: uiStorePropTypes,
  message: string,
  goToNextScreen: func,
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
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
});

export default inject('uiStore')(observer(LoginSheetScreen));
