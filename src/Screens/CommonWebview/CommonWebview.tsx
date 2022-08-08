import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {styles} from './styles';
import {webviewURL} from '~/Config';
import {WebviewActions} from '~/Util/constants';
import {WebviewLoader} from '~/Components/WebviewLoader';
import Toast from '~/Util/Toast';

export default function CommonWebview() {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {credentials} = route.params as any;

  const INJECTED_JAVASCRIPT = `(function() {
    // FOR DISABLING ZOOM
    const meta = document.createElement('meta'); meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
    document.getElementsByTagName('head')[0].appendChild(meta);
    window.postMessage(JSON.stringify({signInMethod: "${credentials?.providerId}", providerId: "${credentials?.providerId}", idToken: "${credentials?.token}", accessToken: "${credentials?.secret}", secret: "${credentials?.secret}", rawNonce: "${credentials?.nonce}"}), "*");
    true;
  })();`;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{uri: webviewURL}}
        style={styles.webviewContainer}
        javaScriptEnabled
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        allowsFullscreenVideo={false}
        onMessage={async (event) => {
          const webviewMessage = event?.nativeEvent.data;
          if (webviewMessage === WebviewActions.loginSuccess) {
            setIsLoggedIn(true);
          } else if (webviewMessage === WebviewActions.loginError) {
            Toast.error('Something went wrong');
            navigation.goBack();
          } else if (webviewMessage === WebviewActions.logout) {
            navigation.goBack();
          }
        }}
      />
      <WebviewLoader isLoggedIn={isLoggedIn} />
    </SafeAreaView>
  );
}
