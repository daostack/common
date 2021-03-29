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
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {colors} from './src/Theme';
import AsyncStorage from '@react-native-community/async-storage';
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
  MonthlyContributionsList,
  MonthlyContribution,
  EditCommon,
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
import {BOTTOM_SHEET_TEMPLATES} from './src/Stores/BottomSheetStore';
import Toast from './src/Util/Toast';
import {object} from 'prop-types';
import logger from './src/Services/Logger';
import {fontSize} from './src/Theme/font';
import Loader from '~/Components/Loader';
import crashlytics from '@react-native-firebase/crashlytics';

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

const App = ({rootStore, navigation}) => {
  const authStore = rootStore.authStore;
  const userStore = rootStore.userStore;
  const commonStore = rootStore.commonStore;
  const proposalStore = rootStore.proposalStore;
  const notificationStore = rootStore.notificationStore;
  const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const appLoaderStore = rootStore.uiStore.appLoaderStore;

  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notificationRouting, setNotificationRouting] = useState(null);
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
      unsubscribeLoggedUserNotifications = notificationStore.subscribeToLoggedUserNotifications();
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
    const showLisenter = DeviceEventEmitter.addListener(
      'HUD',
      (content, isLoading = false) => {
        hudRef.current.show(content, isLoading ? DURATION.FOREVER : 1500);
      },
    );
    const hidelisenter = DeviceEventEmitter.addListener('HideHUD', () => {
      hudRef.current.close();
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
      bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.USER_PROFILE_SHEET_SCREEN,
        {userId: response.id},
      );
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
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTintColor: colors.black,
          headerBackImage: () => <Icon name="left-arrow" size={32} />,
        }}>
        {!onboarded && (
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{headerShown: false}}
          />
        )}
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
          name="CommonAgenda"
          component={CommonAgenda}
          options={({route}) => ({
            title: route.params.screenTitle,
            headerBackTitleVisible: false,
          })}
        />
        <Stack.Screen
          name="Profile"
          component={UserProfile}
          options={({route}) => ({
            headerBackTitleVisible: false,
          })}
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
          options={({nav, route}) => ({
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
            headerLeft: () => (
              <HeaderBackButton
                onPress={() =>
                  route?.params.fromNotificationItem
                    ? route?.params.commonId
                      ? rest?.navigation.replace('CommonProfile', {
                          commonId: route?.params.commonId,
                        })
                      : rest?.navigation.pop()
                    : navigation.pop()
                }
              />
            ),
            headerTitle: () => (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    ...fontSize(navigation?.route.params.subtitle ? 4 : 3),
                  }}>
                  {route?.params.title?.length > 20
                    ? route?.params.title.substring(0, 17) + '...'
                    : route?.params.title}
                </Text>

                {route?.params.subtitle && (
                  <Text style={{opacity: 0.4, ...fontSize(1)}}>
                    {route.params.subtitle}
                  </Text>
                )}
              </View>
            ),
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
          name="CreateStep1"
          component={CreateStep1}
          options={({nav, route}) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="CreateStep2"
          component={CreateStep2}
          options={({nav, route}) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="CreateStep3"
          component={CreateStep3}
          options={({nav, route}) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="CreateStep4"
          component={CreateStep4}
          options={({nav, route}) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="Discussions"
          component={Discussions}
          options={({nav, route}) => ({
            headerShown: false,
          })}
        />

        <Stack.Screen
          name="FullScreenCreationLoader"
          component={FullScreenCreationLoader}
          options={({nav, route}) => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="New Post"
          options={({nav, route}) => ({
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerLeft: null,
            headerRightContainerStyle: {marginRight: 20},
            headerRight: () => (
              <TouchableOpacity onPress={() => navigationRef.current.goBack()}>
                <Icon name="close" color={colors.black} size={20} />
              </TouchableOpacity>
            ),
          })}
          component={DiscussionPost}
        />
        <Stack.Screen
          options={({route}) => ({
            title: route.params.isFirstOpening ? false : 'Edit my profile',
          })}
          name="EditProfile"
          component={EditProfile}
        />
        <Stack.Screen name="PDFViewer" component={PDFViewer} />
        <Stack.Screen
          name="Browser"
          options={({nav, route}) => ({headerBackTitle: 'Back'})}
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
            title: route?.params.screenTitle,
            headerBackTitleVisible: false,
          })}
        />
        <Stack.Screen
          options={({route}) => ({
            title: route?.params.screenTitle,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
          })}
          name="FundingProposal"
          component={FundingProposal}
        />

        <Stack.Screen
          options={{
            title: 'Monthly Contributions',
            headerBackTitleVisible: false,
          }}
          name="MonthlyContributionsList"
          component={MonthlyContributionsList}
        />

        <Stack.Screen
          options={{
            headerBackTitleVisible: false,
          }}
          name="MonthlyContribution"
          component={MonthlyContribution}
        />
      </Stack.Navigator>
      {notificationRouting && (
        <NotificationContainer
          notificationRouting={notificationRouting}
          setNotificationRouting={setNotificationRouting}
          navigation={navigationRef}
        />
      )}
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
    },
  },
});

export default inject('rootStore')(observer(App));
