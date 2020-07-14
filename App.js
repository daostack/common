/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Linking,
  DeviceEventEmitter,
} from 'react-native';

import {ApolloProvider} from 'react-apollo';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {colors, text} from './src/Theme';
import AsyncStorage from '@react-native-community/async-storage';

import buffer from 'buffer';
global.Buffer = buffer.Buffer;

import {
  CommonProfile,
  Onboarding,
  UserProfile,
  HUDTest,
  MyWallet,
  CreateAccount,
  CreateCommon,
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
  RequestStep1,
  RequestStep2,
  RequestStep3,
  RequestStep4,
  FundingProposal,
  Discussions,
  DiscussionPost,
  ProposalScreen,
  PDFViewer,
  Browser,
  FullScreenCreationLoader,
} from './src/Screens';

import {ApolloClientConfig as client} from './src/Config';
import FirebaseService from './src/Services/FirebaseService';
import AuthService from './src/Services/AuthService';

import CommonHome from './src/Components/Navigation/CommonHome';
const Stack = createStackNavigator();
import {filterObjectByKeys} from './src/Util';
import WalletManager from './src/Util/WalletManager';
import {userInfoFields} from './src/Stores/UserStore';
import {observer, inject} from 'mobx-react';
import Icon from './src/Assets/iconfont/Icon';
import {auth, db} from './src/Firebase';
import KeyboardManager from 'react-native-keyboard-manager';

import BottomSheetContainer from './src/Components/BottomSheetContainer';
import Toast, {DURATION} from 'react-native-easy-toast';
import {CommonActions} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import NotificationService from './src/Services/NotificationService';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import DeepLinking from 'react-native-deep-linking';

import ArcService from './src/Services/ArcService';
import { BOTTOM_SHEET_TEMPLATES } from './src/Stores/BottomSheetStore';
if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setToolbarPreviousNextButtonEnable(true);
}

