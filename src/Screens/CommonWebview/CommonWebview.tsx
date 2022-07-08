import {useRoute} from '@react-navigation/native';
import React from 'react';
import {get} from 'lodash';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {styles} from './styles';
import {firebase} from '~/Firebase';

export default function CommonWebview() {
  const route = useRoute();

  React.useEffect(() => {
    const provider = firebase.auth.GoogleAuthProvider;
    const authCredential = provider.credential('foo@bar.com', '123456');
  }, []);

  console.log('--route.params.credentials', route.params.credentials);
  const INJECTED_JAVASCRIPT = `(function() {
    // FOR DISABLING ZOOM
    const meta = document.createElement('meta'); meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
    document.getElementsByTagName('head')[0].appendChild(meta);
    window.postMessage(JSON.stringify({signInMethod: "${route.params.credentials?.providerId}", providerId: "${route.params.credentials?.providerId}", idToken: "${route.params.credentials?.token}", accessToken: "${route.params.credentials?.secret}", secret: "${route.params.credentials?.secret}"}), "*");
    true;
  })();`;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{uri: 'http://localhost:3000/?authCode=5a81Ec29e6'}}
        style={styles.webviewContainer}
        javaScriptEnabled
        // onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        // onNavigationStateChange={(event) => {
        //   if (event.url !== previousUrl) {
        //     if (event.url.includes(BASE_URL)) {
        //       setPreviousUrl(event.url);
        //     } else {
        //       Linking.canOpenURL(event.url)
        //         .then(async (supported) => {
        //           if (!supported) {
        //             setUrl(previousUrl);
        //           } else {
        //             return Linking.openURL(event.url);
        //           }
        //         })
        //         .catch(() => {
        //           setUrl(previousUrl);
        //         });
        //     }
        //   }
        // }}
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
