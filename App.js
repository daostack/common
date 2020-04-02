/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from './src/Theme';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Login,
  CommonsList,
  CommonProfile,
  Onboarding,
  UserProfile,
  CreateAccount,
  CompleteAccount,
  EditProfile,
  NativeBridgeTests,
} from './src/Screens';
import {ApolloClientConfig as client} from './src/Config';
import FirebaseService from './src/Services/FirebaseService';
const firebaseService = new FirebaseService();
import AuthService from './src/Services/AuthService';
const authService = new AuthService();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import {filterObjectByKeys} from './src/Util';
import {userInfoFields} from './src/Stores/UserStore';
import {observer, inject} from 'mobx-react';

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
      <Tab.Screen name="My feed" component={NativeBridgeTests} />
      <Tab.Screen name="Explore" component={CommonsList} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
};

const App = ({userStore}) => {
  const [onboarded, setOnboarded] = useState();
  useEffect(() => {
    const loadUser = async () => {
      console.log('LOAD USER');
      try {
        if (!userStore.userInfo) {
          const googleSignedInUser = await authService.getGoogleSignedInUser();
          // Signed In Mode
          if (googleSignedInUser) {
            const appUser = await firebaseService.getUserById(
              googleSignedInUser.user.id,
            );

            const allUserInfo = {
              ...googleSignedInUser.user,
              ...appUser,
            };

            const filteredUser = filterObjectByKeys(
              allUserInfo,
              userInfoFields,
            );
            console.log('filteredUser -> ', filteredUser);
            userStore.setSignedInUser(filteredUser);
          }
          // Anonymous mode
          else {
            console.log('Anonymous user');
          }
        }
      } catch (error) {
        console.log('ERRROR', error);
      }
    };
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
    loadUser();
    checkOnboardingStatus();
  }, [userStore.userInfo]);

  return (
    <ApolloProvider client={client}>
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
          <Stack.Screen name="Profile" component={UserProfile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="CompleteAccount" component={CompleteAccount} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default inject('userStore')(observer(App));
