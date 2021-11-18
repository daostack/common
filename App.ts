import React, {useState, useEffect, useRef} from 'react';
import {
  Platform,
  View,
  Linking,
  DeviceEventEmitter,
  Text,
  I18nManager,
  UIManager,
} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {CommonActions} from '@react-navigation/native';
import KeyboardManager from 'react-native-keyboard-manager';
import validUrl from 'valid-url';
import messaging from '@react-native-firebase/messaging';
import NotificationService from './src/Services/NotificationService';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import DeepLinking from 'react-native-deep-linking';
import {Toast} from '~/Components';
import logger from './src/Services/Logger';
import crashlytics from '@react-native-firebase/crashlytics';
import {ErrorBoundary} from '~/Components/ErrorBoundary';
import {useIntercom} from '~/Services/IntercomChat';
import {RootNavigator} from '~/navigation';
import {BOTTOM_SHEET} from '~/Screens/BottomSheetScreens';

I18nManager.allowRTL(false);
if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setToolbarPreviousNextButtonEnable(true);
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App = () => {
  const {
    uiStore: {bottomSheetStore, appLoaderStore},
  } = useState();
  const [loading, setLoading] = useState(true);

  //const [initialRouteName, setInitialRouteName] = useState('Onboarding');
  const hudRef = useRef();
  const navigationRef = useRef();

  useEffect(() => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.maxFontSizeMultiplier = 1.1;
  }, []);

  useEffect(
    () =>
      messaging().onTokenRefresh((token) => {
        NotificationService.saveTokenToDatabase(token);
      }),
    [],
  );

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      logger.log(`Foreground Message Arrived ${JSON.stringify(remoteMessage)}`);
    });
    return unsubscribe;
  }, []);

  // Initialize Intercom chat
  useIntercom();

  const notificationNavigation = async (remoteMessage) => {
    appLoaderStore.showLoader();
    logger.log('remoteMessage -> ', remoteMessage);
    if (remoteMessage) {
      const [
        screenName,
        commonId,
        objectId,
        tabIndex = 0,
      ] = remoteMessage.data.path?.split('/');
      // whitelist;approve/reject requestToJoin
      if (screenName === 'CommonProfile') {
        routing(screenName, {commonId});
      }
      // new discussionMessage
      else if (screenName === 'Discussions') {
        routing(screenName, {
          discussionId: objectId,
          commonId,
          fromNotificationItem: true,
        });
      }
      // create/approve proposal
      else {
        routing(screenName, {
          proposalId: objectId,
          tabIndex: +tabIndex,
          fromNotificationItem: true,
          commonId,
        });
      }
    }
    appLoaderStore.hideLoader();
  };

  // notification navigation
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp((remoteMessage) => {
      logger.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      logger.log('onNotificationOpenedApp remoteMessage', remoteMessage);
      notificationNavigation(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        logger.log('getInitialNotification remoteMessage', remoteMessage);
        notificationNavigation(remoteMessage);
      });
  }, []);

  // HUD
  useEffect(() => {
    const showListener = DeviceEventEmitter.addListener(
      'HUD',
      (content, isLoading = false) => {
        hudRef.current.show(content, isLoading ? DURATION.FOREVER : 1500);
      },
    );
    const hidelisenter = DeviceEventEmitter.addListener('HideHUD', () => {
      hudRef.current.close();
    });
    return () => {
      showListener.remove();
      hidelisenter.remove();
    };
  }, []);

  const netInfo = useNetInfo();
  useEffect(() => {
    if (!netInfo.isInternetReachable) {
      Toast.error('Internet connection lost');
    }
  }, [netInfo]);

  // Deep & Dynamic Link
  const handleOpenURL = ({url}) => {
    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          return;
        }
        if (!DeepLinking.evaluateUrl(url) && validUrl.isWebUri(url)) {
          logger.log(`Routing Browser -> ${url}`);
          routing('Browser', {url: url});
        }
      });
    }
  };

  const routing = (screenName, params) => {
    const actions = CommonActions.navigate({
      name: screenName,
      params: params,
    });
    setNotificationRouting(actions);
  };

  useEffect(() => {
    DeepLinking.addScheme('common://');
    DeepLinking.addScheme('com.daostack.common://');
    DeepLinking.addScheme('https://app.common.io');

    Linking.addEventListener('url', handleOpenURL);

    DeepLinking.addRoute('/common/:id', (response) => {
      routing('CommonProfile', {commonId: response.id});
    });

    DeepLinking.addRoute('/proposal/:id', (response) => {
      routing('ProposalScreen', {proposalId: response.id});
    });

    DeepLinking.addRoute('/user/:id', (response) => {
      bottomSheetStore.showBottomSheet(BOTTOM_SHEET.USER_PROFILE_SHEET_SCREEN, {
        userId: response.id,
      });
    });

    DeepLinking.addRoute('/discussion/:id', (response) => {
      routing('Discussions', {discussionId: response.id});
    });

    const foregroundLink = dynamicLinks().onLink(handleOpenURL);
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          handleOpenURL(link);
        } else {
          Linking.getInitialURL()
            .then((url) => {
              handleOpenURL({url});
            })
            .catch((err) => err);
        }
      });

    return () => {
      Linking.removeEventListener('url', handleOpenURL);
      foregroundLink();
    };
  }, []);

  useEffect(() => {
    crashlytics().log('App mounted.');
  }, []);

  if (loading) {
    return <View style={{flex: 1}} />;
  }

  return (
    <ErrorBoundary>
      <RootNavigator />
    </ErrorBoundary>
  );
};

export default App;
