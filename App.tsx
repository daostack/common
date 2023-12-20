import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
// import auth from '@react-native-firebase/auth';
import notifee from '@notifee/react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer, CommonActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {inject, observer} from 'mobx-react';
import {object} from 'prop-types';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  I18nManager,
  Linking,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
//import DeepLinking from 'react-native-deep-linking';
// import Intercom from 'react-native-intercom';
import KeyboardManager from 'react-native-keyboard-manager';
//import validUrl from 'valid-url';
import {ErrorBoundary} from '~/Components/ErrorBoundary';
// import Loader from '~/Components/Loader';
//import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
// import {OnboardingForm} from '~/Screens/OnboardingForm/OnboardingForm';
// import UserInfoChecker from '~/Screens/UserProfile/UserInfoChecker';
import {rootStorePropTypes} from '~/Types/propTypes';
import {ASYNC_STORAGE_KEYS} from '~/Util/constants/asyncStorage';
import {AUTH_CODE} from '~/Util/constants/authCode';
import {
  //DYNAMIC_LINKS_SCREENS,
  //DYNAMIC_LINKS_SCREEN_PARAMS,
  //DYNAMIC_LINKS_TYPES,
  DYNAMIC_LINK_URI_WITH_SLASH,
} from '~/Util/constants/dynamicLinks';
import {useStore} from '~/Util/hooks/useStore';
import {getUrlPathWithEntityId} from '~/Util/stringUtil';
import Icon from './src/Assets/iconfont/Icon';
// import BottomSheetContainer from './src/Components/BottomSheetContainer';
import NotificationContainer from './src/Components/Notifications/NotificationContainer';
import {
  CommonWebview,
  // CreateAccount,
  // Onboarding,
  PhoneNumberStep1,
  UserProfile,
  VerificationStep2,
} from './src/Screens';
import logger from './src/Services/Logger';
import NotificationService from './src/Services/NotificationService';
import {colors} from './src/Theme';
import Toast from './src/Util/Toast';
import ToastView, {DURATION} from './src/Util/ToastView';
import UserService from '~/Services/UserService';
import {AUTH_PROVIDER} from '~/Util/constants/provider';
import {
  NOTIFICATIONS_CHANNEL_ID,
  NOTIFICATIONS_CHANNEL_NAME,
} from '~/Shared/notifications';

