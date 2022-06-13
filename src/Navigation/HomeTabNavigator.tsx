import React from 'react';
import {colors, font} from '~/Theme';
import {CommonsList, UserProfile} from '~/Screens';
import {Image, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '~/Assets/iconfont/Icon';
import {NotificationList} from '~/Screens/Notifications/NotificationList';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import {observer} from 'mobx-react';
import {TAB_BAR_HEIGHT} from '~/Util/bottomTabHeight';
import {useStore} from '~/Util/hooks/useStore';

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  const rootStore = useStore('rootStore');
  return (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.mainBlue,
        tabBarInactiveTintColor: colors.greySubtitle,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
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
                  {rootStore.notificationStore.hasNewNotifications && (
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
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.label,
                focused ? styles.activeLabel : styles.inactiveLabel,
              ]}>
              Explore
            </Text>
          ),
          tabBarLabelStyle: styles.label,
        }}
      />
      <Tab.Screen
        name={NAVIGATION_SCREENS.PROFILE}
        component={UserProfile}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.label,
                focused ? styles.activeLabel : styles.inactiveLabel,
              ]}>
              Profile
            </Text>
          ),
          tabBarLabelStyle: styles.label,
        }}
      />
      {rootStore.authStore.signedInUser && (
        <Tab.Screen
          name={NAVIGATION_SCREENS.NOTIFICATIONS}
          component={NotificationList}
          options={{
            tabBarLabel: ({focused}) => (
              <Text
                style={[
                  styles.label,
                  focused ? styles.activeLabel : styles.inactiveLabel,
                ]}>
                Notifications
              </Text>
            ),
            tabBarLabelStyle: styles.label,
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
  activeLabel: {
    ...font.primary.bold,
    fontWeight: '800',
    color: colors.mainBlue,
  },
  inactiveLabel: {
    ...font.primary.regular,
    fontWeight: '600',
    color: colors.greySubtitle,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.4,
    top: -3,
  },
  tabBar: {
    elevation: 5,
    shadowColor: '#333',
    shadowOffset: {height: 5, width: 0},
    shadowOpacity: 0.75,
    shadowRadius: 5,
    height: TAB_BAR_HEIGHT,
    lazy: false,
  },
});

export default observer(HomeTabNavigator);
