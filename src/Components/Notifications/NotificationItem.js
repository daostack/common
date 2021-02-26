import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import moment from 'moment';
import {layout, colors, text, font} from '~/Theme';
import FastImage from 'react-native-fast-image';
import {string, object} from 'prop-types';
import NotificationBadge from './NotificationBadge';
import {CommonActions} from '@react-navigation/native';

const NotificationItem = ({item, navigation}) => {
  const navigateToDetail = () => {
    let navigate;
    console.log(item);

    if (item.common) {
      navigate = CommonActions.navigate({
        name: 'CommonProfile',
        params: {
          currCommon: item.common,
        },
      });
      navigation.dispatch(navigate);
    } else if (item.proposal) {
      console.log(item.proposal);
      navigation.navigate('ProposalScreen', {
        proposalId: item.proposal.id,
      });
    } else if (item.discussion) {
      console.log(item.discussion);
      navigation.navigate('Discussions', {
        discussionId: item.discussion.id,
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigateToDetail();
      }}>
      <View style={styles.messageCardContainer}>
        <FastImage
          style={styles.userImage}
          source={{
            uri: item.ownerAvatar,
          }}
        />
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
            {moment(item.createdAt.toDate()).format('DD/MM/YYYY')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

NotificationItem.propTypes = {
  photoURL: string,
  name: string,
  message: string,
  time: object,
};

const styles = StyleSheet.create({
  userImage: {
    width: 42,
    height: 42,
    marginLeft: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
    marginRight: 15,
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
    padding: 0,
    marginVertical: 20,
    marginTop: 5,
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
