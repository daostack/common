import React, {useState, useEffect, useRef} from 'react';
import {rootStorePropTypes} from '~/Types/propTypes';
import {
  StyleSheet,
  Platform,
  View,
  Linking,
  DeviceEventEmitter,
  Text,
  I18nManager,
  UIManager,
  TouchableOpacity,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {NavigationContainer, CommonActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {colors} from './src/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Onboarding,
  UserProfile,
  HUDTest,
  MyWallet,
  CreateAccount,
  EditProfile,
  MyProposals,
  MyCommons,
  CommonMembers,
  CommonExplanation,
  CreateStep1,
  CreateStep2,
  CreateStep3,
  CreateStep4,
  RulesStep,
  IntroductionStep,
  ContributionStep,
  BillingDetailsStep,
  PaymentDetailsStep,
  FundingProposal,
  Discussions,
  DiscussionPost,
  ProposalScreen,
  PDFViewer,
  Browser,
  FullScreenCreationLoader,
  Billing,
  MonthlyContribution,
  EditCommon,
  ReceiveFunds,
  AddInvoicesScreen,
  PersonalContributionStep,
  PersonalPaymentDetailsStep,
  ChoosePaymentMethodStep,
  PhoneNumberStep1,
  VerificationStep2,
  FirstJoinCommon,
  VotesScreen,
  ContributionHistory,
  MonthlyContributionCharges,
  MakeContribution,
  ContributionPaymentDetails,
  UpdatePaymentDetails,
  CommonWebview,
} from './src/Screens';
import HomeTabNavigator from './src/Navigation/HomeTabNavigator';
import NotificationContainer from './src/Components/Notifications/NotificationContainer';
import {observer, inject} from 'mobx-react';
import Icon from './src/Assets/iconfont/Icon';
import KeyboardManager from 'react-native-keyboard-manager';
import validUrl from 'valid-url';
import BottomSheetContainer from './src/Components/BottomSheetContainer';
import ToastView, {DURATION} from './src/Util/ToastView';
import messaging from '@react-native-firebase/messaging';
import NotificationService from './src/Services/NotificationService';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import DeepLinking from 'react-native-deep-linking';
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import Toast from './src/Util/Toast';
import {object} from 'prop-types';
import logger from './src/Services/Logger';
import {fontSize} from './src/Theme/font';
import Loader from '~/Components/Loader';
import crashlytics from '@react-native-firebase/crashlytics';
import {ErrorBoundary} from '~/Components/ErrorBoundary';
import UserInfoChecker from '~/Screens/UserProfile/UserInfoChecker';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import Intercom from 'react-native-intercom';
import IntercomShowButton from '~/Components/IntercomChat/IntercomShowButton';
import {getUrlPathWithEntityId} from '~/Util/stringUtil';
import {
  DYNAMIC_LINKS_TYPES,
  DYNAMIC_LINKS_SCREENS,
  DYNAMIC_LINKS_SCREEN_PARAMS,
  DYNAMIC_LINK_URI_WITH_SLASH,
} from '~/Util/constants/dynamicLinks';
import {layout} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';
import {CommonTabNavigator} from '~/Navigation/CommonTabNavigator';
import {OnboardingForm} from '~/Screens/OnboardingForm/OnboardingForm';
import {WebViewScreen} from '~/Screens/WebViewScreen/WebViewScreen';

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
  const authStore = rootStore.authStore;
  const userStore = rootStore.userStore;
  const commonStore = rootStore.commonStore;
  const proposalStore = rootStore.proposalStore;
  const notificationStore = rootStore.notificationStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const appLoaderStore = rootStore.uiStore.appLoaderStore;
  const bankAccountStore = rootStore.bankAccountStore;
  const paymentStore = rootStore.paymentStore;

  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationRouting, setNotificationRouting] = useState(null);
  //const [initialRouteName, setInitialRouteName] = useState('Onboarding');
  const hudRef = useRef<ToastView>(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.maxFontSizeMultiplier = 1.1;
  }, []);

  useEffect(
    () =>
      messaging().onTokenRefresh(() => {
        NotificationService.saveTokenToDatabase();
      }),
    [],
  );

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      logger.log(`Foreground Message Arrived ${JSON.stringify(remoteMessage)}`);
    });
    return unsubscribe;
  }, []);

  // Initialize Mobx Stores
  useEffect(() => {
    const unsubscribeUsers = userStore.subscribeToAllUsers();
    const unsubscribeCommons = commonStore.subscribeToAllCommons();
    let unsubscribeLoggedUserNotifications = null;
    let unsubscribeProposals = null;
    if (authStore.userInfo?.uid) {
      unsubscribeProposals = proposalStore.subscribeToUserAllProposals(
        authStore.userInfo?.uid,
      );
      unsubscribeLoggedUserNotifications =
        notificationStore.subscribeToLoggedUserNotifications();
    }
    return () => {
      unsubscribeUsers && unsubscribeUsers();
      unsubscribeCommons && unsubscribeCommons();
      unsubscribeProposals && unsubscribeProposals();
      unsubscribeLoggedUserNotifications?.forEach(
        (unsubscribeLoggedUserNotificationsBatch) =>
          unsubscribeLoggedUserNotificationsBatch &&
          unsubscribeLoggedUserNotificationsBatch(),
      );
    };
  }, [authStore.userInfo?.uid]);

  // Initialize To User Payments and Subscriptions
  useEffect(() => {
    let unsubscribeToUserPayments = null;
    let unsubscribeToUserSubscriptions = null;
    if (authStore.userInfo?.uid) {
      unsubscribeToUserPayments = paymentStore.subscribeToUserPayments(
        authStore.userInfo?.uid,
      );
      unsubscribeToUserSubscriptions =
        paymentStore.subscribeToUserSubscriptions(authStore.userInfo?.uid);
    }

    return () => {
      unsubscribeToUserPayments && unsubscribeToUserPayments();
      unsubscribeToUserSubscriptions && unsubscribeToUserSubscriptions();
    };
  }, [authStore.userInfo?.uid]);

  // Initialize Intercom chat
  useEffect(() => {
    if (authStore.userInfo?.uid) {
      Intercom.registerIdentifiedUser({userId: authStore.userInfo?.uid});
    } else {
      Intercom.registerIdentifiedUser({userId: 'guest-' + Date.now()});
    }
  }, [authStore.userInfo?.uid]);

  // Fetch Bank Account Details
  useEffect(() => {
    let unsubscribeToBankAccount = null;
    if (authStore.userInfo?.uid) {
      bankAccountStore.subscribeToBankAccount(authStore.userInfo?.uid);
    }
    return () => {
      unsubscribeToBankAccount && unsubscribeToBankAccount();
    };
  }, [authStore.userInfo?.uid]);

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
  // useEffect(() => {
  //   // Assume a message-notification contains a "type" property in the data payload of the screen to open
  //   messaging().onNotificationOpenedApp((remoteMessage) => {
  //     logger.log(
  //       'Notification caused app to open from background state:',
  //       remoteMessage,
  //     );
  //     logger.log('onNotificationOpenedApp remoteMessage', remoteMessage);
  //     notificationNavigation(remoteMessage);
  //   });

  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then((remoteMessage) => {
  //       logger.log('getInitialNotification remoteMessage', remoteMessage);
  //       notificationNavigation(remoteMessage);
  //     });
  // }, []);

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
  const handleOpenURL = ({url}) => {
    const [screenName, entityId] = getUrlPathWithEntityId({
      str: url.replace(DYNAMIC_LINK_URI_WITH_SLASH, ''),
      separator: '/',
    });

    if (screenName === 'authCode' && entityId === '5a81Ec29e6') {
      AsyncStorage.setItem('authCode', entityId);
    } else if (screenName === DYNAMIC_LINKS_TYPES.USER) {
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
          logger.log(`Routing Browser -> ${url}`);
          routing('Browser', {url: url});
        }
      });
    }
  };

  const routing = (screenName: string, params) => {
    const actions = CommonActions.navigate({
      name: screenName,
      params: params,
    });
    setNotificationRouting(actions);
  };

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
          initialRouteName={'UserProfile'}
          screenOptions={{
            headerStyle: styles.headerStyle,
            headerTintColor: colors.black,
            headerBackImage: () => <Icon name="left-arrow" size={32} />,
          }}>
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UserProfile"
            component={UserProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OnboardingForm"
            component={OnboardingForm}
            options={{headerShown: false}}
          />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />

          <Stack.Screen
            name="CommonWebview"
            component={CommonWebview}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={UserProfile}
            options={() => ({
              headerBackTitleVisible: false,
            })}
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
        </Stack.Navigator>
        {notificationRouting && (
          <NotificationContainer
            notificationRouting={notificationRouting}
            setNotificationRouting={setNotificationRouting}
            navigation={navigationRef}
          />
        )}
        <UserInfoChecker navigation={navigationRef} />
        {appLoaderStore.isLoading && (
          <Loader isBigger isFullScreen navigation={navigationRef} />
        )}
        {bottomSheetStore.isVisible && (
          <BottomSheetContainer navigation={navigationRef} />
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
