/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {Image} from 'react-native';
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
  CreateCommon,
  CompleteAccount,
  CommonExplanation,
} from './src/Screens';
import {ApolloClientConfig as client} from './src/Config';
import FirebaseService from './src/Services/FirebaseService';
const firebaseService = new FirebaseService();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CommonHome = () => {
  return (
    <Tab.Navigator>
      {/*<Tab.Screen name="Test" component={NativeBridgeTests} />*/}
      <Tab.Screen name="Commons" component={CommonsList} />
      <Tab.Screen name="CreateAccount" component={CreateAccount} />
      <Tab.Screen name="CompleteAccount" component={CompleteAccount} />
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
          <Stack.Screen
            name="CommonHome"
            component={CommonHome}
            options={{headerShown: false}}
          />
          <Stack.Screen name="CommonProfile" component={CommonProfile} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="CompleteAccount" component={CompleteAccount} />
          <Stack.Screen
            name="CreateCommon"
            component={CreateCommon}
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
          <Stack.Screen name="Profile" component={UserProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
