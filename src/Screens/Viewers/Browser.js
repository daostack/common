import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native';
import {colors} from '../../Theme';
import React from 'react';

const Browser = ({route, navigation}) => {
  const url = route.params.url;
  const navigationStateChangeHandler = route.params.onNavStateChange || null;
  return (
    <SafeAreaView flex={1}>
      <WebView onNavigationStateChange={navigationStateChangeHandler} source={{uri: url}} style={{backgroundColor: colors.grey4}} />
    </SafeAreaView>
  );
};

export default Browser;
