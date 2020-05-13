/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect, useRef} from 'react';
import {Image, StyleSheet, Platform, View} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors, text} from './src/Theme';
import AsyncStorage from '@react-native-community/async-storage';

import {
  CommonsList,
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

const firebaseService = new FirebaseService();
import CommonHome from './src/Components/Navigation/CommonHome';
const authService = new AuthService();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import {filterObjectByKeys, getTestEth} from './src/Util';
import WalletManager from './src/Util/WalletManager';
import {userInfoFields} from './src/Stores/UserStore';
import {observer, inject} from 'mobx-react';
import Icon from './src/Assets/iconfont/Icon';
import {auth, db} from './src/Firebase';
import Toast from './src/Util/Toast';
import KeyboardManager from 'react-native-keyboard-manager';
import CommonCreationLoading from './src/Screens/CommonCreationLoading';
import BottomSheetContainer from './src/Components/BottomSheetContainer';
import TransactionError from './src/Screens/TransactionError';


if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setToolbarPreviousNextButtonEnable(true);
}

const App = ({userStore, daoStore}) => {
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const errorSheetRef = useRef();

  const getTestEth = async address => {
    console.log('getting test eth for user: ', address);
    const req = await fetch(`https://us-central1-common-daostack.cloudfunctions.net/api/send-test-eth/${address}`);
    console.log('result from eth request: ', req);
  };

  const onAuthStateChanged = async user => {
    try {
      userStore.setIsLoading(true);
      daoStore.setIsLoading(true);
      if (user) {
        await AuthService.getInstance().loadMnemonic(user.uid);
        await WalletManager.init(user.uid);
        let appUser = await FirebaseService.getInstance().getUserById(user.uid);
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
      const manager = await WalletManager.getInstance();
      const address = await manager.getOwnerAccount();
      getTestEth(address);
    } catch (error) {
      console.log(error);
      //Toast.error(error.toString());
    }
  };

  const getDaos = async () => {
    try {
      const appUsers = await FirebaseService.getInstance().getUsers();
      console.log('users: ', appUsers);
      const unsubscribe = db.collection('daos').onSnapshot(snapshot => {
        if (snapshot.empty) {
          return [];
        }
        let daosSnapshot = snapshot.docs.map(doc => {
          return {...{id: doc.id}, ...doc.data()};
        });
        console.log('daos: ', daosSnapshot);
        daoStore.setDaos(daosSnapshot);
      });
      // console.log('DAOS: ', daosRes);
      // setDaos(daosRes);
    } catch (error) {
      console.log('errror: ', error);
    }
  };

  useEffect(() => {
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

    if (daoStore.isError) {
      console.log('daostore error', daoStore.isError)
      // errorSheetRef.current.snapTo(1);
    }
    getDaos();
    checkOnboardingStatus();
    return subscriber;
  }, [daoStore.isError]);

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
      <BottomSheetContainer ref={errorSheetRef} topSnapPoint={400}>
        <TransactionError/>
      </BottomSheetContainer>
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
