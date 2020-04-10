/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {Image, View} from 'react-native';
import {ApolloProvider} from 'react-apollo';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {colors} from './src/Theme';
import AsyncStorage from '@react-native-community/async-storage';

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
  CreateStep1,
  CreateStep2,
  CreateStep3,
  CreateStep4,
  EditProfile,
  NativeBridgeTests,
} from './src/Screens';
import {ApolloClientConfig as client} from './src/Config';
import FirebaseService from './src/Services/FirebaseService';
const firebaseService = new FirebaseService();
import AuthService from './src/Services/AuthService';
import CommonHome from './src/Components/Navigation/CommonHome';
const authService = new AuthService();
const Stack = createStackNavigator();
import {filterObjectByKeys} from './src/Util';
import {userInfoFields} from './src/Stores/UserStore';
import {observer, inject} from 'mobx-react';


const App = ({userStore}) => {
  const [onboarded, setOnboarded] = useState();
  useEffect(() => {
    const loadUser = async () => {
      console.log('User from userStore App.js: ', userStore.userInfo);
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
        console.log('BBBBB', isOnboarded);
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

  if (!onboarded) {
    return (<View style={{flex:1 }}/>)
  }

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
              userStore={userStore}
            />
          )}
          <Stack.Screen name="CommonProfile" component={CommonProfile} />
          <Stack.Screen name="CreateCommon" component={CreateCommon} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="CompleteAccount" component={CompleteAccount} />
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

          <Stack.Screen name="Profile" component={UserProfile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default inject('userStore')(observer(App));
