/**
 * Sample React Native Screens
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
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
} from './src/Screens';
import {ApolloClientConfig as client} from './src/Config';
import FirebaseService from './src/Services/FirebaseService';
const firebaseService = new FirebaseService();
import AuthService from './src/Services/AuthService';
import CommonHome from './src/Components/Navigation/CommonHome';
const authService = new AuthService();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import {filterObjectByKeys} from './src/Util';
import {userInfoFields} from './src/Stores/UserStore';
import {observer, inject} from 'mobx-react';
import Icon from './src/Assets/iconfont/Icon';
import {firebase} from './src/Firebase';
import Toast from './src/Util/Toast';

const App = ({userStore}) => {
  const [onboarded, setOnboarded] = useState();

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
    return subscriber;
  }, [userStore.userInfo]);

  if (!onboarded) {
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
