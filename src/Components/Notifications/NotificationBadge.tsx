import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, text, font} from '~/Theme';
import {InferProps, string} from 'prop-types';
import {
  BadgeProps,
  EventTitleState,
  EventTypeState,
} from '~/Types/EntityTypes/INotificationEntity';

const props = {
  type: string,
};

const NotificationBadge: React.FC<InferProps<typeof props>> = ({type}) => {
  const [badgeValues, setBadgeValues] = useState<BadgeProps>({});

  useEffect(() => {
    switch (type) {
      case EventType.welcomeNotification:
        setBadgeValues({
          title: EventTitleState.welcomeNotification,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });

        break;
      case EventType.fundingRequestAccepted:
        setBadgeValues({
          title: EventTitleState.fundingRequestAccepted,
          bgColor: colors.lightGreen,
          textColor: colors.lightishGreen,
        });
        break;

      case EventType.fundingRequestCreated:
        setBadgeValues({
          title: EventTitleState.fundingRequestCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventType.fundingRequestExecuted:
        setBadgeValues({
          title: EventTitleState.fundingRequestExecuted,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;

      case EventType.fundingRequestRejected:
        setBadgeValues({
          title: EventTitleState.fundingRequestRejected,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;

      case EventType.paymentFailed:
        setBadgeValues({
          title: EventTitleState.paymentFailed,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;

      case EventType.messageCreated:
        setBadgeValues({
          title: EventTitleState.messageCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventType.voteCreated:
        setBadgeValues({
          title: EventTitleState.voteCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventType.cardCreated:
        setBadgeValues({
          title: EventTitleState.cardCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventType.requestToJoinCreated:
        setBadgeValues({
          title: EventTitleState.requestToJoinCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventType.requestToJoinRejected:
        setBadgeValues({
          title: EventTitleState.requestToJoinRejected,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;

      case EventType.requestToJoinAccepted:
        setBadgeValues({
          title: EventTitleState.requestToJoinAccepted,
          bgColor: colors.lightGreen,
          textColor: colors.lightishGreen,
        });
        break;

      case EventType.creationReqToJoin:
        setBadgeValues({
          title: EventTitleState.creationReqToJoin,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;

      case EventType.commonMemberAdded:
        setBadgeValues({
          title: EventTitleState.commonMemberAdded,
          bgColor: colors.lightGreen,
          textColor: colors.lightishGreen,
        });
        break;

      case EventType.commonWhitelisted:
        setBadgeValues({
          title: EventTitleState.commonWhitelisted,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;
      case EventType.discussionCreated:
        setBadgeValues({
          title: EventTitleState.discussionCreated,
          bgColor: colors.lightBlue,
          textColor: colors.mainBlue,
        });
        break;
      case EventType.discussionMessageReported:
        setBadgeValues({
          title: EventTitleState.discussionMessageReported,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;
      case EventType.proposalReported:
        setBadgeValues({
          title: EventTitleState.proposalReported,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;
      case EventType.membershipRequestReported:
        setBadgeValues({
          title: EventTitleState.membershipRequestReported,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;
      case EventType.discussionReported:
        setBadgeValues({
          title: EventTitleState.discussionReported,
          bgColor: colors.redLight,
          textColor: colors.error,
        });
        break;
    }
  }, [type]);

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
