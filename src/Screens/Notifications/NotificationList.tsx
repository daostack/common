import React, {useEffect} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {layout, font, sizeS, colors} from '~/Theme';
import {func, InferProps, shape} from 'prop-types';
import {FlatList} from 'react-native-gesture-handler';
import Loader from '~/Components/Loader';
import {inject, observer} from 'mobx-react';
import {notificationStorePropTypes} from '~/Types/propTypes';
import {Notification} from '~/Stores/Models/Notification';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import CommonWhitelisted from '~/Components/Notifications/CommonWhitelisted';
import Logger from '~/Services/Logger';
import FundingRequest from '~/Components/Notifications/FundingRequest';
import MessageCreated from '~/Components/Notifications/MessageCreated';
import CommonMemberAdded from '~/Components/Notifications/CommonMemberAdded';
import RequestToJoinCreated from '~/Components/Notifications/RequestToJoinCreated';
import RequestToJoinRejected from '~/Components/Notifications/RequestToJoinRejected';
import DiscussionCreated from '~/Components/Notifications/DiscussionCreated';
import ProposalReported from '~/Components/Notifications/ProposalReported';
import DiscussionMessageReported from '~/Components/Notifications/DiscussionMessageReported';
import DiscussionReported from '~/Components/Notifications/DiscussionReported';
import WelcomeNotification from '~/Components/Notifications/WelcomeNotification';
//import {onNewNotificationCreated} from '~/Graphql/Notifications';
//import {useSubscription} from '@apollo/react-hooks';

const props = {
  navigation: shape({
    addListener: func.isRequired,
  }).isRequired,
  notificationStore: notificationStorePropTypes.isRequired,
};
const NotificationList: React.FC<InferProps<typeof props>> = ({
  navigation,
  notificationStore,
}) => {
  useEffect(() => {
    if (!notificationStore.hasNewNotifications) {
      Platform.OS === 'ios'
        ? PushNotificationIOS.removeAllDeliveredNotifications()
        : PushNotification.removeAllDeliveredNotifications();
    }
  }, [notificationStore.hasNewNotifications]);

  const notificationList: Array<Notification> =
    notificationStore.notifications;

  const renderNotificationItem = ({item}: {item: Notification}) => {
    switch (item.type) {
      case EventTypeState.commonWhitelisted:
      case EventTypeState.commonCreated:
        return <CommonWhitelisted item={item} navigation={navigation} />;

      case EventTypeState.fundingRequestCreated:
      case EventTypeState.fundingRequestAccepted:
      case EventTypeState.fundingRequestExecuted:
      case EventTypeState.fundingRequestRejected:
        return <FundingRequest item={item} navigation={navigation} />;

      case EventTypeState.messageCreated:
        return <MessageCreated item={item} navigation={navigation} />;

      case EventTypeState.commonMemberAdded:
        return <CommonMemberAdded item={item} navigation={navigation} />;

      case EventTypeState.requestToJoinCreated:
        return <RequestToJoinCreated item={item} navigation={navigation} />;

      case EventTypeState.requestToJoinRejected:
        return <RequestToJoinRejected item={item} navigation={navigation} />;

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
      case 'General': //EventTypeState.welcomeNotification:
        return <WelcomeNotification item={item} navigation={navigation} />;

      default:
        Logger.warn(
          `Not existing notification item event type ${item.type}`,
        );
        return null;
    }
  };


  // this currently just displays the notifications, since we
  // dont have push notifications, it can't listen to anything
  /*const SubscribeToNotificationsHook = () => {
    const data = useSubscription(onNewNotificationCreated);
    console.log('tkt data', data)
    if (data) {
     return notificationList && (
          <FlatList
            data={notificationList.slice()}
            renderItem={renderNotificationItem}
            initialNumToRender={8}
          />
        );
    } else {
      return <Loader isBigger />;
    }
  };*/

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        notificationStore.removeSeenStateForNewNotifications();
      }, 5000);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribeFromNewNotifications = notificationStore.subscribeToNotifications();

    return unsubscribeFromNewNotifications && unsubscribeFromNewNotifications();
  }, [navigation]);


  useEffect(() => {
    (async () => {
      await notificationStore.loadNotifications();
    })();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Notifications</Text>
        </View>
        {/*<SubscribeToNotificationsHook />*/}
        {notificationList ? (
          <FlatList
            data={notificationList.slice()}
            renderItem={renderNotificationItem}
            initialNumToRender={8}
          />
        ) : (
          <Loader isBigger />
        )}
      </SafeAreaView>
    </>
  );
};

NotificationList.propTypes = props;

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
});

export default inject('notificationStore')(observer(NotificationList));
