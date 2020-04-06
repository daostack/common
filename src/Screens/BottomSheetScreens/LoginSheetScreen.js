import {forwardRef} from 'react';
import {Text, View, StyleSheet} from 'react-native';

import React from 'react';
import {text, layout} from '../../Theme';
import GSignInButton from '../../Components/GSignInButton';

const LoginSheetScreen = props => {
  const contentStyle = {
    ...layout.content,
    ...layout.flexStart,
    ...styles.contentContainer,
  };
  return (
    <View style={contentStyle}>
      <Text style={styles.sheetTitleStyle}>Be a part of Common</Text>
      <Text
        style={{
          ...styles.sheetTextStyle,
          ...layout.marginBottomXL,
        }}>
        To join this Common you need to be connected with your Google account
      </Text>

      <GSignInButton />

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
  sheetTextStyle: {
    ...text.greyText,
    ...text.centered,
  },
});

export default LoginSheetScreen;
