import React, {useEffect, useState} from 'react';

import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {layout, font, sizeS, colors} from '~/Theme';
import {InferProps, object} from 'prop-types';
import NotificationItem from '~/Components/Notifications/NotificationItem';
import NotificationService from '~/Services/NotificationService';
import {FlatList} from 'react-native-gesture-handler';
import Loader from '~/Components/Loader';

const props = {
  navigation: object,
};

const NotificationList: React.FC<InferProps<typeof props>> = ({navigation}) => {
  const [notificationList, setNotificationList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    NotificationService.getNotificationList().then((result) => {
      setNotificationList(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Notifications</Text>
        </View>

        {isLoading ? (
          <Loader isBigger />
        ) : (
          <FlatList
            data={notificationList}
            renderItem={({item}) => (
              <NotificationItem item={item} navigation={navigation} />
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.grey4,
                }}
              />
            )}
          />
        )}
      </SafeAreaView>
    </>
  );
};

NotificationList.propTypes = {
  navigation: object,
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

export default NotificationList;
