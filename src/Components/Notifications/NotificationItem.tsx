import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {layout, colors, text, font} from '~/Theme';
import FastImage from 'react-native-fast-image';
import NotificationBadge from './NotificationBadge';
import {CommonActions} from '@react-navigation/native';
import {InferProps, object, shape, string, bool, func} from 'prop-types';
import {formatNotificationDate} from '~/Util/DateUtil';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {EventTypeState} from '~/Firebase/Databasee/EntityTypes/INotificationEntity';
import {notificationStorePropTypes} from '~/Types/propTypes';
import {inject, observer} from 'mobx-react';

const props = {
  item: shape({
    id: string.isRequired,
    eventType: string.isRequired,
    createdAt: object.isRequired,
    notificationItemData: shape({
      missingData: bool.isRequired,
      common: shape({
        name: string,
      }),
      proposal: shape({
        id: string,
      }),
      discussion: shape({
        id: string,
      }),
      ownerAvatar: string.isRequired,
      description: string,
      descriptionBold: string,
      header: string,
      headerBold: string,
    }).isRequired,
    notificationItemState: shape({
      seen: bool.isRequired,
      opened: bool.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: shape({
    navigate: func.isRequired,
    dispatch: func.isRequired,
  }).isRequired,
  notificationStore: notificationStorePropTypes.isRequired,
};

const NotificationItem: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
  notificationStore,
}) => {
  const navigateToDetail = () => {
    let navigate;

    notificationStore.setNotificationItemState(item.id, {
      opened: true,
    });

    if (item.notificationItemData.proposal) {
      navigation.navigate(NAVIGATION_SCREENS.PROPOSAL_SCREEN, {
        proposalId: item.notificationItemData.proposal.id,
        fromNotificationItem: true,
      });
    } else if (item.notificationItemData.discussion) {
      navigation.navigate(NAVIGATION_SCREENS.DISCUSSIONS, {
        discussionId: item.notificationItemData.discussion.id,
        fromNotificationItem: true,
      });
    } else if (item.notificationItemData.common) {
      navigate = CommonActions.navigate({
        name: NAVIGATION_SCREENS.COMMON_PROFILE,
        params: {
          currCommon: item.notificationItemData.common,
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
            backgroundColor: item.notificationItemState.opened
              ? colors.white
              : colors.paleNotificationblue,
          },
        ]}>
        <View
          style={{flexDirection: 'column', marginLeft: 20, marginRight: 15}}>
          <FastImage
            style={styles.userImage}
            source={{
              uri: item.notificationItemData.ownerAvatar,
            }}
          />
          {!item.notificationItemState.seen && (
            <View style={styles.notReadDot} />
          )}
        </View>
        <View>
          <View style={styles.headerContainer}>
            <NotificationBadge type={item.eventType} />
            <Text>
              <Text style={styles.prefixStyle}>
                {item.notificationItemData.header}
              </Text>
              <Text style={styles.whereStyle}>
                {item.notificationItemData.headerBold}
              </Text>
            </Text>
          </View>
          <View style={styles.messageContainer}>
            <Text
              numberOfLines={2}
              style={{flexDirection: 'row', writingDirection: 'ltr'}}>
              <Text style={[styles.messageStyle, {...font.primary.bold}]}>
                {item.notificationItemData.descriptionBold}
              </Text>
              <Text style={[styles.messageStyle, {flexShrink: 1}]}>
                {item.notificationItemData.description}
              </Text>
            </Text>
          </View>
          <Text style={styles.dateStyle}>
            {formatNotificationDate(item.createdAt.toDate())}
            {item.notificationItemData.common && (
              <Text>{`, ${item.notificationItemData.common.name}`}</Text>
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

NotificationItem.propTypes = props;

const styles = StyleSheet.create({
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  messageContainer: {
    marginTop: 5,
    maxWidth: '90%',
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
