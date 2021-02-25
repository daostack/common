import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import moment from 'moment';
import {layout, colors, text, font} from '~/Theme';
import FastImage from 'react-native-fast-image';
import {string, object} from 'prop-types';
import NotificationBadge from './NotificationBadge';

const NotificationItem = ({item}) => (
  <View style={styles.messageCardContainer}>
    {/* TODO: Dynamic URL */}
    <FastImage
      style={styles.userImage}
      source={{
        uri:
          'https://www.webconsultas.com/sites/default/files/styles/wc_adaptive_image__small/public/articulos/perfil-resilencia.jpg',
      }}
    />
    <View style={styles.messageContainer}>
      <View style={styles.headerContainer}>
        <NotificationBadge type={item.eventType} />
        <Text>
          <Text style={styles.prefixStyle}>{item.header}</Text>
          <Text style={styles.whereStyle}>{item.headerBold}</Text>
        </Text>
      </View>
      <View style={{marginTop: 5}}>
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
  },
  // messageContainer: {
  //   ...layout.content,
  //   paddingVertical: 10,
  //   borderRadius: 15,
  //   backgroundColor: colors.paleLilacTwo,
  //   ...layout.flexStart,
  // },
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
