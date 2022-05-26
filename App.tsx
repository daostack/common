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
  CommonProfile,
  Onboarding,
  UserProfile,
  HUDTest,
  MyWallet,
  CreateAccount,
  EditProfile,
  MyProposals,
  MyCommons,
  CommonAgenda,
  CommonMembers,
  CommonExplanation,
  CreateCommonGeneralInfo,
  CreateCommonRules,
  CreateCommonReview,
  RulesStep,
  IntroductionStep,
  ContributionStep,
  BillingDetailsStep,
  PaymentDetailsStep,
  FundingAllocation,
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
} from './src/Screens';
import CommonHome from './src/Components/Navigation/CommonHome';
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
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
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

    if (screenName === DYNAMIC_LINKS_TYPES.USER) {
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
        //await AuthService.getInstance().signOut();
        const isOnboarded = await AsyncStorage.getItem('onboarded');
        if (isOnboarded === 'true') {
          setOnboarded(true);
        }
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
          initialRouteName={onboarded ? 'CommonHome' : 'Onboarding'}
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
            name="CommonHome"
            component={CommonHome}
            options={{headerShown: false}}
            authStore={authStore}
          />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen
            name="CommonProfile"
            component={CommonProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={NAVIGATION_SCREENS.COMMON_AGENDA}
            component={CommonAgenda}
            options={({route}) => ({
              title: route?.params?.screenTitle,
              headerBackTitleVisible: false,
            })}
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
          <Stack.Screen
            name="EditCommon"
            component={EditCommon}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="CommonExplanation"
            component={CommonExplanation}
            options={() => ({
              headerTitle: 'Create a Common',
              headerBackTitleVisible: false,
              headerLeftContainerStyle: {marginLeft: 20},
              headerRightContainerStyle: {marginRight: 20},
              headerTitleAlign: 'center',
              headerBackImage: () => (
                <Icon name="left-arrow" color={colors.black} size={32} />
              ),
            })}
          />
          <Stack.Screen
            name="ProposalScreen"
            component={ProposalScreen}
            options={({route, ...rest}) => ({
              headerBackTitleVisible: false,
              headerTitleAlign: 'center',
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() =>
                    route?.params?.fromNotificationItem
                      ? route?.params.commonId
                        ? rest?.navigation.replace('CommonProfile', {
                            commonId: route?.params.commonId,
                          })
                        : rest?.navigation.pop()
                      : navigationRef?.current?.goBack()
                  }>
                  <Icon name="left-arrow" color={colors.black} size={32} />
                </TouchableOpacity>
              ),
              headerTitle: () => (
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      ...fontSize(route?.params?.subtitle ? 4 : 3),
                    }}>
                    {route?.params?.title?.length > 20
                      ? route?.params?.title.substring(0, 17) + '...'
                      : route?.params?.title}
                  </Text>

                  {route?.params?.subtitle && (
                    <Text style={{opacity: 0.4, ...fontSize(1)}}>
                      {route.params.subtitle}
                    </Text>
                  )}
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="VotesScreen"
            component={VotesScreen}
            options={({route}) => ({
              headerBackTitleVisible: false,
              headerTitleAlign: 'center',
              headerTitle: () => (
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      ...fontSize(route?.params?.subtitle ? 4 : 3),
                    }}>
                    {route?.params?.title?.length > 20
                      ? route?.params?.title.substring(0, 17) + '...'
                      : route?.params?.title}
                  </Text>

                  {route?.params?.subtitle && (
                    <Text style={{opacity: 0.4, ...fontSize(1)}}>
                      {route.params.subtitle}
                    </Text>
                  )}
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="AddInvoicesScreen"
            component={AddInvoicesScreen}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="RulesStep"
            component={RulesStep}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="IntroductionStep"
            component={IntroductionStep}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="PersonalContributionStep"
            component={PersonalContributionStep}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="PersonalPaymentDetailsStep"
            component={PersonalPaymentDetailsStep}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="FirstJoinCommon"
            component={FirstJoinCommon}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="ContributionStep"
            component={ContributionStep}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="BillingDetailsStep"
            component={BillingDetailsStep}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="PaymentDetailsStep"
            component={PaymentDetailsStep}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="CreateCommonGeneralInfo"
            component={CreateCommonGeneralInfo}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="CreateCommonRules"
            component={CreateCommonRules}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="CreateCommonReview"
            component={CreateCommonReview}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="Discussions"
            component={Discussions}
            options={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="FullScreenCreationLoader"
            component={FullScreenCreationLoader}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name={NAVIGATION_SCREENS.NEW_DISCUSSION}
            options={() => ({
              headerBackTitleVisible: false,
              headerTitleAlign: 'center',
              headerLeft: null,
              title: 'New Discussion',
              headerRight: () => (
                <TouchableOpacity
                  style={styles.buttonRight}
                  onPress={() => navigationRef?.current?.goBack()}>
                  <Icon name="close" color={colors.black} size={20} />
                </TouchableOpacity>
              ),
            })}
            component={DiscussionPost}
          />
          <Stack.Screen
            options={({route}) => ({
              title: route?.params?.isCompleteAccount
                ? false
                : 'Edit my profile',
            })}
            name="EditProfile"
            component={EditProfile}
          />
          <Stack.Screen name="PDFViewer" component={PDFViewer} />
          <Stack.Screen
            name="Browser"
            options={() => ({headerBackTitle: 'Back'})}
            component={Browser}
          />
          <Stack.Screen
            options={{
              title: 'My Profile',
              headerBackTitleVisible: false,
            }}
            name="MyWallet"
            component={MyWallet}
          />
          <Stack.Screen name="HUDTest" component={HUDTest} />
          <Stack.Screen
            options={{
              title: 'My Profile',
              headerBackTitleVisible: false,
            }}
            name="MyProposals"
            component={MyProposals}
          />
          <Stack.Screen
            options={{
              title: 'My Profile',
              headerBackTitleVisible: false,
            }}
            name="MyCommons"
            component={MyCommons}
          />
          <Stack.Screen
            name="CommonMembers"
            component={CommonMembers}
            options={({route}) => ({
              title: route?.params?.screenTitle,
              headerBackTitleVisible: false,
            })}
          />
          <Stack.Screen
            options={({route}) => ({
              title: route?.params?.screenTitle,
              headerBackTitleVisible: false,
              headerTitleAlign: 'center',
              headerRight: () => <IntercomShowButton />,
            })}
            name="FundingAllocation"
            component={FundingAllocation}
          />

          <Stack.Screen
            options={{
              title: 'Billing',
              headerBackTitleVisible: false,
              headerRight: () => <IntercomShowButton />,
            }}
            name="Billing"
            component={Billing}
          />
          <Stack.Screen
            options={() => ({
              title: '',
              headerBackTitleVisible: false,
              headerRight: () => (
                <TouchableOpacity
                  style={styles.buttonRight}
                  onPress={() => navigationRef?.current?.goBack()}>
                  <Icon name="close" color={colors.black} size={20} />
                </TouchableOpacity>
              ),
            })}
            name="ChoosePaymentMethodStep"
            component={ChoosePaymentMethodStep}
          />
          <Stack.Screen
            options={{
              title: 'My Contributions',
              headerBackTitleVisible: false,
              headerRight: () => <IntercomShowButton />,
            }}
            name={NAVIGATION_SCREENS.MONTHLY_CONTRIBUTION_CHARGES}
            component={MonthlyContributionCharges}
          />

          <Stack.Screen
            options={{
              headerBackTitleVisible: false,
              headerRight: () => (
                <View style={styles.headerButtonContainer}>
                  <IntercomShowButton />
                  <TouchableOpacity
                    style={[[styles.buttonRight, layout.marginLeftS]]}
                    onPress={() => navigationRef.current.goBack()}>
                    <Icon name="close" color={colors.black} size={20} />
                  </TouchableOpacity>
                </View>
              ),
            }}
            name={NAVIGATION_SCREENS.CONTRIBUTION_HISTORY}
            component={ContributionHistory}
          />

          <Stack.Screen
            options={{
              headerBackTitleVisible: false,
              headerRight: () => (
                <View style={styles.headerButtonContainer}>
                  <IntercomShowButton />
                  <TouchableOpacity
                    style={[[styles.buttonRight, layout.marginLeftS]]}
                    onPress={() => navigationRef.current.goBack()}>
                    <Icon name="close" color={colors.black} size={20} />
                  </TouchableOpacity>
                </View>
              ),
            }}
            name={NAVIGATION_SCREENS.MAKE_CONTRIBUTION}
            component={MakeContribution}
          />

          <Stack.Screen
            options={{
              headerBackTitleVisible: false,
              headerRight: () => (
                <View style={styles.headerButtonContainer}>
                  <IntercomShowButton />
                  <TouchableOpacity
                    style={[[styles.buttonRight, layout.marginLeftS]]}
                    onPress={() => navigationRef.current.goBack()}>
                    <Icon name="close" color={colors.black} size={20} />
                  </TouchableOpacity>
                </View>
              ),
            }}
            name={NAVIGATION_SCREENS.CONTRIBUTION_PAYMENT_DETAILS}
            component={ContributionPaymentDetails}
          />

          <Stack.Screen
            options={{
              headerBackTitleVisible: false,
              headerRight: () => (
                <View style={styles.headerButtonContainer}>
                  <IntercomShowButton />
                  <TouchableOpacity
                    style={[[styles.buttonRight, layout.marginLeftS]]}
                    onPress={() => navigationRef.current.goBack()}>
                    <Icon name="close" color={colors.black} size={20} />
                  </TouchableOpacity>
                </View>
              ),
            }}
            name={NAVIGATION_SCREENS.UPDATE_PAYMENT_DETAILS}
            component={UpdatePaymentDetails}
          />

          <Stack.Screen
            options={{
              headerBackTitleVisible: false,
            }}
            name="MonthlyContribution"
            component={MonthlyContribution}
          />
          <Stack.Screen
            options={{
              title: 'Receive funds',
              headerBackTitleVisible: false,
              headerRight: () => <IntercomShowButton />,
            }}
            name="ReceiveFunds"
            component={ReceiveFunds}
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
