import {useRoute} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {styles} from './styles';
import {AUTH_CODE} from '~/Util/constants/authCode';

export default function CommonWebview() {
  const route = useRoute();
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
        source={{uri: `https://web-staging.common.io/?authCode=${AUTH_CODE}`}}
        style={styles.webviewContainer}
        javaScriptEnabled
        originWhitelist={['*']}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        allowsFullscreenVideo={false}
      />
    </SafeAreaView>
  );
}
