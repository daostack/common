import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native';
import React from 'react';
import { colors } from '../../Theme';

const Browser = ({ route, navigation }) => {
  const { url } = route.params;
  const navigationStateChangeHandler = route.params.onNavStateChange || null;
  const onBack = route.params.onBack || null;
  // not implementing custom back button to get the click cause this will cover android system back button
  React.useEffect(
    () => navigation.addListener('blur', (e) => {
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
