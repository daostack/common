import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font} from '~/Theme';
import {TAB_BAR_HEIGHT} from '~/Util/bottomTabHeight';
import {CommonAgenda} from '~/Screens/Commons/CommonProfile/CommonAgenda/CommonAgenda';
import {observer} from 'mobx-react';
import {CommonProposals} from '~/Screens/Commons/CommonProfile/CommonProposals';
import {CommonDiscussions} from '~/Screens/Commons/CommonProfile/CommonDiscussions';
import {CommonNotifications} from '~/Screens/Commons/CommonProfile/CommonNotifications';
import {IconWalletSelected} from '~/Assets/iconfont/IconWalletSelected';
import {IconWallet} from '~/Assets/iconfont/IconWallet';
import {useRoute} from '@react-navigation/native';
import {CommonWallet} from '~/Screens/Commons/CommonProfile/CommonWallet/CommonWallet';

const Tab = createBottomTabNavigator();

export const CommonTabNavigator = observer(() => {
  const routeHook = useRoute();

  const commonId = routeHook?.params?.params?.commonId || routeHook?.params?.commonId;

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
            case 'CommonProposals': {
              if (focused) {
                return (
                  <Icon
                    name="proposal-selected"
                    size={30}
                    color={colors.mainBlue}
                  />
                );
              }
              return (
                <Icon name="proposal" size={30} color={colors.greySubtitle} />
              );
            }
            case 'CommonAgenda': {
              if (focused) {
                return <Icon name="agenda" size={30} color={colors.mainBlue} />;
              }
              return (
                <Icon name="agenda" size={30} color={colors.greySubtitle} />
              );
            }
            case 'CommonDiscussions': {
              if (focused) {
                return (
                  <Icon
                    name="discussion-selected"
                    size={30}
                    color={colors.mainBlue}
                  />
                );
              }
              return (
                <Icon name="discussion" size={30} color={colors.greySubtitle} />
              );
            }
            case 'CommonWallet': {
              if (focused) {
                return <IconWalletSelected size={30} color={colors.mainBlue} />;
              }
              return <IconWallet size={30} color={colors.greySubtitle} />;
            }
            case 'CommonNotifications': {
              const imageName = focused
                ? require('~/Assets/notificationsSelected.png')
                : require('~/Assets/notificationsUnselected.png');
              return (
                <View style={styles.notificationContainer}>
                  <Image source={imageName} width={30} height={30} />
                </View>
              );
            }
          }
        },
      })}>
      <Tab.Screen
        name="CommonAgenda"
        component={CommonAgenda}
        initialParams={{commonId}}
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
      <Tab.Screen
        name="CommonProposals"
        component={CommonProposals}
        initialParams={{commonId}}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.label,
                focused ? styles.activeLabel : styles.inactiveLabel,
              ]}>
              Proposals
            </Text>
          ),
          tabBarLabelStyle: styles.label,
        }}
      />
      <Tab.Screen
        name="CommonDiscussions"
        component={CommonDiscussions}
        initialParams={{commonId}}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.label,
                focused ? styles.activeLabel : styles.inactiveLabel,
              ]}>
              Discussions
            </Text>
          ),
          tabBarLabelStyle: styles.label,
        }}
      />
      <Tab.Screen
        name="CommonWallet"
        component={CommonWallet}
        initialParams={{commonId}}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.label,
                focused ? styles.activeLabel : styles.inactiveLabel,
              ]}>
              Wallet
            </Text>
          ),
          tabBarLabelStyle: styles.label,
        }}
      />
      <Tab.Screen
        name="CommonNotifications"
        component={CommonNotifications}
        initialParams={{commonId}}
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
    </Tab.Navigator>
  );
});

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
