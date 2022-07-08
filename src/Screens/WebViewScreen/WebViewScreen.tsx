import React from 'react';
import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

export const WebViewScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <WebView
      source={{uri: 'https://common.io/'}}
      containerStyle={[styles.container, {paddingTop: insets.top}]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});
