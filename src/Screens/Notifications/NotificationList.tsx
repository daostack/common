import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React, {useCallback, useEffect} from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import Loader from '~/Components/Loader';
import CommonMemberAdded from '~/Components/Notifications/CommonMemberAdded';
import CommonWhitelisted from '~/Components/Notifications/CommonWhitelisted';
import Logger from '~/Services/Logger';
import FundingAllocation from '~/Components/Notifications/FundingAllocation';
import MessageCreated from '~/Components/Notifications/MessageCreated';
import MembershipAdmittanceCreated from '~/Components/Notifications/MembershipAdmittanceCreated';
import MembershipAdmittanceRejected from '~/Components/Notifications/MembershipAdmittanceRejected';
import DiscussionCreated from '~/Components/Notifications/DiscussionCreated';
import ProposalReported from '~/Components/Notifications/ProposalReported';
import DiscussionMessageReported from '~/Components/Notifications/DiscussionMessageReported';
import DiscussionReported from '~/Components/Notifications/DiscussionReported';
import WelcomeNotification from '~/Components/Notifications/WelcomeNotification';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {Notification} from '~/Stores/Models/Notification';
import {colors, font, layout, sizeS} from '~/Theme';
import {useStore} from '~/Util/hooks/useStore';

export const NotificationList = observer((props) => {
  const {notificationsArray} = props;
  const navigation = useNavigation();
  const notificationStore = useStore('notificationStore');
  useEffect(() => {
    if (!notificationStore.hasNewNotifications) {
      Platform.OS === 'ios'
        ? PushNotificationIOS.removeAllDeliveredNotifications()
        : PushNotification.removeAllDeliveredNotifications();
    }
  }, [notificationStore.hasNewNotifications]);

  let notificationList: Array<Notification> = notificationsArray
    ? notificationsArray
    : notificationStore.loggedUserNotifications;

  const renderNotificationItem = ({item}: {item: Notification}) => {
    switch (item.eventType) {
      case EventTypeState.commonWhitelisted:
      case EventTypeState.commonCreated:
        return <CommonWhitelisted item={item} navigation={navigation} />;

      case EventTypeState.fundingRequestCreated:
      case EventTypeState.fundingRequestAccepted:
      case EventTypeState.fundingRequestExecuted:
      case EventTypeState.fundingRequestRejected:
        return <FundingAllocation item={item} navigation={navigation} />;

      case EventTypeState.messageCreated:
        return <MessageCreated item={item} navigation={navigation} />;

      case EventTypeState.commonMemberAdded:
        return <CommonMemberAdded item={item} navigation={navigation} />;

      case EventTypeState.requestToJoinCreated:
        return <MembershipAdmittanceCreated item={item} navigation={navigation} />;

      case EventTypeState.requestToJoinRejected:
        return <MembershipAdmittanceRejected item={item} navigation={navigation} />;

      case EventTypeState.discussionCreated:
        return <DiscussionCreated item={item} navigation={navigation} />;

      case EventTypeState.proposalReported:
        return <ProposalReported item={item} navigation={navigation} />;

      case EventTypeState.discussionReported:
        return <DiscussionReported item={item} navigation={navigation} />;

      case EventTypeState.discussionMessageReported:
        return (
          <DiscussionMessageReported item={item} navigation={navigation} />
        );
      case EventTypeState.welcomeNotification:
        return <WelcomeNotification item={item} navigation={navigation} />;

      default:
        Logger.warn(
          `Not existing notification item event type ${item.eventType}`,
        );
        return null;
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        notificationStore.removeSeenStateForNewNotifications();
      }, 5000);
    });

    return unsubscribe;
  }, [navigation]);

  const keyExtractor = useCallback((data) => data.id, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Notifications</Text>
        </View>
        {notificationList.length === 0 && (
          <Text style={styles.noNotifText}>No notifications yet</Text>
        )}
        {notificationList ? (
          <FlatList
            keyExtractor={keyExtractor}
            data={notificationList.slice()}
            renderItem={renderNotificationItem}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
          />
        ) : (
          <Loader isBigger />
        )}
      </SafeAreaView>
    </>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(5),
  },
  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'flex-start',
  },
  noNotifText: {
    ...font.primary.regular,
    textAlign: 'center',
  },
});
