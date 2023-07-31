import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {SafeAreaView, BackHandler, Linking} from 'react-native';
import {WebView} from 'react-native-webview';
import NotificationService from '~/Services/NotificationService';
import {styles} from './styles';
import {webviewURL, webviewBaseUrl} from '~/Config';
import {WebviewActions} from '~/Util/constants';
import {WebviewLoader} from '~/Components/WebviewLoader';
import Toast from '~/Util/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEYS} from '~/Util/constants/asyncStorage';

export default function CommonWebview() {
  const route = useRoute();
  const webviewRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [url, setUrl] = useState(webviewURL);
  const [previousUrl, setPreviousUrl] = useState(webviewURL);
  const {credentials} = route.params as any;

  const INJECTED_JAVASCRIPT = `(function() {
    // FOR DISABLING ZOOM
    const meta = document.createElement('meta'); meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0');
    document.getElementsByTagName('head')[0].appendChild(meta);
    window.postMessage(JSON.stringify({signInMethod: "${credentials?.providerId}", providerId: "${credentials?.providerId}", idToken: "${credentials?.token}", accessToken: "${credentials?.secret}", secret: "${credentials?.secret}", rawNonce: "${credentials?.nonce}"}), "*");
    true;
  })();`;

  function handleBackButtonClick(): boolean {
    webviewRef.current?.goBack();
    return true;
  }

  React.useEffect(() => {
    NotificationService.saveTokenToDatabase();
  }, []);

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [handleBackButtonClick]);

  function onShouldStartLoadWithRequest(request) {
    // short circuit these

    // TODO: ADD include check
    if (
      !request.url ||
      request.url.startsWith('http') ||
      request.url.startsWith('/') ||
      request.url.startsWith('#') ||
      request.url.startsWith('javascript') ||
      request.url.startsWith('about:blank')
    ) {
      return true;
    }

    // blocked blobs
    if (request.url.startsWith('blob')) {
      return false;
    }

    // list of schemas we will allow the webview
    // to open natively
    if (
      request.url.startsWith('tel:') ||
      request.url.startsWith('mailto:') ||
      request.url.startsWith('maps:') ||
      request.url.startsWith('geo:') ||
      request.url.startsWith('sms:') ||
      request.url.startsWith('mailto:') ||
      request.url.startsWith('https://t.me/') ||
      request.url.startsWith('viber:') ||
      request.url.startsWith('skype:')
    ) {
      Linking.openURL(request.url).catch((er) => {
        __DEV__ && console.log(er);
      });
      return false;
    }

    // let everything else to the webview
    return true;
  }

  return (
    <SafeAreaView removeClippedSubviews={true} style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{uri: url}}
        style={styles.webviewContainer}
        javaScriptEnabled
        overScrollMode="never"
        allowsInlineMediaPlayback={false}
        originWhitelist={['*']}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        injectedJavaScriptForMainFrameOnly
        incognito={true}
        cacheEnabled={false}
        cacheMode={'LOAD_NO_CACHE'}
        allowsFullscreenVideo={false}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onNavigationStateChange={(event) => {
          if (isLoggedIn && event.url === webviewBaseUrl) {
            webviewRef.current?.goBack();
          }

          if (event.url !== previousUrl) {
            if (event.url.includes(webviewBaseUrl)) {
              setPreviousUrl(event.url);
            } else {
              Linking.canOpenURL(event.url)
                .then(async (supported) => {
                  if (!supported) {
                    setUrl(previousUrl);
                  } else {
                    return Linking.openURL(event.url);
                  }
                })
                .catch(() => {
                  setUrl(previousUrl);
                });
            }
          }
        }}
        onMessage={async (event) => {
          const webviewMessage = event?.nativeEvent.data;
          if (webviewMessage === WebviewActions.loginSuccess) {
            setIsLoggedIn(true);
          } else if (webviewMessage === WebviewActions.loginError) {
            Toast.error('Something went wrong');
            AsyncStorage.setItem(ASYNC_STORAGE_KEYS.credentials, '');
            navigation.goBack();
          } else if (webviewMessage === WebviewActions.logout) {
            AsyncStorage.setItem(ASYNC_STORAGE_KEYS.credentials, '');
            navigation.goBack();
          }
        }}
      />
      <WebviewLoader isLoggedIn={isLoggedIn} />
    </SafeAreaView>
  );
}
