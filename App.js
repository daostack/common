import 'mobx-react-lite/batchingForReactNative';
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
  CompleteAccount,
  EditProfile,
  UserProfileReadMode,
  NativeBridgeTests,
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
} from './src/Screens';
import UserService from './src/Services/UserService';
import AuthService from './src/Services/AuthService';
import CommonHome from './src/Components/Navigation/CommonHome';
import {filterObjectByKeys, prepareUserObject} from './src/Util';
import WalletManager from './src/Util/WalletManager';
import {userInfoFields} from './src/Stores/UserStore';
import {observer, inject} from 'mobx-react';
import Icon from './src/Assets/iconfont/Icon';
import {auth, db} from './src/Firebase';
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
import Cache from './src/Util/Cache';
import {func, bool, object, shape} from 'prop-types';
import logger from './src/Services/Logger';
import {fontSize} from './src/Theme/font';

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

const App = ({userStore, bottomSheetStore, navigation}) => {
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const hudRef = useRef();
  const navigationRef = useRef();

  useEffect(() => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.maxFontSizeMultiplier = 1.1;
  }, []);

  useEffect(() => messaging().onTokenRefresh((token) => {
    NotificationService.saveTokenToDatabase(token);
  }), []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      logger.log(`Foreground Message Arrived ${JSON.stringify(remoteMessage)}`);
    });
    return unsubscribe;
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
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        return;
      }
      if (!DeepLinking.evaluateUrl(url) && validUrl.isWebUri(url)) {
        logger.log(`Routing Browser -> ${url}`);
        routing('Browser', {url: url});
      }
    });
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
        {userId: response.id}
      );
    });

    const foregroundLink = dynamicLinks().onLink(handleOpenURL);
    dynamicLinks().getInitialLink().then((link) => {
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

    return (() => {
      Linking.removeEventListener('url', handleOpenURL);
      foregroundLink();
    });
  }, []);

  // Login
  useEffect(() => {
    const subscribers = {authChangeUnsubscribe: null , userInfoChangeUnsubscribe: null};

    const onAuthStateChanged = async (user) => {
      logger.log('AUTH STATE CHANGED:', user?.uid, user?.email, user?.displayName, user);
      try {
        // onAuthStateChanged method is called on many events, not only when the logged in user is changed.
        // In order to prevent unwanted rerendering we need to make some checks.
        if (!userStore.isLoginInProgressExists(user?.uid) && userStore.userInfo?.uid !== user?.uid) {
          if (user) {
            userStore.setIsLoading(true);
            userStore.addLoginInProgress(user?.uid);
            const providerId = user.providerData[0].providerId;
            await AuthService.getInstance().loadMnemonic(user.uid, providerId);

            let appUser = await Cache.get(user.uid);
            if (!appUser) {
              appUser = await UserService.getInstance().getUserById(
                user.uid,
              );
            }
            const isNewUser = !appUser;

            if (isNewUser) {
              const providerUserInfo = await AuthService.getInstance().getCurrentLoggedUser(providerId);
              const userInfo = {...user._user, ...{firstName: providerUserInfo.user.givenName, lastName: providerUserInfo.user.familyName}};
              appUser = await AuthService.getInstance().createUserAndWallet(userInfo);
            }

            const allUserInfo = {
              ...user._user,
              ...appUser,
            };

            NotificationService.saveTokenToDatabase();

            const filteredUser = filterObjectByKeys(allUserInfo, userInfoFields);
            userStore.setSignedInUser(filteredUser);
            userStore.removeLoginInProgress(filteredUser.uid);
            userStore.setIsLoading(false);

            // Create a wallet instance for the logged in user
            // NOTE: The walletManager has init and getInstance methods, which both create a WalletManager instance in some cases.
            // Please consider a refactoring on that flow.
            await WalletManager.init(user.uid);
            const manager = await WalletManager.getInstance();

            if (isNewUser) {
              manager.createSmartContractWallet();
            } else {
              manager.addressCheck(user.uid);
            }

            if (subscribers.userInfoChangeUnsubscribe) {
              subscribers.userInfoChangeUnsubscribe();
            }
            subscribers.userInfoChangeUnsubscribe = await updateUser(user.uid);
            userStore.setIsLoading(false);
          } else {
            if (subscribers.userInfoChangeUnsubscribe) {
              subscribers.userInfoChangeUnsubscribe();
            }
            userStore.setSignedInUser(null);
            userStore.setIsLoading(false);
          }
        }
      } catch (error) {
        logger.log(error);
        throw error;
      }

    };

    subscribers.authChangeUnsubscribe = auth().onAuthStateChanged(onAuthStateChanged);

    // The safeAddress of the user is created on the clouldfunctions and after that the user record in the firestore DB is updated with the actual safeAddres.
    // In order to keep the safeAddress information synced with our App, we need to do the follwing 2 things:
    // 1) Keep the userStore synced with the latest update for safeAddress
    // 2) Make sure the WalletManager has the safeAddress for newly created users
    // TBD:
    // 1) Can we call that method only if the user don't have safeAddres in the walletManager or userStore ???
    // 1) Can we unsubscribe for changes once the safeAddress is updated ???
    const updateUser = async (uid) => {
      try {
        if (auth().currentUser === null) {
          return;
        }
        const unsubscribe = db.collection('users').doc(uid).onSnapshot(async (snapshot) => {
          if (!snapshot.empty) {
            userStore.setSignedInUser(prepareUserObject(snapshot.data()));
          }

          /* WalletManager Inited before safeAddress created
          The safeAddress in wallet manager will be null
          We need to update it. */
          const manager = await WalletManager.getInstance();
          if (manager.safeAddress == null) {
            manager.safeAddress = snapshot.data().safeAddress;
          }

        });
        return unsubscribe;
      } catch (error) {
        logger.log(`errpr: ${JSON.stringify(error)} `);
      }
    };

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

    const unsubscribeAll = () => {
      subscribers.authChangeUnsubscribe();
      if (subscribers.userInfoChangeUnsubscribe) {
        subscribers.userInfoChangeUnsubscribe();
      }
    };

    checkOnboardingStatus();
    return unsubscribeAll;
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
        }}
      >
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
        <Stack.Screen name="CompleteAccount" component={CompleteAccount} />
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
          })}/>
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
                    ...fontSize(
                      navigation?.route.params.subtitle
                        ? 4
                        : 3
                    ),
                  }}
                >
                  {
                    (route?.params.title?.length > 20)
                      ? ((route?.params.title.substring(0, 17)) + '...')
                      : route?.params.title
                  }
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
        <Stack.Screen name="New Post"
          options={({nav, route}) => ({
            headerBackTitleVisible: false,
          })}
          component={DiscussionPost} />
        <Stack.Screen
          options={({route}) => ({
            title: route.params.isFirstOpening ? false : 'Edit my profile',
          })}
          name="EditProfile"
          component={EditProfile}
        />
        <Stack.Screen name="PDFViwer" component={PDFViewer} />
        <Stack.Screen name="Browser" component={Browser} />
        <Stack.Screen
          options={{
            title: 'My Profile',
            headerBackTitleVisible: false,
          }}
          name="MyWallet"
          component={MyWallet}
        />
        <Stack.Screen
          options={{
            title: 'NativeBridgeTests',
          }}
          name="NativeBridgeTests"
          component={NativeBridgeTests}
        />
        <Stack.Screen name="HUDTest" component={HUDTest} />
        <Stack.Screen
          name="UserProfileReadMode"
          component={UserProfileReadMode}
        />
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

export default inject('userStore', 'bottomSheetStore')(observer(App));
