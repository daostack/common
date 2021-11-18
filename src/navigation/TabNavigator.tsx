import React from 'react';
import {colors} from '~/Theme';
import {CommonsList, UserProfile} from '~/Screens';
import {
  Animated,
  Image,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '~/Assets/iconfont/Icon';
import NotificationList from '~/Screens/Notifications/NotificationList';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {useStore} from '~/Stores';

const Tab = createBottomTabNavigator();

const tabBarStyle: Animated.WithAnimatedValue<StyleProp<ViewStyle>> = {
  elevation: 5,
  shadowColor: colors.shadowColor,
  shadowOffset: {height: 5, width: 0},
  shadowOpacity: 0.75,
  shadowRadius: 5,
  height: Platform.OS === 'ios' ? 100 : 60,
};

export const TabNavigator = () => {
  const {authStore, notificationStore} = useStore();
  return (
    <Tab.Navigator
      initialRouteName={NAVIGATION_SCREENS.EXPLORE}
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
              const imageName = focused
                ? require('~/Assets/notificationsSelected.png')
                : require('~/Assets/notificationsUnselected.png');
              return (
                <View style={styles.notificationContainer}>
                  <Image source={imageName} width={30} height={30} />
                  {notificationStore.hasNewNotifications && (
                    <View style={styles.notReadDot} />
                  )}
                </View>
              );
            }
          }
        },
      })}>
      <Tab.Screen
        name={NAVIGATION_SCREENS.EXPLORE}
        component={CommonsList}
        options={{
          tabBarActiveTintColor: colors.mainBlue,
          tabBarShowLabel: false,
          tabBarStyle,
        }}
      />
      <Tab.Screen
        name={NAVIGATION_SCREENS.PROFILE}
        component={UserProfile}
        options={{
          tabBarActiveTintColor: colors.mainBlue,
          tabBarShowLabel: false,
          tabBarStyle,
        }}
      />
      {authStore.signedInUser && (
        <Tab.Screen
          name={NAVIGATION_SCREENS.NOTIFICATIONS}
          component={NotificationList}
          options={{
            tabBarActiveTintColor: colors.mainBlue,
            tabBarShowLabel: false,
            tabBarStyle,
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    flexDirection: 'row',
  },
  notReadDot: {
    width: 11,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    marginLeft: -12,
    marginTop: 2,
    borderWidth: 2,
    borderColor: colors.white,
  },
});
