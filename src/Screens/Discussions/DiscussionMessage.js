import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import {colors, font} from '~/Theme';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {shape, string, object} from 'prop-types';
const {width} = Dimensions.get('window');

const DiscussionMessage = ({data: {
  ownerId,
  text,
  createTime,
  ownerAvatar,
  ownerName,
}}) => {
  let currentUserUid = null;
  if (auth().currentUser) {
    currentUserUid = auth().currentUser.uid;
  }

  return (
    <View style={styles.container}>
      {currentUserUid === ownerId ? (
        <View style={styles.contentOwner}>
          <Text style={styles.text}>{text}</Text>
          <View style={{position: 'relative', right: 0, bottom: 0}}>
            <Text
              style={styles.date}
              numberOfLines={1}>
              {moment(createTime.toDate()).format('hh:mm')}
            </Text>
          </View>
        </View>
      ) : (
          <>
            <View style={styles.contentMember}>
              <Image
                style={{
                  backgroundColor: colors.grey3,
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                }}
                source={ownerAvatar ? {uri: ownerAvatar} : null}
              />
              <View
                style={{
                  ...styles.contentOwner,
                  marginLeft: 10,
                  maxWidth: width - 90,
                  backgroundColor: colors.paleLilacTwo,

                }}>
                <Text style={styles.ownerName}>{ownerName}</Text>
                <Text style={styles.text}>{text}</Text>

                <Text style={styles.date}>
                  {moment(createTime.toDate()).format('hh:mm')}
                </Text>

              </View>
            </View>
          </>
      )}
    </View>
  );
};

DiscussionMessage.propTypes = {
  data: shape({
    ownerId: string,
    text: string,
    createTime: object,
    ownerAvatar: string,
    ownerName: string,
  }),
};

const styles = StyleSheet.create({
  ownerName: {
    ...font.primary.bold,
    ...font.fontSize(2),
  },
  container: {
    // backgroundColor: colors.grey4,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 3,
    padding: 10,
    flex: 1,
  },
  text: {
    marginVertical: 2,
    lineHeight: 24,
    color: colors.black,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  date: {
    color: colors.formPlaceholderColor,
    textAlign: 'right',
    ...font.primary.regular,
    ...font.fontSize(0),
  },
  contentOwner: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-end',
    // flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  contentMember: {
    flexDirection: 'row',
  },
});

export default DiscussionMessage;
