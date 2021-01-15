import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Linking,
  DeviceEventEmitter,
  Text,
  I18nManager,
  UIManager,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {NavigationContainer, CommonActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
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
} from './src/Screens';
import CommonHome from './src/Components/Navigation/CommonHome';
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
import {func, bool, object, shape} from 'prop-types';
import logger from './src/Services/Logger';
import {fontSize} from './src/Theme/font';
import ProposalService from './src/Services/ProposalService';
import CommonService from './src/Services/CommonService';
import DiscussionService from './src/Services/DiscussionService';

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

const App = ({userStore, userListStore, bottomSheetStore, navigation}) => {
  const [onboarded, setOnboarded] = useState(false);
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

  useEffect(() => {
    const unsubscribeCommonUsers = userListStore.subscribeToAllUsers();
    return () => {
      unsubscribeCommonUsers && unsubscribeCommonUsers();
    };
  }, []);

  const notificationNavigation = async (remoteMessage) => {
    logger.log('remoteMessage -> ', remoteMessage);
    if (remoteMessage) {
      const [
        screenName,
        commonId,
        objectId,
        tabIndex = 0,
      ] = remoteMessage.data.path.split('/');
      const currCommon = await CommonService.getInstance().getCommonInfo(
        commonId,
      );
      // whitelist;approve/reject requestToJoin
      if (screenName === 'CommonProfile') {
        routing(screenName, {currCommon});
      }
      // new discussionMessage
      else if (screenName === 'Discussions') {
        const discussion = await DiscussionService.getInstance().getDiscussionInfo(
          objectId,
        );
        routing(screenName, {
          data: discussion,
          discussionId: objectId,
          commonId,
        });
      }
      // create/approve proposal
      else {
        const proposal = await ProposalService.getInstance().getProposalInfo(
          objectId,
        );
        routing(screenName, {
          proposalId: proposal.id,
          screenTitle: currCommon.name,
          commonBalance: currCommon.balance,
          proposalCardInfo: proposal,
          tabIndex: +tabIndex,
        });
      }
    }
  };

  // notification navigation
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      console.log('onNotificationOpenedApp remoteMessage', remoteMessage);
      notificationNavigation(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log('getInitialNotification remoteMessage', remoteMessage);
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
    navigationRef.current?.dispatch(actions);
  };

  useEffect(() => {
    DeepLinking.addScheme('common://');
    DeepLinking.addScheme('com.daostack.common://');
    DeepLinking.addScheme('https://app.common.io');
    //console.log('tkt DeepLinking', DeepLinking)

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
          userStore={userStore}
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
          name="CommonExplanation"
          component={CommonExplanation}
          options={({nav, route}) => ({
            headerTitle: 'Create a Common',
            headerBackTitleVisible: false,
            headerLeftContainerStyle: {marginLeft: 20},
            headerRightContainerStyle: {marginRight: 20},
            headerBackImage: () => (
              <Icon name="left-arrow" color={colors.black} size={32} />
            ),
          })}
        />
        <Stack.Screen
          name="ProposalScreen"
          component={ProposalScreen}
          options={({route}) => ({
            headerBackTitleVisible: false,
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
        <Stack.Screen name="PDFViwer" component={PDFViewer} />
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
      {bottomSheetStore.isVisible && <BottomSheetContainer />}
      <ToastView
        ref={hudRef}
        style={{backgroundColor: 'transparent'}}
        positionValue={160}
      />
    </NavigationContainer>
  );
};

App.propTypes = {
  userStore: shape({
    setIsLoading: func,
    setSignedInUser: func,
  }),
  userListStore: shape({
    subscribeToAllUsers: func,
  }),
  bottomSheetStore: shape({
    isVisible: bool,
    showBottomSheet: func,
  }),
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

export default inject(
  'userStore',
  'bottomSheetStore',
  'userListStore',
)(observer(App));