const App = ({userStore, bottomSheetStore, navigation}) => {
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const hudRef = useRef();
  const navigationRef = useRef();

  useEffect(() => {
    messaging()
      .registerDeviceForRemoteMessages()
      .then(() => {
        return messaging().requestPermission();
      })
      .then(settings => {
        // console.log('Notification settings', settings);
        if (settings) {
          return NotificationService.saveTokenToDatabase();
        }
      });

    return messaging().onTokenRefresh(token => {
      NotificationService.saveTokenToDatabase(token);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message Arrived', JSON.stringify(remoteMessage));
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

  // Deep & Dynamic Link
  const handleOpenURL = ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        return;
      }
      if (!DeepLinking.evaluateUrl(url)) {
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
    dynamicLinks().getInitialLink().then(link => {
      if (link) {
        handleOpenURL(link);
      } else {
        Linking.getInitialURL()
          .then((url) => {
            handleOpenURL({url});
          })
          .catch(err => err);
      }
    });

    return (() => {
      Linking.removeEventListener('url', handleOpenURL);
      foregroundLink();
    });
  }, []);

  // Login
  useEffect(() => {
    const subscribers = { authChangeUnsubscribe: null , userInfoChangeUnsubscribe: null};

    const onAuthStateChanged = async user => {
      console.log('AUTH STATE CHANGED: ', user?.uid, user?.email, user?.displayName);
      try {
        userStore.setIsLoading(true);
        if (user) {
          await AuthService.getInstance().loadMnemonic(user.uid);
          await WalletManager.init(user.uid);
          await ArcService.init();
          let appUser = await FirebaseService.getInstance().getUserById(
            user.uid,
          );
          const isNewUser = !appUser;
          if (isNewUser) {
            appUser = await AuthService.getInstance().createUserAndWallet(user);
            const manager = await WalletManager.getInstance();
            manager.createSmartContractWallet();
          }
          const allUserInfo = {
            ...user._user,
            ...appUser,
          };
          const filteredUser = filterObjectByKeys(allUserInfo, userInfoFields);
          userStore.setSignedInUser(filteredUser);
          if (subscribers.userInfoChangeUnsubscribe) {

            subscribers.userInfoChangeUnsubscribe();
          }
          subscribers.userInfoChangeUnsubscribe = await updateUser(user.uid);
        } else {
          if (subscribers.userInfoChangeUnsubscribe) {
            subscribers.userInfoChangeUnsubscribe();
          }
          userStore.setSignedInUser(null);
        }

        userStore.setIsLoading(false);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };

    subscribers.authChangeUnsubscribe = auth().onAuthStateChanged(onAuthStateChanged);

    const updateUser = async (uid) => {
      try {
        if (auth().currentUser === null) {
          return;
        }
        const unsubscribe = db.collection('users').doc(uid).onSnapshot(snapshot => {
          if (!snapshot.empty) {
            userStore.setSignedInUser(snapshot.data());
          }
        });
        return unsubscribe;
      } catch (error) {
        console.log('errror: ', error);
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
        console.log(e);
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
    <ApolloProvider client={client}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: styles.headerStyle,
            headerTitleStyle: styles.headerTitleStyle,
            headerBackTitleStyle: styles.headerTitleStyle,
            headerBackTitleVisible: false,
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
          <Stack.Screen name="CreateCommon" component={CreateCommon} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="CompleteAccount" component={CompleteAccount} />
          <Stack.Screen
            name="CommonProfile"
            component={CommonProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen name="CommonAgenda" component={CommonAgenda} />
          <Stack.Screen name="Profile" component={UserProfile} />
          <Stack.Screen
            name="CommonExplanation"
            component={CommonExplanation}
            options={({navigation, route}) => ({
              headerTitle: 'Common!',
              headerBackTitleVisible: false,
              headerLeftContainerStyle: {marginLeft: 20},
              headerRightContainerStyle: {marginRight: 20},
              headerBackImage: () => (
                <Image
                  source={require('./src/Assets/backArrow.png')}
                  style={{resizeMode: 'contain', width: 32, height: 32}}
                />
              ),
              headerRight: () => (
                <Image
                  source={require('./src/Assets/questionmark.png')}
                  style={{resizeMode: 'contain', width: 20, height: 20}}
                />
              ),
            })}
          />

          <Stack.Screen name="ProposalScreen" component={ProposalScreen} />
          <Stack.Screen
            name="RequestStep1"
            component={RequestStep1}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="RequestStep2"
            component={RequestStep2}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="RequestStep3"
            component={RequestStep3}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="RequestStep4"
            component={RequestStep4}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="CreateStep1"
            component={CreateStep1}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="CreateStep2"
            component={CreateStep2}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="CreateStep3"
            component={CreateStep3}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="CreateStep4"
            component={CreateStep4}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            name="Discussions"
            component={Discussions}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />

          <Stack.Screen
            name="FullScreenCreationLoader"
            component={FullScreenCreationLoader}
            options={({navigation, route}) => ({
              headerShown: false,
            })}
          />
          <Stack.Screen name="New Topic" component={DiscussionPost} />
          <Stack.Screen
            options={{
              title: 'Edit my profile',
            }}
            name="EditProfile"
            component={EditProfile}
          />
          <Stack.Screen name="PDFViwer" component={PDFViewer} />
          <Stack.Screen name="Browser" component={Browser} />
          <Stack.Screen
            options={{
              title: 'My wallet',
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
              title: null,
              headerBackTitleVisible: true,
            }}
            name="MyProposals"
            component={MyProposals}
          />
          <Stack.Screen
            options={{
              title: null,
              headerBackTitleVisible: true,
            }}
            name="MyCommons"
            component={MyCommons}
          />
          <Stack.Screen
            options={{
              title: null,
              headerBackTitleVisible: true,
            }}
            name="CommonMembers"
            component={CommonMembers}
          />
          <Stack.Screen
            options={{
              title: 'New proposal',
            }}
            name="FundingProposal"
            component={FundingProposal}
          />
        </Stack.Navigator>
        {bottomSheetStore.isVisible ? <BottomSheetContainer /> : null}
        <Toast
          ref={hudRef}
          style={{backgroundColor: 'transparent'}}
          positionValue={160}
        />
      </NavigationContainer>
    </ApolloProvider>
  );
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

  headerTitleStyle: {
    ...text.h4Black,
  },
});

export default inject('userStore', 'bottomSheetStore')(observer(App));
