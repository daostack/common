/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors, text} from './src/Theme';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Login,
  CommonsList,
  CommonProfile,
  Onboarding,
  UserProfile,
  HUDTest,
  MyWallet,
  CreateAccount,
  CompleteAccount,
  EditProfile,
  UserProfileReadMode,
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
import Icon from './src/Assets/iconfont/Icon';
import firebase from 'react-native-firebase';

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
      <Tab.Screen name="My feed" component={UserProfile} />
      <Tab.Screen name="Explore" component={CommonsList} />
      <Tab.Screen name="Profile" component={UserProfile} />
      <Tab.Screen name="UserProfileReadMode" component={UserProfileReadMode} />
    </Tab.Navigator>
  );
};

const App = ({userStore}) => {
  const [onboarded, setOnboarded] = useState();

  const onAuthStateChanged = async user => {
    try {
      userStore.setIsLoading(true);
      if (user) {
        const appUser = await firebaseService.getUserById(user.uid);

        const allUserInfo = {
          ...user._user,
          ...appUser,
        };

        const filteredUser = filterObjectByKeys(allUserInfo, userInfoFields);

        userStore.setSignedInUser(filteredUser);
        userStore.setIsLoading(false);
      } else {
        userStore.setSignedInUser(null);
      }
      userStore.setIsLoading(false);
    } catch (error) {
      console.log('ERRROR', error);
    }
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);

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
    return subscriber; // unsubscribe on unmount
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
            headerTintColor: colors.black,
            headerBackTitleVisible: false,
            headerBackImage: () => <Icon name="left-arrow" size={32} />,
          }}>
          <Stack.Screen
            name="CommonHome"
            component={CommonHome}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Profile" component={UserProfile} />
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
