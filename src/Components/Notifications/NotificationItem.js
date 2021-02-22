import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {layout, colors, text, font} from '~/Theme';
import FastImage from 'react-native-fast-image';
import {string, object} from 'prop-types';
import NotificationBadge from './NotificationBadge';

const NotificationItem = ({photoURL, name, message, time, type}) => (
  <View style={styles.messageCardContainer}>
    <FastImage
      style={styles.userImage}
      source={photoURL ? {uri: photoURL} : null}
    />
    <View style={styles.messageContainer}>
      <NotificationBadge type={type} />
      <Text style={styles.nameStyle}>{name}</Text>
      <Text style={styles.messageStyle}>{message}</Text>
      {/* <Text style={styles.timeStyle}>
        {moment(time.toDate()).format('hh:mm')}
      </Text> */}
    </View>
  </View>
);

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
  messageCardContainer: {
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    padding: 0,
    marginBottom: 20,
  },
  messageContainer: {
    ...layout.content,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: colors.paleLilacTwo,
    ...layout.flexStart,
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
