import {StyleSheet, ActivityIndicator, View} from 'react-native';
import React from 'react';
import {layout, colors, sizeXXL} from '~/Theme';
import {string, bool} from 'prop-types';

const Loader = ({color, isBigger, isFullScreen = false}) => {
  let loaderStyle = isBigger
    ? {
        ...styles.loader,
        ...{transform: [{scale: 1.6}]},
      }
    : styles.loader;

  return (
    <View
      style={[
        styles.loaderContainer,
        isFullScreen ? styles.loaderFullScreenContainer : {},
      ]}>
      <ActivityIndicator
        size="large"
        color={color || colors.mainBlue}
        style={[loaderStyle, isFullScreen ? styles.loaderFullScreen : {}]}
      />
    </View>
  );
};

Loader.propTypes = {
  color: string,
  isBigger: bool,
  isFullScreen: bool,
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...layout.content,
    ...layout.flexStart,
    alignSelf: 'stretch',
  },
  loaderFullScreenContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },
  loaderFullScreen: {
    display: 'flex',
    flex: 1,
  },
  loader: {
    marginTop: sizeXXL,
    alignSelf: 'center',
  },
});

export default Loader;
