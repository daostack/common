import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native';
import { colors } from '~/Theme';
import React from 'react';

const Browser = ({ route, navigation }) => {
  const url = route.params.url;
  const navigationStateChangeHandler = route.params.onNavStateChange || null;
  const onBack = route.params.onBack || null;
  // not implementing custom back button to get the click cause this will cover android system back button
  React.useEffect(
    () =>
      navigation.addListener('blur', e => {
        onBack && onBack();
      }),
    [navigation],
  );
  return (
    <SafeAreaView flex={1}>
      <WebView onNavigationStateChange={navigationStateChangeHandler} source={{ uri: url }} style={{ backgroundColor: colors.grey4 }} />
    </SafeAreaView>
  );
};

export default Browser;
