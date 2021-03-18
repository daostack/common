import React, {useEffect} from 'react';

import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {layout, font, sizeS, colors} from '~/Theme';
import {func, InferProps, shape} from 'prop-types';
import NotificationItem from '~/Components/Notifications/NotificationItem';
import {FlatList} from 'react-native-gesture-handler';
import Loader from '~/Components/Loader';
import {inject, observer} from 'mobx-react';
import {notificationStorePropTypes} from '~/Types/propTypes';
import {Notification} from '~/Stores/Models/Notification';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import CommonWhitelisted from '~/Components/Notifications/CommonWhitelisted';
import Logger from '~/Services/Logger';

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
  const notificationList: Array<Notification> = notificationStore.getLoggedUserNotifications();

  const renderNotificationItem = ({item}: {item: Notification}) => {
    console.log('renderNotificationItem -> ', item);
    switch (item.eventType) {
      case EventTypeState.commonWhitelisted:
      case EventTypeState.commonCreated:
        return <CommonWhitelisted item={item} navigation={navigation} />;

      case EventTypeState.fundingRequestCreated:
      case EventTypeState.fundingRequestAccepted:
      case EventTypeState.fundingRequestExecuted:
      case EventTypeState.fundingRequestRejected:
        return null;
      //return this.getFundingRequestData();

      case EventTypeState.messageCreated:
        return null;

      case EventTypeState.commonMemberAdded:
        return null;

      case EventTypeState.requestToJoinCreated:
        return null;

      case EventTypeState.requestToJoinRejected:
        return null;

      case EventTypeState.discussionCreated:
        return null;
      default:
        Logger.warn(
          `Not existing notification item event type ${item.eventType}`,
        );
        return null;
    }

    //<NotificationItem item={item} navigation={navigation} />
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        notificationStore.removeSeenStateForNewNotifications();
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

        {notificationList ? (
          <FlatList
            data={notificationList.slice()}
            renderItem={renderNotificationItem}
            initialNumToRender={8}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.grey4,
                }}
              />
            )}
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
