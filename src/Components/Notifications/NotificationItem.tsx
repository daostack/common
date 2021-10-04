import {CommonActions, useNavigation} from '@react-navigation/native';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  NotificationItemData,
  NotificationSeenStatus,
} from '~/Graphql/Notification';
import {EventTypeState} from '~/Graphql/Notification/NotificationType';
import {Notification} from '~/Stores/Models/Notification';
import {colors, font, layout, text} from '~/Theme';
import {NotificationStore} from '~/Types/store';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {formatNotificationDate} from '~/Util/DateUtil';
import NotificationBadge from './NotificationBadge';

interface Props {
  item: Notification;
  notificationData: NotificationItemData;
  notificationStore?: NotificationStore;
}

const NotificationItem = ({item, notificationData, ...props}: Props) => {
  const navigation = useNavigation();
  const notificationStore = props.notificationStore;

  const navigateToDetail = () => {
    let navigate;

    notificationStore!.setNotificationItemState(
      item.id,
      NotificationSeenStatus.Done,
    );

    if (notificationData.proposal) {
      navigation.navigate(NAVIGATION_SCREENS.PROPOSAL_SCREEN, {
        proposalId: notificationData.proposal.id,
        fromNotificationItem: true,
        tabIndex: notificationData?.tabIndex || 0,
      });
    } else if (notificationData.discussion) {
      navigation.navigate(NAVIGATION_SCREENS.DISCUSSIONS, {
        discussionId: notificationData.discussion.id,
        fromNotificationItem: true,
      });
    } else if (notificationData.common) {
      navigate = CommonActions.navigate({
        name: NAVIGATION_SCREENS.COMMON_PROFILE,
        params: {
          currCommon: notificationData.common,
          fromNotificationItem: true,
        },
      });
      navigation.dispatch(navigate);
    } else if (item.eventType === EventTypeState.welcomeNotification) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: NAVIGATION_SCREENS.COMMON_HOME,
            },
          ],
        }),
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigateToDetail();
      }}>
      <View
        style={[
          styles.messageCardContainer,
          {
            backgroundColor: item.notificationItemState?.opened
              ? colors.white
              : colors.paleNotificationblue,
          },
        ]}>
        <View
          style={{flexDirection: 'column', marginLeft: 20, marginRight: 15}}>
          <FastImage
            style={styles.userImage}
            source={{
              uri: notificationData.ownerAvatar,
            }}
          />
          {!item.notificationItemState?.seen && (
            <View style={styles.notReadDot} />
          )}
        </View>
        <View style={styles.notificationContainer}>
          <View style={styles.headerContainer}>
            <NotificationBadge type={item.eventType} />
            <View style={styles.headerTitle}>
              <Text numberOfLines={1}>
                <Text style={styles.prefixStyle}>
                  {notificationData.header}
                </Text>
                {notificationData.headerBold && (
                  <>
                    <Text style={styles.whereStyle}>{' "'}</Text>
                    <Text style={styles.whereStyle}>
                      {notificationData.headerBold}
                    </Text>
                  </>
                )}
              </Text>
              {notificationData.headerBold && (
                <Text style={styles.whereStyle}>{'"'}</Text>
              )}
            </View>
          </View>
          <View style={styles.messageContainer}>
            <Text
              numberOfLines={2}
              style={{flexDirection: 'row', writingDirection: 'ltr'}}>
              <Text style={[styles.messageStyle, {...font.primary.bold}]}>
                {notificationData.descriptionBold}
              </Text>
              <Text style={[styles.messageStyle, {flexShrink: 1}]}>
                {notificationData.description}
              </Text>
            </Text>
          </View>
          <Text style={styles.dateStyle}>
            {/* There are broken records on staging and for some documents therre is no a valid createdAt date, so we need the check */}
            {notificationData.createdAt &&
              formatNotificationDate(notificationData.createdAt)}
            {notificationData.common && (
              <Text>{`, ${notificationData.common.name}`}</Text>
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationContainer: {
    flex: 1,
  },
  notReadDot: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: colors.mainBlue,
    marginTop: -27,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: colors.paleNotificationblue,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
  },
  prefixStyle: {
    ...font.primary.regular,
    ...font.fontSize(0),
    color: colors.black,
    marginLeft: 5,
  },
  whereStyle: {
    ...font.primary.bold,
    ...font.fontSize(0),
    color: colors.black,
  },
  dateStyle: {
    ...font.primary.regular,
    ...font.fontSize(0),
    marginTop: 5,
    color: colors.greySubtitle,
  },
  messageCardContainer: {
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    borderBottomColor: colors.grey4,
    borderBottomWidth: 2,
  },
  messageContainer: {
    marginTop: 5,
  },
  nameStyle: {
    ...font.primary.bold,
    ...font.fontSize(2),
    color: colors.black,
    textAlign: 'left',
  },
  messageStyle: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
    ...layout.marginTopS,
  },
  timeStyle: {
    ...text.textFieldplaceholder,
    textAlign: 'right',
    width: '100%',
  },
});

export default inject('notificationStore')(observer(NotificationItem));
