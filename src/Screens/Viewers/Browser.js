import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native';
import {colors} from '../../Theme';
import React from 'react';

const Browser = ({route}) => {
  const url = route.params.url;
  return (
    <SafeAreaView flex={1}>
      <WebView source={{uri: url}} style={{backgroundColor: colors.grey4}} />
    </SafeAreaView>
  );
};

export default Browser;
