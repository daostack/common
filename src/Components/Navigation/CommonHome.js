import {Image} from 'react-native';
import {colors} from '../../Theme';
import {CommonsList, NativeBridgeTests, UserProfile} from '../../Screens';
import React from 'react';
import {inject, observer} from 'mobx-react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

const CommonHome = ({userStore}) => {
  return (
    <Tab.Navigator
      // initialRouteName="My feed"
      initialRouteName="Explore"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'My feed') {
            return (
              <Image
                source={require('../../../src/Assets/feed.png')}
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
                source={require('../../../src/Assets/commons.png')}
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
                source={require('../../../src/Assets/accountSelected.png')}
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
      {/*{userStore.userInfo && (*/}
      {/*<Tab.Screen name="My feed" component={NativeBridgeTests} />*/}
      {/*)}*/}
      <Tab.Screen name="My feed" component={NativeBridgeTests} />

      <Tab.Screen name="Explore" component={CommonsList} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
};

export default inject('userStore')(observer(CommonHome));
