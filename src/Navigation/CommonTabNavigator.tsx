import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font} from '~/Theme';
import {TAB_BAR_HEIGHT} from '~/Util/bottomTabHeight';
import {NAVIGATION_SCREENS} from '~/Navigation/routes.enum';
import {useStore} from '~/Util/hooks/useStore';
import {NewCommonProfile} from '../Screens/Commons/CommonProfile/NewCommonProfile';
import {observer} from 'mobx-react';

const Tab = createBottomTabNavigator();

const CommonTabNavigator = () => {
  const rootStore = useStore('rootStore');

  return (
    <Tab.Navigator
      initialRouteName="CommonAgenda"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.mainBlue,
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
            case 'CommonAgenda': {
              if (focused) {
                return <Icon name="agenda" size={30} color={colors.mainBlue} />;
              }
              return (
                <Icon name="agenda" size={30} color={colors.greySubtitle} />
              );
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
        name={'CommonAgenda'}
        component={NewCommonProfile}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.label,
                focused ? styles.activeLabel : styles.inactiveLabel,
              ]}>
              Agenda
            </Text>
          ),
          tabBarLabelStyle: styles.label,
        }}
      />
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

export default observer(CommonTabNavigator);
