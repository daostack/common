import {Text, View, StyleSheet} from 'react-native';

import React from 'react';
import {colors, text, layout} from '../../Theme';
import GSignInButton from '../../Components/GSignInButton';

const LoginSheetScreen = props => {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.sheetTitleStyle}>Be a part of Common</Text>
      <Text
        style={{
          ...styles.sheetTextStyle,
          ...layout.marginBottomXL,
        }}>
        To join this Common you need to be connected with your Google account
      </Text>

      <View style={layout.flexRow}>
        <GSignInButton style={styles.googleSignInButton} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    ...layout.content,
  },

  sheetTitleStyle: {
    ...text.centered,
    ...text.h3Black,
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
    elevation: 0,
  },

  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
});

export default LoginSheetScreen;
