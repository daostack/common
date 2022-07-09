import {useRoute} from '@react-navigation/native';
import React from 'react';
import {get} from 'lodash';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {styles} from './styles';

export default function CommonWebview() {
  const route = useRoute();
  const {credentials} = route.params;

  const INJECTED_JAVASCRIPT = `(function() {
    // FOR DISABLING ZOOM
    const meta = document.createElement('meta'); meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
    document.getElementsByTagName('head')[0].appendChild(meta);
    window.postMessage(JSON.stringify({signInMethod: "${credentials?.providerId}", providerId: "${credentials?.providerId}", idToken: "${credentials?.token}", accessToken: "${credentials?.secret}", secret: "${credentials?.secret}"}), "*");
    true;
  })();`;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{uri: 'http://localhost:3000/?authCode=5a81Ec29e6'}}
        style={styles.webviewContainer}
        javaScriptEnabled
        originWhitelist={['*']}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onMessage={async (event) => {
          const action = get(
            JSON.parse(get(event, 'nativeEvent.data')),
            'action',
          );
          console.log('--action,', action);
        }}
      />
    </SafeAreaView>
  );
}
