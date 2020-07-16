import {StyleSheet, ActivityIndicator, View} from 'react-native';
import React from 'react';
import {layout, colors, sizeXXL} from '../Theme';

const Loader = ({ color, isBigger }) => {
  let loaderStyle = isBigger ? {
    ...styles.loader, ...{ transform: [{ scale: 1.6 }] },
  } : styles.loader;

  return (
    <View styl={styles.loaderContainer}>
      <ActivityIndicator
        size="large"
        color={color || colors.mainBlue}
        style={loaderStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...layout.content,
    ...layout.flexStart,
    alignSelf: 'stretch',
  },
  loader: {
    marginTop: sizeXXL,
    alignSelf: 'center',
  },
});

export default Loader;