const Stack = createStackNavigator();
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
  const rootStore = useStore('rootStore');
  // const authStore = rootStore.authStore;
  // const userStore = rootStore.userStore;
  // const commonStore = rootStore.commonStore;
  // const proposalStore = rootStore.proposalStore;
  // const notificationStore = rootStore.notificationStore;
  // const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const appLoaderStore = rootStore.uiStore.appLoaderStore;
  // const bankAccountStore = rootStore.bankAccountStore;
  // const paymentStore = rootStore.paymentStore;

  const [loading, setLoading] = useState(true);
  const [notificationRouting, setNotificationRouting] = useState(null);
  //const [initialRouteName, setInitialRouteName] = useState('Onboarding');
  const hudRef = useRef<ToastView>(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.maxFontSizeMultiplier = 1.1;
  }, []);

  const routing = (screenName: string, params) => {
    const actions = CommonActions.navigate({
      name: screenName,
      params: params,
    });
    setNotificationRouting(actions);
  };

  const goToWebview = async (
    notificationData: Record<string, string> | undefined,
  ) => {
    try {
      const credentials = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.credentials,
      );
      const parsedCredentials = credentials && JSON.parse(credentials);

      if (
        credentials &&
        parsedCredentials?.providerId !== AUTH_PROVIDER.apple
      ) {
        const {accessToken, idToken} = await UserService.getAccessToken();
        NotificationService.saveTokenToDatabase();
        routing('CommonWebview', {
          credentials: {
            ...parsedCredentials,
            secret: accessToken || parsedCredentials.secret,
            token: idToken || parsedCredentials.idToken,
          },
          notificationData,
        });
      }
    } catch (err) {
      AsyncStorage.setItem(ASYNC_STORAGE_KEYS.credentials, '');
      Toast.error(
        'Your session has expired. Please log in again to use the app.',
      );
    }
  };

  useEffect(() => {
    (async () => {
      await NotificationService.requestUserPermission();
      await NotificationService.registerAppWithFCM();
      await notifee.requestPermission();
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (message) => {
      const channelId = await notifee.createChannel({
        id: NOTIFICATIONS_CHANNEL_ID,
        name: NOTIFICATIONS_CHANNEL_NAME,
      });
      // https://common.io/commons/156dd2b5-080d-4340-8694-910f53224280?item=c9a36f15-e83d-4a24-9cbe-910cd9e5cac8&message=fc8179ec-b016-4ab0-b740-f68cddd75b93
      await notifee.displayNotification({
        title: message.notification?.title,
        body: message.notification?.body,
        android: {
          channelId,
        },
        data: message.data,
      });
    });
    return unsubscribe;
  }, []);

  // Initialize Mobx Stores
  // useEffect(() => {
  // //   const unsubscribeUsers = userStore.subscribeToAllUsers();
  // //   const unsubscribeCommons = commonStore.subscribeToAllCommons();
  // //   let unsubscribeLoggedUserNotifications = null;
  // //   let unsubscribeProposals = null;
  // //   if (authStore.userInfo?.uid) {
  // //     unsubscribeProposals = proposalStore.subscribeToUserAllProposals(
  // //       authStore.userInfo?.uid,
  // //     );
  // //     unsubscribeLoggedUserNotifications =
  // //       notificationStore.subscribeToLoggedUserNotifications();
  // //   }
  // //   return () => {
  // //     unsubscribeUsers && unsubscribeUsers();
  // //     unsubscribeCommons && unsubscribeCommons();
  // //     unsubscribeProposals && unsubscribeProposals();
  // //     unsubscribeLoggedUserNotifications?.forEach(
  // //       (unsubscribeLoggedUserNotificationsBatch) =>
  // //         unsubscribeLoggedUserNotificationsBatch &&
  // //         unsubscribeLoggedUserNotificationsBatch(),
  // //     );
  // //   };
  // // }, [authStore.userInfo?.uid]);

  // Initialize To User Payments and Subscriptions
  // useEffect(() => {
  //   let unsubscribeToUserPayments = null;
  //   let unsubscribeToUserSubscriptions = null;
  //   if (authStore.userInfo?.uid) {
  //     unsubscribeToUserPayments = paymentStore.subscribeToUserPayments(
  //       authStore.userInfo?.uid,
  //     );
  //     unsubscribeToUserSubscriptions =
  //       paymentStore.subscribeToUserSubscriptions(authStore.userInfo?.uid);
  //   }

  //   return () => {
  //     unsubscribeToUserPayments && unsubscribeToUserPayments();
  //     unsubscribeToUserSubscriptions && unsubscribeToUserSubscriptions();
  //   };
  // }, [authStore.userInfo?.uid]);

  // Initialize Intercom chat
  // useEffect(() => {
  //   if (authStore.userInfo?.uid) {
  //     Intercom.registerIdentifiedUser({userId: authStore.userInfo?.uid});
  //   } else {
  //     Intercom.registerIdentifiedUser({userId: 'guest-' + Date.now()});
  //   }
  // }, [authStore.userInfo?.uid]);

  // Fetch Bank Account Details
  // useEffect(() => {
  //   let unsubscribeToBankAccount = null;
  //   if (authStore.userInfo?.uid) {
  //     bankAccountStore.subscribeToBankAccount(authStore.userInfo?.uid);
  //   }
  //   return () => {
  //     unsubscribeToBankAccount && unsubscribeToBankAccount();
  //   };
  // }, [authStore.userInfo?.uid]);

  const notificationNavigation = async (remoteMessage) => {
    appLoaderStore.showLoader();
    logger.log('remoteMessage -> ', remoteMessage);
    if (remoteMessage) {
      const [screenName, commonId, objectId, tabIndex = 0] =
        remoteMessage.data.path?.split('/');
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
          eventType: remoteMessage.data.type,
          commonId,
        });
      }
    }
    appLoaderStore.hideLoader();
  };

  // notification navigation
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      logger.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      logger.log('onNotificationOpenedApp remoteMessage', remoteMessage);
      // TODO: handle additional params
      // const channelId = await notifee.createChannel({
      //   id: NOTIFICATIONS_CHANNEL_ID,
      //   name: NOTIFICATIONS_CHANNEL_NAME,
      // });
      // // https://common.io/commons/156dd2b5-080d-4340-8694-910f53224280?item=c9a36f15-e83d-4a24-9cbe-910cd9e5cac8&message=fc8179ec-b016-4ab0-b740-f68cddd75b93
      // await notifee.displayNotification({
      //   title: remoteMessage.notification?.title,
      //   body: remoteMessage.notification?.body,
      //   android: {
      //     channelId,
      //   },
      //   data: remoteMessage.data,
      // });
      goToWebview(remoteMessage.data);
    });
  }, []);

  // HUD
  useEffect(() => {
    const showLisenter = DeviceEventEmitter.addListener(
      'HUD',
      (content, isLoading = false) => {
        hudRef?.current?.show(content, isLoading ? DURATION.FOREVER : 1500);
      },
    );
    const hidelisenter = DeviceEventEmitter.addListener('HUDHide', () => {
      hudRef?.current?.close();
    });
    return () => {
      showLisenter.remove();
      hidelisenter.remove();
    };
  }, []);

  // NetInfo
  useEffect(() => {
    let checkConnection = null;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isInternetReachable === false) {
        if (!checkConnection) {
          checkConnection = setInterval(() => {
            NetInfo.fetch().then((connectState) => {
              if (connectState.isInternetReachable === false) {
                Toast.error('Internet connection lost');
              } else {
                clearInterval(checkConnection);
              }
            });
          }, 5000);
        }
      } else {
        clearInterval(checkConnection);
      }
    });
    return () => unsubscribe();
  }, []);

  // Deep & Dynamic Link
  const handleOpenURL = useCallback(({url}) => {
    const [screenName, entityId] = getUrlPathWithEntityId({
      str: url.replace(DYNAMIC_LINK_URI_WITH_SLASH, ''),
      separator: '/',
    });

    if (screenName === ASYNC_STORAGE_KEYS.authCode && entityId === AUTH_CODE) {
      AsyncStorage.setItem(ASYNC_STORAGE_KEYS.authCode, entityId);
      Toast.success('Your email is confirmed. You can login now.');
    }
    /* else if (screenName === DYNAMIC_LINKS_TYPES.USER) {
      bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.USER_PROFILE_SHEET_SCREEN,
        {userId: entityId},
      );
    } else if (screenName && entityId) {
      routing(DYNAMIC_LINKS_SCREENS[screenName], {
        [DYNAMIC_LINKS_SCREEN_PARAMS[screenName]]: entityId,
      });
    } else if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          return;
        }
        if (!DeepLinking.evaluateUrl(url) && validUrl.isWebUri(url)) {
          logger.log(`Routing CommonWebview -> ${url}`);
          routing('Browser', {url: url});
        }
      });
    }*/
  }, []);

  useEffect(() => {
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

    Linking.addEventListener('url', handleOpenURL);
    return () => {
      Linking.removeEventListener('url', handleOpenURL);
      foregroundLink();
    };
  }, []);

  // Login
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        setLoading(false);
      } catch (e) {
        logger.log(e);
      }
    };

    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    crashlytics().log('App mounted.');
  }, []);

  if (loading) {
    return <View style={{flex: 1}} />;
  }

  return (
    <ErrorBoundary>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="UserProfile"
          screenOptions={{
            headerStyle: styles.headerStyle,
            headerTintColor: colors.black,
            headerBackImage: () => <Icon name="left-arrow" size={32} />,
          }}
          options={{headerShown: false, gestureEnabled: false}}>
          {/* <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{headerShown: false}}
          /> */}
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{headerShown: false, gestureEnabled: false}}
          />

          {/* <Stack.Screen
            name="OnboardingForm"
            component={OnboardingForm}
            options={{headerShown: false}}
          />
          <Stack.Screen name="CreateAccount" component={CreateAccount} /> */}

          <Stack.Screen
            name="CommonWebview"
            component={CommonWebview}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="PhoneNumber"
            component={PhoneNumberStep1}
            options={() => ({
              title: '',
              headerBackTitleVisible: false,
            })}
          />
          <Stack.Screen
            name="VerifyPhone"
            component={VerificationStep2}
            options={{
              headerBackTitleVisible: false,
              headerLeft: () => null,
              title: '',
            }}
          />
          {/* <Stack.Screen
            name="Profile"
            component={UserProfile}
            options={() => ({
              headerBackTitleVisible: false,
            })}
          />
        */}
        </Stack.Navigator>
        {/*
        <UserInfoChecker navigation={navigationRef} />
        {appLoaderStore.isLoading && (
          <Loader isBigger isFullScreen navigation={navigationRef} />
        )}
        {bottomSheetStore.isVisible && (
          <BottomSheetContainer navigation={navigationRef} />
        )} */}
        {notificationRouting && (
          <NotificationContainer
            notificationRouting={notificationRouting}
            setNotificationRouting={setNotificationRouting}
            navigation={navigationRef}
          />
        )}
        <ToastView
          ref={hudRef}
          style={{backgroundColor: 'transparent'}}
          positionValue={160}
        />
      </NavigationContainer>
    </ErrorBoundary>
  );
};

App.propTypes = {
  rootStore: rootStorePropTypes,
  navigation: object,
};

const styles = StyleSheet.create({
  headerStyle: {
    borderWidth: 0,
    borderBottomWidth: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  buttonRight: {
    marginRight: 20,
  },
  headerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default inject('rootStore')(observer(App));
