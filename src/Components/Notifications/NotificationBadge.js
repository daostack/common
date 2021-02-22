import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {layout, colors, text, font} from '~/Theme';
import FastImage from 'react-native-fast-image';
import {string, object} from 'prop-types';
import {
  EventTitleState,
  EventTypeState,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';

const NotificationBadge = ({type}) => {
  const renderTitle = () => {
    switch (type) {
      case EventTypeState.commonCreated:
        return EventTitleState.commonCreated;
      case EventTypeState.fundingRequestAccepted:
        return EventTitleState.fundingRequestAccepted;
      case EventTypeState.fundingRequestCreated:
        return EventTitleState.fundingRequestCreated;
      case EventTypeState.paymentFailed:
        return EventTitleState.paymentFailed;
      default:
        return null;
    }
  };
  return (
    <View style={styles.badgeContainer}>
      <Text style={styles.timeStyle}>{renderTitle()}</Text>
    </View>
  );
};

NotificationBadge.propTypes = {
  type: string,
};

const styles = StyleSheet.create({
  timeStyle: {
    textAlign: 'right',
  },
  badgeContainer: {
    margin: 1,
  },
});

export default NotificationBadge;
