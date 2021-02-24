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
      case EventTypeState.fundingRequestExecuted:
        return EventTitleState.fundingRequestExecuted;
      case EventTypeState.fundingRequestRejected:
        return EventTitleState.fundingRequestRejected;
      case EventTypeState.paymentFailed:
        return EventTitleState.paymentFailed;
      case EventTypeState.messageCreated:
        return EventTitleState.messageCreated;
      case EventTypeState.voteCreated:
        return EventTitleState.voteCreated;
      case EventTypeState.cardCreated:
        return EventTitleState.cardCreated;
      case EventTypeState.requestToJoinCreated:
        return EventTitleState.requestToJoinCreated;
      case EventTypeState.requestToJoinAccepted:
        return EventTitleState.requestToJoinAccepted;
      case EventTypeState.creationReqToJoin:
        return EventTitleState.creationReqToJoin;
      case EventTypeState.commonMemberAdded:
        return EventTitleState.commonMemberAdded;
      case EventTypeState.commonWhitelisted:
        return EventTitleState.commonWhitelisted;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case EventTypeState.commonCreated:
        return colors.lightBlue;
      case EventTypeState.fundingRequestAccepted:
        return colors.lightGreen;
      case EventTypeState.fundingRequestCreated:
        return colors.lightBlue;
      case EventTypeState.fundingRequestExecuted:
        return colors.redLight;
      case EventTypeState.fundingRequestRejected:
        return colors.redLight;
      case EventTypeState.paymentFailed:
        return colors.redLight;
      case EventTypeState.messageCreated:
        return colors.lightBlue;
      case EventTypeState.voteCreated:
        return colors.lightBlue;
      case EventTypeState.cardCreated:
        return colors.lightBlue;
      case EventTypeState.requestToJoinCreated:
        return colors.lightBlue;
      case EventTypeState.requestToJoinAccepted:
        return colors.lightGreen;
      case EventTypeState.creationReqToJoin:
        return colors.lightBlue;
      case EventTypeState.commonMemberAdded:
        return colors.lightGreen;
      case EventTypeState.commonWhitelisted:
        return colors.lightGreen;
      default:
        return null;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case EventTypeState.commonCreated:
        return colors.mainBlue;
      case EventTypeState.fundingRequestAccepted:
        return colors.lightishGreen;
      case EventTypeState.fundingRequestCreated:
        return colors.mainBlue;
      case EventTypeState.fundingRequestExecuted:
        return colors.error;
      case EventTypeState.fundingRequestRejected:
        return colors.error;
      case EventTypeState.paymentFailed:
        return colors.error;
      case EventTypeState.messageCreated:
        return colors.mainBlue;
      case EventTypeState.voteCreated:
        return colors.mainBlue;
      case EventTypeState.cardCreated:
        return colors.mainBlue;
      case EventTypeState.requestToJoinCreated:
        return colors.mainBlue;
      case EventTypeState.creationReqToJoin:
        return colors.mainBlue;
      case EventTypeState.commonMemberAdded:
        return colors.lightishGreen;
      case EventTypeState.requestToJoinAccepted:
        return colors.lightishGreen;
      case EventTypeState.commonWhitelisted:
        return colors.lightishGreen;
      default:
        return null;
    }
  };
  return (
    <View style={[styles.badgeContainer, {backgroundColor: getBgColor()}]}>
      <Text style={[styles.textStyle, {color: getTextColor()}]}>
        {renderTitle()}
      </Text>
    </View>
  );
};

NotificationBadge.propTypes = {
  type: string,
};

const styles = StyleSheet.create({
  textStyle: {
    ...text.smallBlackText,
    ...text.bold,
    ...font.fontSize(0),
    color: colors.lightishGreen,
  },
  badgeContainer: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
});

export default NotificationBadge;
