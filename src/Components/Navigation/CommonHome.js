import React from 'react';
import {colors} from '~/Theme';
import {CommonsList, UserProfile} from '~/Screens';
import {Image, Platform} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import Icon from '~/Assets/iconfont/Icon';
import NotificationList from '~/Screens/Notifications/NotificationList';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {inject, observer} from 'mobx-react';
import {authStorePropTypes} from '~/Types/propTypes';

const CommonHome = ({authStore}) => (
  <Tab.Navigator
    // initialRouteName="My feed"
    initialRouteName="Explore"
    lazy={false}
    screenOptions={({route}) => ({
      tabBarIcon: ({focused}) => {
        switch (route.name) {
          case NAVIGATION_SCREENS.EXPLORE: {
            if (focused) {
              return <Icon name="commons-selected" size={30} />;
            }
            return <Icon name="commons" size={30} />;
          }
          case NAVIGATION_SCREENS.PROFILE: {
            if (focused) {
              return <Icon name="account-selected" size={30} />;
            }
            return <Icon name="account" size={30} />;
          }
          case NAVIGATION_SCREENS.NOTIFICATIONS: {
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
    <Tab.Screen name={NAVIGATION_SCREENS.EXPLORE} component={CommonsList} />
    <Tab.Screen name={NAVIGATION_SCREENS.PROFILE} component={UserProfile} />
    {authStore.signedInUser && (
      <Tab.Screen
        name={NAVIGATION_SCREENS.NOTIFICATIONS}
        component={NotificationList}
      />
    )}
  </Tab.Navigator>
);

CommonHome.propTypes = {
  authStore: authStorePropTypes,
};

export default inject('authStore')(observer(CommonHome));
