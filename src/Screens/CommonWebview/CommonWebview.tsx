import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {SafeAreaView, BackHandler, Linking} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import notifee, {EventType} from '@notifee/react-native';
import {WebView} from 'react-native-webview';
import {debounce} from 'lodash';
import {AUTH_PROVIDER} from '~/Util/constants/provider';
import NotificationService from '~/Services/NotificationService';
import UserService from '~/Services/UserService';
import {styles} from './styles';
import {authIFrameURL, webviewBaseUrl} from '~/Config';
import {WebviewActions} from '~/Util/constants';
import {WebviewLoader} from '~/Components/WebviewLoader';
import Toast from '~/Util/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_KEYS} from '~/Util/constants/asyncStorage';

const DARK_THEME = 'dark';

export default function CommonWebview() {
  const route = useRoute();
  const webviewRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [url, setUrl] = useState(`${webviewBaseUrl}/mobile-loader`);
  const [previousUrl, setPreviousUrl] = useState(
    `${webviewBaseUrl}/mobile-loader`,
  );

  const credentials = route?.params?.credentials;
  const notificationData = route?.params?.notificationData;

  const goBack = () => {
    navigation.navigate({
      name: 'UserProfile',
    });
  };

  const injectJavascript = (userCredentials) => {
    webviewRef.current &&
      webviewRef.current?.injectJavaScript(`(function() {
      // FOR DISABLING ZOOM
      document.addEventListener('DOMContentLoaded', function() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
      });
      window.postMessage(JSON.stringify({signInMethod: "${userCredentials?.providerId}", providerId: "${userCredentials?.providerId}", idToken: "${userCredentials.idToken}", accessToken: "${userCredentials.accessToken}", secret: "${userCredentials.accessToken}", rawNonce: "${userCredentials?.nonce}", customToken: "${userCredentials?.customToken}"}), "*");
      true;
    })();`);
  };

  React.useEffect(() => {
    (async () => {
      try {
        const storageCredentials = await AsyncStorage.getItem(
          ASYNC_STORAGE_KEYS.credentials,
        );
        const parsedCredentials = JSON.parse(
          storageCredentials as string,
        ) as any;

        if (
          storageCredentials &&
          parsedCredentials?.providerId !== AUTH_PROVIDER.apple
        ) {
          const response = await UserService.getAccessToken();
          if (response) {
            const {accessToken, idToken} = response;
            const customToken = await UserService.getCustomToken();
            injectJavascript({
              ...parsedCredentials,
              idToken,
              accessToken,
              customToken,
            });
          } else {
            const customToken = await UserService.getCustomToken();
            injectJavascript({
              ...parsedCredentials,
              idToken: parsedCredentials?.token,
              accessToken: parsedCredentials?.secret,
              customToken,
            });
          }
        } else if (credentials) {
          const customToken = await UserService.getCustomToken();
          injectJavascript({
            ...credentials,
            idToken: credentials?.token,
            accessToken: credentials?.secret,
            customToken,
          });
        } else {
          goBack();
        }
      } catch (err) {
        AsyncStorage.setItem(ASYNC_STORAGE_KEYS.credentials, '');
        Toast.error(
          'Your session has expired. Please log in again to use the app.',
        );
        goBack();
      }
    })();
  }, [credentials, webviewRef]);

  React.useEffect(() => {
    if (notificationData?.commonId && notificationData?.feedItemId) {
      const redirectTo = `/inbox?item=${notificationData?.feedItemId}`;
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
          const redirectTo = `/inbox?item=${detail.notification?.data?.feedItemId}`;
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
    <SafeAreaView
      removeClippedSubviews={true}
      style={isDarkTheme ? styles.containerDark : styles.container}>
      <WebView
        ref={webviewRef}
        source={{uri: url}}
        style={styles.webviewContainer}
        javaScriptEnabled
        overScrollMode="never"
        allowsInlineMediaPlayback={false}
        originWhitelist={['*']}
        // injectedJavaScript={isLoggedIn ? '' : INJECTED_JAVASCRIPT}
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
            goBack();
          } else if (webviewMessage === WebviewActions.logout) {
            AsyncStorage.setItem(ASYNC_STORAGE_KEYS.credentials, '');
            GoogleSignin.signOut();
            goBack();
          } else if (webviewMessage === DARK_THEME) {
            setIsDarkTheme(true);
          }
        }}
      />
      <WebviewLoader isLoggedIn={isLoggedIn} />
    </SafeAreaView>
  );
}
