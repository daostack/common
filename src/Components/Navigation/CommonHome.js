import React from 'react';
import {colors} from '~/Theme';
import {CommonsList, UserProfile} from '~/Screens';
import {Image, Platform} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import Icon from '~/Assets/iconfont/Icon';
import NotificationList from '~/Screens/Notifications/NotificationList';

const CommonHome = () => (
  <Tab.Navigator
    // initialRouteName="My feed"
    initialRouteName="Explore"
    lazy={false}
    screenOptions={({route}) => ({
      tabBarIcon: ({focused}) => {
        switch (route.name) {
          case 'Explore': {
            if (focused) {
              return <Icon name="commons-selected" size={30} />;
            }
            return <Icon name="commons" size={30} />;
          }
          case 'Profile': {
            if (focused) {
              return <Icon name="account-selected" size={30} />;
            }
            return <Icon name="account" size={30} />;
          }
          default: {
            if (focused) {
              return (
                <Image
                  source={require('~/Assets/notificationsSelected.png')}
                  width={30}
                  height={30}
                />
              );
            }
            return (
              <Image
                source={require('~/Assets/notificationsUnselected.png')}
                width={30}
                height={30}
              />
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
        shadowOffset: {height: 5},
        shadowOpacity: 0.75,
        shadowRadius: 5,
        height: Platform.OS === 'ios' ? 100 : 60,
      },
    }}>
    <Tab.Screen name="Explore" component={CommonsList} />
    <Tab.Screen name="Profile" component={UserProfile} />
    <Tab.Screen name="Notifications" component={NotificationList} />
  </Tab.Navigator>
);

export default CommonHome;
