/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {ApolloProvider} from 'react-apollo';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
    <Tab.Navigator>
      <Tab.Screen name="Test" component={NativeBridgeTests} />
      <Tab.Screen name="Commons" component={CommonsList} />

      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
};

const App = ({userStore}) => {
  useEffect(() => {
    loadUser = async () => {
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
    loadUser();
  }, [userStore.userInfo]);

  return (
    <ApolloProvider client={client}>
      {/** 
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="CommonHome"
            component={CommonHome}
            options={{headerShown: false}}
          />
          <Stack.Screen name="CommonProfile" component={CommonProfile} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
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
        <Stack.Navigator>
          <Stack.Screen
            name="CommonHome"
            component={CommonHome}
            options={{headerShown: false}}
          />
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
