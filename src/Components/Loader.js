import {StyleSheet, ActivityIndicator, View} from 'react-native';
import React from 'react';
import {inject, observer} from 'mobx-react';
import {layout, colors, sizeXXL} from '~/Theme';
import {string, bool, object} from 'prop-types';
import {rootStorePropTypes} from '~/Types/propTypes';
import {useTimeoutFn} from '../Util/hooks/useTimeoutFn';
import {showLoadingExpirationPopUp} from '../Util';

const TIMEOUT = 100000;

const Loader = ({color, isBigger, isFullScreen = false, rootStore, navigation}) => {
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;

  useTimeoutFn(isFullScreen ? callbackFn : null, TIMEOUT);

  let loaderStyle = isBigger
    ? {
        ...styles.loader,
        ...{transform: [{scale: 1.6}]},
      }
    : styles.loader;

  function callbackFn() {
      showLoadingExpirationPopUp(bottomSheetStore, "Oops... We couldn't load the app.", navigation);
  }

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
  rootStore: rootStorePropTypes,
  navigation: object,
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

export default inject('rootStore')(observer(Loader));
