import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {string, shape, object, func, bool} from 'prop-types';
import FastImage from 'react-native-fast-image';
import {observer, inject} from 'mobx-react';
import {colors, sizeM, font, text} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import moment from 'moment';
import {CommonActions} from '@react-navigation/native';
import {rootStorePropTypes} from '~/Types/propTypes';
import {ModerationMenu, Reported} from '../../Util/moderation';

const {width} = Dimensions.get('window');

const DiscussionCard = ({
  data,
  commonId,
  navigation,
  hasPermission,
  openCommonOptions,
  hiddenDiscussionNote,
  rootStore,
}) => {
  //const bottomSheetStore = rootStore.uiStore.bottomSheetStore;
  const userStore = rootStore.userStore;
  const discussionMessageStore = rootStore.discussionMessageStore;
  const discussionId = data.id;
  const user = userStore.getUserById(data.ownerId);
  const msgCount =
    discussionMessageStore.getDiscussionMessagesByDiscussionId(discussionId)
      ?.length || 0;

  const navigateToDiscussion = () => {
    if (data.moderation && data.moderation.flag === 'hidden') {
      hiddenDiscussionNote();
    } else {
      const navigate = CommonActions.navigate({
        name: 'Discussions',
        params: {
          data: data,
          discussionId: data.id,
          commonId: commonId,
          hasPermission,
        },
      });
      navigation.dispatch(navigate);
    }
  };

  /*const follow = () => {
    logger.log('Follow user id', data.ownerId);
    NotificationService.follow(data.ownerId);
    bottomSheetStore.hideBottomSheet();
  };*/

  return (
    <>
      <TouchableOpacity onPress={() => navigateToDiscussion()}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {data.title}
              <Reported reported={data.moderation.flag === 'reported'} />
            </Text>
            {hasPermission && (
              <ModerationMenu showOptions={openCommonOptions} />
            )}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {user.photoURL ? (
              <FastImage style={styles.image} source={{uri: user.photoURL}} />
            ) : (
              <View style={styles.displayNameContainer}>
                <Text style={styles.displayName}>
                  {user.displayName && user.displayName.substring(0, 1)}
                </Text>
              </View>
            )}
            <View style={styles.primaryNameContainer}>
              <Text style={styles.primaryName}>{user.displayName}</Text>
              {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
              <Text style={styles.date}>
                {moment(data.createTime.toDate()).fromNow()}
              </Text>
            </View>
          </View>
          <Text
            style={{...styles.message, ...text.writingDirection(data.message)}}
            numberOfLines={3}>
            {data.message}
          </Text>
          <View
            style={{
              backgroundColor: colors.grey4,
              height: 1,
              marginBottom: 15,
              marginTop: 10,
              marginHorizontal: -20,
            }}
          />

          {msgCount === 0 ? (
            <View style={{}}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignSelf: 'center'}}
                onPress={() => navigateToDiscussion()}>
                <Text style={styles.startTheDiscussion}>
                  Start the discussion
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.messageCountContainer}>
              <View style={styles.messageCountContainer}>
                <Icon name="discussion" size={20} />
                <Text style={styles.msgCount}>{msgCount}</Text>
              </View>
              {/* <TouchableOpacity onPress={() => navigateToDiscussion()}> */}
              <TouchableOpacity
                style={styles.navigateToDiscussion}
                onPress={() => navigateToDiscussion()}>
                <Text style={styles.joinTheDiscussion}>
                  Join the discussion
                </Text>
                <Icon name="right-arrow" size={20} color={colors.mainBlue} />
              </TouchableOpacity>
              {/* </TouchableOpacity> */}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};

DiscussionCard.propTypes = {
  data: shape({
    id: string.isRequired,
    ownerId: string.isRequired,
    title: string.isRequired,
    createTime: object.isRequired,
    message: string.isRequired,
  }),
  commonId: string,
  navigation: object.isRequired,
  hasPermission: bool,
  openCommonOptions: func,
  hiddenDiscussionNote: func,
  rootStore: rootStorePropTypes,
};

const styles = StyleSheet.create({
  messageCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    backgroundColor: colors.grey3,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  displayNameContainer: {
    backgroundColor: colors.grey3,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigateToDiscussion: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  date: {
    color: colors.formPlaceholderColor,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  message: {
    marginVertical: 10,
    lineHeight: 22,
    color: colors.black,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  joinTheDiscussion: {
    textAlign: 'right',
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.mainBlue,
  },
  msgCount: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.grey3,
    paddingHorizontal: 5,
  },
  primaryName: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
  },
  container: {
    backgroundColor: colors.white,
    // borderTopWidth: 1,
    // borderTopColor: colors.grey4,
    // borderBottomWidth: 4,
    // borderBottomColor: colors.grey4,
    marginHorizontal: 25,
    marginVertical: 10,
    borderRadius: 10,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 2,
  },
  primaryNameContainer: {
    flex: 1,
    marginLeft: sizeM,
  },
  displayName: {
    ...font.primary.bold,
    ...font.fontSize(3),
    color: colors.white,
  },
  title: {
    ...font.primary.bold,
    ...font.fontSize(3),
    marginBottom: 20,
    color: colors.black,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    ...font.primary.bold,
    ...font.fontSize(4),
    color: colors.black,
    paddingVertical: 15,
    textAlign: 'center',
  },
  bottomSheet: {
    paddingBottom: 40,
  },
  modalStyle: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  sheetText: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.against,
    marginLeft: 10,
  },
  sheetButton: {
    flexDirection: 'row',
    width: width,
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginHorizontal: 20,
    justifyContent: 'flex-start',
  },
  startTheDiscussion: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.mainBlue,
    textAlign: 'center',
  },
  textReported: {
    fontSize: 15,
    color: colors.grey3
  }
});

export default inject('rootStore', 'userStore')(observer(DiscussionCard));
