/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {ApolloProvider} from 'react-apollo';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Home,
  Login,
  CommonsList,
  NativeBridgeTests,
  Onboarding,
  UserProfile,
  CreateAccount,
  CompleteAccount,
} from './src/Screens';
import {ApolloClientConfig as client} from './src/Config';
import FirebaseService from './src/Services/FirebaseService';
const firebaseService = new FirebaseService();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CommonHome = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Test" component={NativeBridgeTests} />
      <Tab.Screen name="Commons" component={CommonsList} />
      <Tab.Screen name="CreateAccount" component={CreateAccount} />
    </Tab.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    const getUser = async () => {
      console.log('users: ', await firebaseService.getUser());
    };
    getUser();
  });

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CommonHome" component={CommonHome} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="CompleteAccount" component={CompleteAccount} />
          <Stack.Screen name="Profile" component={UserProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
