import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native';
import {colors} from '~/Theme';
import React, {useEffect} from 'react';
import {string, object, shape, func} from 'prop-types';

const Browser = ({navigation,
  route: {params: {url, onNavStateChange = null, onBack = null}}}) => {
  // not implementing custom back button to get the click cause this will cover android system back button
  useEffect(
    () =>
      navigation.addListener('blur', (e) => {
        onBack && onBack();
      }),
    [navigation],
  );
  return (
    <SafeAreaView flex={1}>
      <WebView onNavigationStateChange={onNavStateChange} source={{uri: url}} style={{backgroundColor: colors.grey4}} />
    </SafeAreaView>
  );
};

Browser.propTypes = {
  navigation: object,
  route: shape({
    params: shape({
      url: string,
      onNavStateChange: func,
      onBack: func,
    }),
  }),
};

export default Browser;
