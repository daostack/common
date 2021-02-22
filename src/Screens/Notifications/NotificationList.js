import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {layout, font, sizeS} from '~/Theme';
import {inject, observer} from 'mobx-react';
import {object} from 'prop-types';
import NotificationItem from '~/Components/Notifications/NotificationItem';
import NotificationService from '~/Services/NotificationService';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';

const NotificationList = ({navigation}) => {
  console.log('entra');

  NotificationService.getNotificationList().then((result) =>
    console.log('RESULTADO', result),
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          vertical={true}
          nestedScrollEnabled={true}
          directionalLockEnabled={true}
          scrollEventThrottle={16}>
          <View style={styles.sectionContainer}>
            <Text style={styles.title}>Test</Text>
          </View>

          <NotificationItem
            photoURL={
              'https://www.webconsultas.com/sites/default/files/styles/wc_adaptive_image__small/public/articulos/perfil-resilencia.jpg'
            }
            name={'gsagdshsd'}
            type={EventTypeState.fundingRequestCreated}
            message={'tetststs'}
            time={new Date()}
          />
          <NotificationItem
            photoURL={
              'https://www.webconsultas.com/sites/default/files/styles/wc_adaptive_image__small/public/articulos/perfil-resilencia.jpg'
            }
            name={'gsagdshsd 2'}
            type={EventTypeState.paymentFailed}
            message={'tetststs 2'}
            time={new Date()}
          />
        </ScrollView>
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
    ...font.fontSize(4),
  },
  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'center',
  },
});

export default inject('userStore', 'proposalStore')(observer(NotificationList));
