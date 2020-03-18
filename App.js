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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Home, Login, CommonsList, NativeBridgeTests} from './src/Screens';
import {ApolloClientConfig as client} from './src/Config';
import FirebaseService from './src/Services/FirebaseService';
const firebaseService = new FirebaseService();
const Tab = createBottomTabNavigator();

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
        <Tab.Navigator>
          <Tab.Screen name="Test" component={NativeBridgeTests} />
          <Tab.Screen name="Commons" component={CommonsList} />
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Login" component={Login} />
          <Tab.Screen name="Create Account" component={CreateAccount} />
        </Tab.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
