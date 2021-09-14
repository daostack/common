import React, {useState, useEffect, ReactElement} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  RefreshControl,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {layout, font, sizeS, colors} from '~/Theme';
import {FlatList} from 'react-native-gesture-handler';
import Loader from '~/Components/Loader';
import {inject, observer} from 'mobx-react';
import {NotificationStore} from '~/Types/store';
import {Notification} from '~/Stores/Models/Notification';
import {EventTypeState} from '~/Graphql/Notification/NotificationType';
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

interface Props {
  navigation: {
    addListener: (status: string, callback: () => void) => void;
  };
  notificationStore: NotificationStore;
}

const NotificationList = ({
  navigation,
  notificationStore,
}: Props): ReactElement => {
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(true);

  const initialLoad = async () => {
    setPage(0);
    return notificationStore.loadNotifications();
  };

  useEffect(() => {
    if (!notificationStore.hasNewNotifications) {
      Platform.OS === 'ios'
        ? PushNotificationIOS.removeAllDeliveredNotifications()
        : PushNotification.removeAllDeliveredNotifications();
    }
  }, [notificationStore.hasNewNotifications]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await initialLoad();
      setLoading(false);
    })();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await initialLoad();
    setRefreshing(false);
  }, [refreshing]);

  const onEndReached = async () => {
    notificationStore.loadNotifications(page + 1);
    setPage(page + 1);
  };

  const renderNotificationItem = ({item}: {item: Notification}) => {
    switch (item.eventType) {
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setTimeout(() => {
        setPage(0);
      }, 5000);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Notifications</Text>
        </View>

        {!isLoading ? (
          <FlatList
            data={notificationStore.myNotificationsValues}
            renderItem={renderNotificationItem}
            initialNumToRender={8}
            keyExtractor={(x) => x.id}
            onEndReachedThreshold={400}
            onEndReached={onEndReached}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Loader isBigger />
        )}
      </SafeAreaView>
    </>
  );
};

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
