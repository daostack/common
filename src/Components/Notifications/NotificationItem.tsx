import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {layout, colors, text, font} from '~/Theme';
import FastImage from 'react-native-fast-image';
import NotificationBadge from './NotificationBadge';
import {CommonActions} from '@react-navigation/native';
import {InferProps, object, shape, string} from 'prop-types';
import {formatNotificationDate} from '~/Util/DateUtil';
import NotificationService from '~/Services/NotificationService';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';

const props = {
  item: shape({
    common: object,
    proposal: shape({
      id: string,
    }),
    discussion: shape({
      id: string,
    }),
    ownerAvatar: string,
    eventType: string,
    createdAt: object,
    description: string,
    descriptionBold: string,
    header: string,
    headerBold: string,
    commonName: string,
  }).isRequired,
  navigation: object.isRequired,
};

const NotificationItem: React.FC<InferProps<typeof props>> = ({
  item,
  navigation,
}) => {
  const [isRead, setRead] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const navigateToDetail = () => {
    let navigate;

    NotificationService.setNotificationClicked(item.id);
    setClicked(true);

    if (item.common) {
      navigate = CommonActions.navigate({
        name: NAVIGATION_SCREENS.COMMON_PROFILE,
        params: {
          currCommon: item.common,
        },
      });
      navigation.dispatch(navigate);
    } else if (item.proposal) {
      navigation.navigate(NAVIGATION_SCREENS.PROPOSAL_SCREEN, {
        proposalId: item.proposal.id,
      });
    } else if (item.discussion) {
      //Temporaly disabling this for a data handling issue
      // navigation.navigate(NAVIGATION_SCREENS.DISCUSSIONS, {
      //   discussionId: item.discussion.id,
      // });
    }
  };

  useEffect(() => {
    NotificationService.isNotificationClicked(item.id).then((result) =>
      setClicked(result),
    );
    NotificationService.isNotificationRead(item.id).then((result) => {
      setRead(result);
    });
    NotificationService.setNotificationRead(item.id);
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigateToDetail();
      }}>
      <View
        style={[
          styles.messageCardContainer,
          {
            backgroundColor: isClicked
              ? colors.white
              : colors.paleNotificationblue,
          },
        ]}>
        <View
          style={{flexDirection: 'column', marginLeft: 20, marginRight: 15}}>
          <FastImage
            style={styles.userImage}
            source={{
              uri: item.ownerAvatar,
            }}
          />
          {!isRead && <View style={styles.notReadDot} />}
        </View>
        <View>
          <View style={styles.headerContainer}>
            <NotificationBadge type={item.eventType} />
            <Text>
              <Text style={styles.prefixStyle}>{item.header}</Text>
              <Text style={styles.whereStyle}>{item.headerBold}</Text>
            </Text>
          </View>
          <View style={styles.messageContainer}>
            <Text numberOfLines={2} style={{flexDirection: 'row'}}>
              <Text style={[styles.messageStyle, {...font.primary.bold}]}>
                {item.descriptionBold}
              </Text>
              <Text style={[styles.messageStyle, {flexShrink: 1}]}>
                {item.description}
              </Text>
            </Text>
          </View>
          <Text style={styles.dateStyle}>
            {formatNotificationDate(item.createdAt.toDate())}
            {item.commonName && <Text>{`, ${item.commonName}`}</Text>}
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
    maxWidth: '85%',
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

export default NotificationItem;
