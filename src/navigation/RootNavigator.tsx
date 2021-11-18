import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import {colors} from '~/Theme';
import * as Screens from '~/Screens';
import NotificationContainer from '~/Components/Notifications/NotificationContainer';
import {observer, inject} from 'mobx-react';
import Icon from '~/Assets/iconfont/Icon';
import BottomSheetContainer from '~/Components/BottomSheetContainer';
import {fontSize} from '~/Theme/font';
import Loader from '~/Components/Loader';
import UserInfoChecker from '~/Screens/UserProfile/UserInfoChecker';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {TabNavigator} from './TabNavigator';
import {useStore} from '~/Stores';
import {CreateNewCommonNavigator} from './CreateNewCommonNavigator';
import IntercomShowButton from '~/Services/IntercomChat/IntercomShowButton';
import {AppNavigationContainerRefWithCurrent, RootNavigatorParamList} from './types';
import { useNavigation } from '@react-navigation/core';

const HeaderBackImage = () => <Icon name="left-arrow" size={32} />;

const Stack = createStackNavigator<RootNavigatorParamList>();

export const RootNavigator = ({
  navigationRef,
}: {
  navigationRef: AppNavigationContainerRefWithCurrent;
}) => {
  const {
    local: {onboarded},
  } = useStore();
  const navigation = useNavigation();

  return (
    <Stack.Navigator
    initialRouteName={onboarded ? NAVIGATION_SCREENS.TAB_STACK: NAVIGATION_SCREENS.ONBOARDING}
    screenOptions={{
      headerStyle: styles.headerStyle,
      headerTintColor: colors.black,
      headerBackImage: HeaderBackImage,
    }}>
    <Stack.Screen
      name={NAVIGATION_SCREENS.ONBOARDING}
      component={Screens.Onboarding}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.TAB_STACK}
      component={TabNavigator}
      options={{headerShown: false}}
    />
    <Stack.Screen name={NAVIGATION_SCREENS.CREATE_ACCOUNT} component={Screens.CreateAccountScreen} />
    <Stack.Screen
      name={NAVIGATION_SCREENS.COMMON_PROFILE}
      component={Screens.CommonProfile}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name={NAVIGATION_SCREENS.COMMON_AGENDA}
      component={Screens.CommonAgenda}
      options={({route}) => ({
        title: route.params.screenTitle,
        headerBackTitleVisible: false,
      })}
    />
    <Stack.Screen
      name="Profile"
      component={Screens.UserProfile}
      options={({route}) => ({
        headerBackTitleVisible: false,
      })}
    />
    <Stack.Screen
      name="EditCommon"
      component={Screens.EditCommon}
      options={{
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="CommonExplanation"
      component={Screens.CommonExplanation}
      options={({nav, route}) => ({
        headerTitle: 'Create a Common',
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {marginLeft: 20},
        headerRightContainerStyle: {marginRight: 20},
        headerTitleAlign: 'center',
        headerBackImage: () => (
          <Icon name="left-arrow" color={colors.black} size={32} />
        ),
      })}
    />
    <Stack.Screen
      name="ProposalScreen"
      component={Screens.ProposalScreen}
      options={({route, ...rest}) => ({
        headerBackTitleVisible: false,
        headerLeft: () => (
          <HeaderBackButton
            backImage={() => (
              <Icon name="left-arrow" color={colors.black} size={32} />
            )}
            label=" "
            onPress={() =>
              route?.params.fromNotificationItem
                ? route?.params.commonId
                  ? rest?.navigation.replace('CommonProfile', {
                      commonId: route?.params.commonId,
                    })
                  : rest?.navigation.pop()
                : navigationRef.current.goBack()
            }
          />
        ),
        headerTitle: () => (
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                ...fontSize(navigation?.route.params.subtitle ? 4 : 3),
              }}>
              {route?.params.title?.length > 20
                ? route?.params.title.substring(0, 17) + '...'
                : route?.params.title}
            </Text>

            {route?.params.subtitle && (
              <Text style={{opacity: 0.4, ...fontSize(1)}}>
                {route.params.subtitle}
              </Text>
            )}
          </View>
        ),
      })}
    />
    <Stack.Screen
      name="RulesStep"
      component={Screens.RulesStep}
      options={() => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="IntroductionStep"
      component={Screens.IntroductionStep}
      options={() => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="ContributionStep"
      component={Screens.ContributionStep}
      options={() => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="BillingDetailsStep"
      component={Screens.BillingDetailsStep}
      options={() => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="PaymentDetailsStep"
      component={Screens.PaymentDetailsStep}
      options={() => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="CreateStep1"
      component={Screens.CreateStep1}
      options={({nav, route}) => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="CreateStep2"
      component={Screens.CreateStep2}
      options={({nav, route}) => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="CreateStep3"
      component={Screens.CreateStep3}
      options={({nav, route}) => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="CreateStep4"
      component={Screens.CreateStep4}
      options={({nav, route}) => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="Discussions"
      component={Screens.Discussions}
      options={({nav, route}) => ({
        headerShown: false,
      })}
    />

    <Stack.Screen
      name="FullScreenCreationLoader"
      component={Screens.FullScreenCreationLoader}
      options={({nav, route}) => ({
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="New Post"
      options={({nav, route}) => ({
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerLeft: null,
        headerRightContainerStyle: {marginRight: 20},
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigationRef.current.goBack()}>
            <Icon name="close" color={colors.black} size={20} />
          </TouchableOpacity>
        ),
      })}
      component={Screens.DiscussionPost}
    />
    <Stack.Screen
      options={({route}) => ({
        title: route.params.isCompleteAccount ? false : 'Edit my profile',
      })}
      name="EditProfile"
      component={Screens.EditProfile}
    />
    <Stack.Screen name="PDFViewer" component={Screens.PDFViewer} />
    <Stack.Screen
      name="Browser"
      options={({nav, route}) => ({headerBackTitle: 'Back'})}
      component={Screens.Browser}
    />
    <Stack.Screen
      options={{
        title: 'My Profile',
        headerBackTitleVisible: false,
      }}
      name="MyWallet"
      component={Screens.MyWallet}
    />
    <Stack.Screen name="HUDTest" component={Screens.HUDTest} />
    <Stack.Screen
      options={{
        title: 'My Profile',
        headerBackTitleVisible: false,
      }}
      name="MyProposals"
      component={Screens.MyProposals}
    />
    <Stack.Screen
      options={{
        title: 'My Profile',
        headerBackTitleVisible: false,
      }}
      name="MyCommons"
      component={Screens.MyCommons}
    />
    <Stack.Screen
      name="CommonMembers"
      component={Screens.CommonMembers}
      options={({route}) => ({
        title: route?.params.screenTitle,
        headerBackTitleVisible: false,
      })}
    />
    <Stack.Screen
      options={({route}) => ({
        title: route?.params.screenTitle,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerRight: () => <IntercomShowButton />,
      })}
      name="FundingProposal"
      component={Screens.FundingProposal}
    />

    <Stack.Screen
      options={{
        title: 'Monthly Contributions',
        headerBackTitleVisible: false,
        headerRight: () => <IntercomShowButton />,
      }}
      name="MonthlyContributionsList"
      component={Screens.MonthlyContributionsList}
    />

    <Stack.Screen
      options={{
        headerBackTitleVisible: false,
      }}
      name="MonthlyContribution"
      component={Screens.MonthlyContribution}
    />
  </Stack.Navigator>
  {notificationRouting && (
    <NotificationContainer
      notificationRouting={notificationRouting}
      setNotificationRouting={setNotificationRouting}
      navigation={navigationRef}
    />
  )}
  <UserInfoChecker navigation={navigationRef} />
  {appLoaderStore.isLoading && (
    <Loader isBigger isFullScreen navigation={navigationRef} />
  )}
  {bottomSheetStore.isVisible && (
    <BottomSheetContainer navigation={navigationRef} />
  )}
  <ToastView
    ref={hudRef}
    style={{backgroundColor: 'transparent'}}
    positionValue={160}
  />

  )
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
});