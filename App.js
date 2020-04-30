/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Platform} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors, text} from './src/Theme';
import AsyncStorage from '@react-native-community/async-storage';

import {
  CommonsList,
  CommonProfile,
  UserProfile,
  HUDTest,
  MyWallet,
  CreateAccount,
  CompleteAccount,
  EditProfile,
  UserProfileReadMode,
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
} from './src/Screens';

import {ApolloClientConfig as client} from './src/Config';
import FirebaseService from './src/Services/FirebaseService';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import {filterObjectByKeys} from './src/Util';
import {userInfoFields} from './src/Stores/UserStore';
import {observer, inject} from 'mobx-react';
import Icon from './src/Assets/iconfont/Icon';
import {auth} from './src/Firebase';
import Toast from './src/Util/Toast';
import KeyboardManager from 'react-native-keyboard-manager';

if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setToolbarPreviousNextButtonEnable(true);
}

const CommonHome = () => {
  return (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'My feed') {
            return (
              <Image
                source={require('./src/Assets/feed.png')}
                style={{
                  resizeMode: 'contain',
                  width: 24,
                  height: 24,
                  tintColor: focused ? colors.mainBlue : '#92A2B5',
                }}
              />
            );
          } else if (route.name === 'Explore') {
            return (
              <Image
                source={require('./src/Assets/commons.png')}
                style={{
                  resizeMode: 'contain',
                  width: 24,
                  height: 24,
                  tintColor: focused ? colors.mainBlue : '#92A2B5',
                }}
              />
            );
          } else {
            return (
              <Image
                source={require('./src/Assets/accountSelected.png')}
                style={{
                  resizeMode: 'contain',
                  width: 20,
                  height: 20,
                  tintColor: focused ? colors.mainBlue : '#92A2B5',
                }}
              />
            );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: colors.mainBlue,
      }}>
      {/*<Tab.Screen name="Test" component={NativeBridgeTests} />*/}
      <Tab.Screen name="My feed" component={UserProfileReadMode} />
      <Tab.Screen name="Explore" component={CommonsList} />
      <Tab.Screen name="Profile" component={UserProfile} />
      <Tab.Screen name="FundingProposal" component={FundingProposal} />
    </Tab.Navigator>
  );
};

const App = ({userStore}) => {
  const [setOnboarded] = useState();

  const onAuthStateChanged = async user => {
    try {
      userStore.setIsLoading(true);
      if (user) {
        const appUser = await FirebaseService.getInstance().getUserById(
          user.uid,
        );

        const allUserInfo = {
          ...user._user,
          ...appUser,
        };

        const filteredUser = filterObjectByKeys(allUserInfo, userInfoFields);
        userStore.setSignedInUser(filteredUser);
      } else {
        userStore.setSignedInUser(null);
      }
      userStore.setIsLoading(false);
    } catch (error) {
      Toast.error(error);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    const checkOnboardingStatus = async () => {
      try {
        const isOnboarded = await AsyncStorage.getItem('onboarded');
        if (isOnboarded === 'true') {
          setOnboarded(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    checkOnboardingStatus();
    return subscriber;
  });

  return (
    <ApolloProvider client={client}>
      {/**
      <NavigationContainer>
        <Stack.Navigator>
          {!onboarded ? (
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{headerShown: false}}
            />
          ) : (
            <Stack.Screen
              name="CommonHome"
              component={CommonHome}
              options={{headerShown: false}}
            />
          )}
          <Stack.Screen name="CommonProfile" component={CommonProfile} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="CompleteAccount" component={CompleteAccount} />
        </Stack.Navigator>
      </NavigationContainer>
      */}
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
          <Stack.Screen
            name="CommonHome"
            component={CommonHome}
            options={{headerShown: false}}
          />
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
            options={{
              title: 'Edit my profile',
            }}
            name="EditProfile"
            component={EditProfile}
          />
          <Stack.Screen name="CompleteAccount" component={CompleteAccount} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen
            options={{
              title: 'My wallet',
            }}
            name="MyWallet"
            component={MyWallet}
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

export default inject('userStore')(observer(App));
