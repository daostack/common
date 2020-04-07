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
import {
  Login,
  CommonsList,
  CommonProfile,
  Onboarding,
  UserProfile,
  CreateAccount,
  CompleteAccount,
  CommonExplanation,
  CreateStep1,
  CreateStep2,
  CreateStep3,
  CreateStep4,
} from './src/Screens';
import {ApolloClientConfig as client} from './src/Config';
import {colors} from './src/Theme';
import FirebaseService from './src/Services/FirebaseService';
import AsyncStorage from '@react-native-community/async-storage';
const firebaseService = new FirebaseService();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
      <Tab.Screen name="Commons" component={CommonsList} />
      <Tab.Screen name="CreateAccount" component={CreateAccount} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [onboarded, setOnboarded] = useState();
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const isOnboarded = await AsyncStorage.getItem('onboarded');
        console.log('BBBBB', isOnboarded);
        if (isOnboarded === 'true') {
          setOnboarded(true);
        }
      } catch (e) {
        console.log(e);
      }
    };
    checkOnboardingStatus();
  }, []);

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
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="CompleteAccount" component={CompleteAccount} />
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
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
