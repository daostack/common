import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, text, font} from '~/Theme';
import {InferProps, string} from 'prop-types';
import {
  BadgeProps,
  EventTitleState,
  EventTypeState,
} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';

const props = {
  type: string,
};

const NotificationBadge: React.FC<InferProps<typeof props>> = ({type}) => {
  const [badgeValues, setBadgeValues] = useState<BadgeProps>({});

  useEffect(() => {
    switch (type) {
      case EventTypeState.commonCreated:
        setBadgeValues({
          title: EventTitleState.commonCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });

        break;
      case EventTypeState.fundingRequestAccepted:
        setBadgeValues({
          title: EventTitleState.fundingRequestAccepted,
          bgColor: colors.lightGreen,
          textColor: colors.lightishGreen,
        });
        break;

      case EventTypeState.fundingRequestCreated:
        setBadgeValues({
          title: EventTitleState.fundingRequestCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventTypeState.fundingRequestExecuted:
        setBadgeValues({
          title: EventTitleState.fundingRequestExecuted,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;

      case EventTypeState.fundingRequestRejected:
        setBadgeValues({
          title: EventTitleState.fundingRequestRejected,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;

      case EventTypeState.paymentFailed:
        setBadgeValues({
          title: EventTitleState.paymentFailed,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;

      case EventTypeState.messageCreated:
        setBadgeValues({
          title: EventTitleState.messageCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventTypeState.voteCreated:
        setBadgeValues({
          title: EventTitleState.voteCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventTypeState.cardCreated:
        setBadgeValues({
          title: EventTitleState.cardCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventTypeState.requestToJoinCreated:
        setBadgeValues({
          title: EventTitleState.requestToJoinCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventTypeState.requestToJoinRejected:
        setBadgeValues({
          title: EventTitleState.requestToJoinRejected,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;

      case EventTypeState.requestToJoinAccepted:
        setBadgeValues({
          title: EventTitleState.requestToJoinAccepted,
          bgColor: colors.lightGreen,
          textColor: colors.lightishGreen,
        });
        break;

      case EventTypeState.creationReqToJoin:
        setBadgeValues({
          title: EventTitleState.creationReqToJoin,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventTypeState.commonMemberAdded:
        setBadgeValues({
          title: EventTitleState.commonMemberAdded,
          bgColor: colors.lightGreen,
          textColor: colors.lightishGreen,
        });
        break;

      case EventTypeState.commonWhitelisted:
        setBadgeValues({
          title: EventTitleState.commonWhitelisted,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;
    }
  }, []);

  return (
    <View
      style={[styles.badgeContainer, {backgroundColor: badgeValues.bgColor}]}>
      <Text style={[styles.textStyle, {color: badgeValues.textColor}]}>
        {badgeValues.title}
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
