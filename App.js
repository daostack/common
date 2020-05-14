/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Platform, View, Alert} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
} from './src/Screens';

import {ApolloClientConfig as client} from './src/Config';
import FirebaseService from './src/Services/FirebaseService';
import AuthService from './src/Services/AuthService';

// const firebaseService = new FirebaseService();
import CommonHome from './src/Components/Navigation/CommonHome';
// const authService = new AuthService();
// const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import {filterObjectByKeys} from './src/Util';
import WalletManager from './src/Util/WalletManager';
import {userInfoFields} from './src/Stores/UserStore';
import {observer, inject} from 'mobx-react';
import Icon from './src/Assets/iconfont/Icon';
import {auth} from './src/Firebase';
// import Toast from './src/Util/Toast';
import KeyboardManager from 'react-native-keyboard-manager';
import CommonCreationLoading from './src/Screens/CommonCreationLoading';
import messaging from '@react-native-firebase/messaging';
import NotificationService from './src/Services/NotificationService';

if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setToolbarPreviousNextButtonEnable(true);
}

const App = ({userStore, daoStore}) => {
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    messaging()
      .registerDeviceForRemoteMessages()
      .then(() => {
        return messaging().requestPermission();
      })
      .then(settings => {
        console.log('Notification settings', settings);
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
      Alert.alert('Foreground Message Arrived', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const onAuthStateChanged = async user => {
      try {
        userStore.setIsLoading(true);
        daoStore.setIsLoading(true);
        if (user) {
          await AuthService.getInstance().loadMnemonic(user.uid);
          await WalletManager.init(user.uid);
          let appUser = await FirebaseService.getInstance().getUserById(
            user.uid,
          );
          const isNewUser = !appUser;
          if (isNewUser) {
            appUser = await AuthService.getInstance().createUserAndWallet(user);
          }
          const allUserInfo = {
            ...user._user,
            ...appUser,
          };

          const filteredUser = filterObjectByKeys(allUserInfo, userInfoFields);
          userStore.setSignedInUser(filteredUser);
          if (isNewUser) {
          }
        } else {
          userStore.setSignedInUser(null);
        }

        userStore.setIsLoading(false);
      } catch (error) {
        Toast.error(error.toString());
      }
    };

    // TODO: this function is really misnamed :/
    const getDaos = async () => {
      try {
        const appUsers = await FirebaseService.getInstance().getUsers();
        console.log('users: ', appUsers);
        // TODO: unsubscribe somewhere!
        // const unsubscribe = db.collection('daos').onSnapshot(snapshot => {
        //   if (snapshot.empty) {
        //     return [];
        //   }
        //   let daosSnapshot = snapshot.docs.map(doc => {
        //     return {...{id: doc.id}, ...doc.data()};
        //   });
        //   console.log('daos: ', daosSnapshot);
        //   daoStore.setDaos(daosSnapshot);
        // });
        // console.log('DAOS: ', daosRes);
        // setDaos(daosRes);
      } catch (error) {
        console.log('errror: ', error);
      }
    };

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

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
    getDaos();
    checkOnboardingStatus();
    return subscriber;
  }, [daoStore, userStore]);

  console.log('onboarded: ', onboarded);
  console.log('daoStore DAOs: ', daoStore.daos);

  if (loading) {
    return <View style={{flex: 1}} />;
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
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
            name="CommonCreationLoading"
            component={CommonCreationLoading}
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
              title: 'Funding request',
            }}
            name="FundingProposal"
            component={FundingProposal}
          />
        </Stack.Navigator>
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

export default inject('userStore', 'daoStore')(observer(App));
