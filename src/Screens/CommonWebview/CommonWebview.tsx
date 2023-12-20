import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {SafeAreaView, BackHandler, Linking} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {WebView} from 'react-native-webview';
import {debounce} from 'lodash';
import NotificationService from '~/Services/NotificationService';
import UserService from '~/Services/UserService';
import {styles} from './styles';
import {authIFrameURL, webviewBaseUrl} from '~/Config';
import {WebviewActions} from '~/Util/constants';
import notifee, {EventType} from '@notifee/react-native';
import {WebviewLoader} from '~/Components/WebviewLoader';
import Toast from '~/Util/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEYS} from '~/Util/constants/asyncStorage';

export default function CommonWebview() {
  const route = useRoute();
  const webviewRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [url, setUrl] = useState(`${webviewBaseUrl}/mobile-loader`);
  const [previousUrl, setPreviousUrl] = useState(
    `${webviewBaseUrl}/mobile-loader`,
  );
  const {credentials, notificationData} = route.params as any;

  const INJECTED_JAVASCRIPT = `(function() {
    // FOR DISABLING ZOOM
    document.addEventListener('DOMContentLoaded', function() {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    });
    window.postMessage(JSON.stringify({signInMethod: "${credentials?.providerId}", providerId: "${credentials?.providerId}", idToken: "${credentials?.token}", accessToken: "${credentials?.secret}", secret: "${credentials?.secret}", rawNonce: "${credentials?.nonce}"}), "*");
    true;
  })();`;

  React.useEffect(() => {
    if (notificationData?.commonId && notificationData?.feedItemId) {
      const redirectTo = `/commons/${notificationData?.commonId}?item=${notificationData?.feedItemId}`;
      webviewRef.current &&
        webviewRef.current?.injectJavaScript(`(function() {
          window.postMessage(JSON.stringify({redirectUrl: "${redirectTo}"}), "*");
          true;
      })();`);
    }
  }, [notificationData]);

  const handleGoBack = React.useCallback(
    debounce((): void => {
      webviewRef.current?.goBack();
    }, 500),
    [],
  );

  const handleBackButtonClick = React.useCallback(() => {
    handleGoBack();
    return true;
  }, []);

  React.useEffect(() => {
    NotificationService.saveTokenToDatabase();
    UserService.createRefreshToken();
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

  React.useEffect(() => {
    // TODO: Add handling open notifications
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          const redirectTo = `/commons/${detail.notification?.data?.commonId}?item=${detail.notification?.data?.feedItemId}`;
          webviewRef.current &&
            webviewRef.current?.injectJavaScript(`(function() {
              window.postMessage(JSON.stringify({redirectUrl: "${redirectTo}"}), "*");
            true;
           })();`);
          break;
      }
    });
  }, []);

  function onShouldStartLoadWithRequest(request) {
    // short circuit these
    if (
      !request.url ||
      request.url.startsWith(webviewBaseUrl) ||
      request.url.startsWith(authIFrameURL) ||
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

    if (!request.url.startsWith(webviewBaseUrl)) {
      Linking.canOpenURL(request.url).then(async (supported) => {
        if (supported) {
          return Linking.openURL(request.url);
        }
      });
      return false;
    }

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
        injectedJavaScript={isLoggedIn ? '' : INJECTED_JAVASCRIPT}
        injectedJavaScriptForMainFrameOnly
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
                  if (supported) {
                    Linking.openURL(event.url);
                  }
                  setUrl(previousUrl);
                  return;
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
            GoogleSignin.signOut();
            navigation.goBack();
          } else if (webviewMessage === WebviewActions.logout) {
            AsyncStorage.setItem(ASYNC_STORAGE_KEYS.credentials, '');
            GoogleSignin.signOut();
            navigation.goBack();
          }
        }}
      />
      <WebviewLoader isLoggedIn={isLoggedIn} />
    </SafeAreaView>
  );
}
