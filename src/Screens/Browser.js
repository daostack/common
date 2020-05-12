import {WebView} from 'react-native-webview';
import {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {colors, text, layout} from '../Theme';
import React from 'react';

const Browser = ({props, route, navigation}) => {
  const url = route.params.url;
  return (
    <SafeAreaView flex={1}>
      <WebView source={{uri: url}} style={{backgroundColor: colors.grey4}} />
    </SafeAreaView>
  );
};

export default Browser;
