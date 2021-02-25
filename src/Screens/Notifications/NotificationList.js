import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, font, sizeS, colors} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {object} from 'prop-types';
import NotificationItem from '~/Components/Notifications/NotificationItem';
import NotificationService from '~/Services/NotificationService';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {FlatList} from 'react-native-gesture-handler';

const NotificationList = ({navigation}) => {
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    NotificationService.getNotificationList().then((result) => {
      setNotificationList(result);
    });
  }, []);

  console.log(notificationList);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>Notifications</Text>
        </View>

        <FlatList
          data={notificationList}
          renderItem={({item}) => <NotificationItem item={item} />}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: colors.grey4,
              }}
            />
          )}
        />
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
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
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

export default inject('userStore', 'proposalStore')(observer(NotificationList));
