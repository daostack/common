import React from 'react';
import {observer, inject} from 'mobx-react';
import {StyleSheet, Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, font, text as textjs} from '~/Theme';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {shape, string, object, bool} from 'prop-types';
import Hyperlink from 'react-native-hyperlink';
import {userStorePropTypes} from '~/Types/propTypes';
import {NAVIGATION_SCREENS} from '../../Util/constants/routes.enum';

const {width} = Dimensions.get('window');

const DiscussionMessage = ({
  data: {ownerId, text, createTime},
  showCurrentUserAvatar,
  userStore,
}) => {
  let currentUserUid = null;
  if (auth().currentUser) {
    currentUserUid = auth().currentUser.uid;
  }

  const navigation = useNavigation();
  const ownerInfo = userStore.getUserById(ownerId);

  function goToUserProfile() {
    navigation.navigate(NAVIGATION_SCREENS.PROFILE, {userId: ownerInfo.id, ownerInfo});
  }

  return (
    <View style={styles.container}>
      {currentUserUid === ownerId ? (
        <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
          {showCurrentUserAvatar && (
            <TouchableOpacity onPress={goToUserProfile}>
              <Image
                style={{
                  backgroundColor: colors.grey3,
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  justify: 'flex-end',
                  marginLeft: 10,
                }}
                source={ownerInfo && {uri: ownerInfo.photoURL}}
              />
            </TouchableOpacity>
          )}

          <View style={styles.contentOwner}>
            <Hyperlink linkDefault={true} linkStyle={styles.hyperLinkStyle}>
              <Text
                style={{...styles.text, ...textjs.writingDirection(text)}}
                selectable>
                {text}
              </Text>
            </Hyperlink>
            <View style={{position: 'relative', right: 0, bottom: 0}}>
              <Text style={styles.date} numberOfLines={1}>
                {moment(createTime.toDate()).format('HH:mm')}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.contentMember}>
            <View>
            <TouchableOpacity onPress={goToUserProfile}>
                <Image
                  style={{
                    backgroundColor: colors.grey3,
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                  }}
                  source={ownerInfo && {uri: ownerInfo.photoURL}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                ...styles.contentOwner,
                marginLeft: 10,
                maxWidth: width - 90,
                backgroundColor: colors.paleLilacTwo,
              }}>
              <Text style={styles.ownerName}>{ownerInfo?.displayName}</Text>
              <Hyperlink linkDefault={true} linkStyle={styles.hyperLinkStyle}>
                <Text
                  style={{...styles.text, ...textjs.writingDirection(text)}}
                  selectable>
                  {text}
                </Text>
              </Hyperlink>

              <Text style={styles.date}>
                {moment(createTime.toDate()).format('HH:mm')}
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
  }),
  showCurrentUserAvatar: bool,
  userStore: userStorePropTypes,
};

const styles = StyleSheet.create({
  hyperLinkStyle: {
    textDecorationLine: 'underline',
    color: colors.mainBlue,
  },
  ownerName: {
    ...font.primary.bold,
    ...font.fontSize(2),
  },
  container: {
    // backgroundColor: colors.grey4,
    borderRadius: 8,
    // marginHorizontal: 10,
    marginVertical: 3,
    padding: 10,
    flex: 1,
  },
  text: {
    flexShrink: 1,
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
    flexShrink: 1,
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

export default inject('userStore')(observer(DiscussionMessage));
