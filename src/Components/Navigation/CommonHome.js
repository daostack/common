import React from 'react';
import { Platform } from 'react-native';

import { inject, observer } from 'mobx-react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonsList, UserProfile } from '../../Screens';
import { colors } from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const Tab = createBottomTabNavigator();

const CommonHome = ({ userStore }) => (
  <Tab.Navigator
      // initialRouteName="My feed"
    initialRouteName="Explore"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        switch (route.name) {
          case 'Explore': {
            if (focused) {
              return (
                <Icon name="commons-selected" size={30} />
              );
            }
            return (
              <Icon name="commons" size={30} />
            );
          }
          default: {
            if (focused) {
              return (
                <Icon name="account-selected" size={30} />
              );
            }
            return (
              <Icon name="account" size={30} />
            );
          }
        }
      },
    })}
    tabBarOptions={{
      activeTintColor: colors.mainBlue,
      showLabel: false,
      style: {
        elevation: 5,
        shadowColor: '#333',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.75,
        shadowRadius: 5,
        height: Platform.OS === 'ios' ? 100 : 60,
      },
    }}
  >
    {/* {userStore.userInfo && ( */}
    {/* <Tab.Screen name="My feed" component={NativeBridgeTests} /> */}
    {/* )} */}
    <Tab.Screen name="Explore" component={CommonsList} />
    <Tab.Screen name="Profile" component={UserProfile} />
  </Tab.Navigator>
);

export default inject('userStore')(observer(CommonHome));
