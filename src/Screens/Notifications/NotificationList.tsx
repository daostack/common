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

  const renderNotificationItem = ({item}: {item: Notification}) => (
    <NotificationItem item={item} navigation={navigation} />
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        notificationStore.removeSeenStateForNewNotifications();
      }, 5000);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
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
