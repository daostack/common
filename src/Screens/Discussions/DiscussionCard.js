import {CommonActions} from '@react-navigation/native';
import {inject, observer} from 'mobx-react';
import moment from 'moment';
import {bool, func, object, shape, string} from 'prop-types';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font, sizeM, text} from '~/Theme';
import {rootStorePropTypes} from '~/Types/propTypes';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import DiscussionCardHeader from '../../Components/Discussion/DiscussionCardHeader';
import {FLAGS} from '../../Components/Moderation/constants';
import ModerationMenu from '../../Components/Moderation/ModerationMenu';

const {width} = Dimensions.get('window');

const DiscussionCard = ({
  data,
  commonId,
  navigation,
  openCommonOptions,
  hiddenDiscussionNote,
  rootStore,
  isMember,
  viewerPermission,
}) => {
  const userStore = rootStore.userStore;
  const authStore = rootStore.authStore;
  const discussionMessageStore = rootStore.discussionMessageStore;
  const msgCount = data.messageCount || 0;
  const hasPermission = authStore.getPermission(
    commonId,
    authStore?.userInfo?.uid,
  );
  const showHeader =
    data.moderation?.flag === FLAGS.hidden ||
    (data.moderation?.flag === FLAGS.reported &&
      viewerPermission === PERMISSIONS.MODERATOR);

  const isVisible = data.moderation?.flag !== FLAGS.hidden || !data.moderation;
  const showCard = isVisible || (!isVisible && hasPermission);
  const isOwner = authStore.isCurrentlyLogged(data.ownerId);

  const navigateToDiscussion = () => {
    if (data.isModerationHidden) {
      hiddenDiscussionNote();
    } else {
      const navigate = CommonActions.navigate({
        name: 'Discussions',
        params: {
          data: data,
          discussionId: data.id,
          commonId: commonId,
        },
      });
      navigation.dispatch(navigate);
    }
  };

  const getReporter = () =>
    data.moderation?.reporter &&
    userStore.getUserById(data.moderation?.reporter);

  /*const follow = () => {
    logger.log('Follow user id', data.ownerId);
    NotificationService.follow(data.ownerId);
    bottomSheetStore.hideBottomSheet();
  };*/

  return (
    <>
      <TouchableOpacity onPress={() => navigateToDiscussion()}>
        <View style={styles.containerView}>
          {showHeader && (
            <DiscussionCardHeader
              isReported={data.moderation?.flag !== FLAGS.visible}
              moderation={data.moderation}
              reporter={getReporter()}
              hasPermission={hasPermission}
              viewerPermission={viewerPermission}
            />
          )}
          {showCard && (
            <View style={styles.container}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {data.title}
                </Text>
                {(!discussionMessageStore.isModerationHidden ||
                  hasPermission) &&
                  isMember &&
                  !isOwner && (
                    <ModerationMenu showOptions={openCommonOptions} />
                  )}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {data.owner?.photo ? (
                  <FastImage
                    style={styles.image}
                    source={{uri: data.owner.photo}}
                  />
                ) : (
                  <View style={styles.displayNameContainer}>
                    <Text style={styles.displayName}>
                      {data.owner?.displayName &&
                        data.owner?.displayName.substring(0, 1)}
                    </Text>
                  </View>
                )}
                <View style={styles.primaryNameContainer}>
                  <Text style={styles.primaryName}>
                    {data.owner?.displayName}
                  </Text>
                  {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
                  <Text style={styles.date}>
                    {moment(data.createTime).fromNow()}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  ...styles.message,
                  ...text.writingDirection(data.message),
                }}
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
                    <Icon
                      name="right-arrow"
                      size={20}
                      color={colors.mainBlue}
                    />
                  </TouchableOpacity>
                  {/* </TouchableOpacity> */}
                </View>
              )}
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
  openCommonOptions: func,
  hiddenDiscussionNote: func,
  rootStore: rootStorePropTypes,
  isMember: bool,
  viewerPermission: string,
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
  containerView: {
    backgroundColor: colors.white,
    marginHorizontal: 25,
    marginVertical: 10,
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 2,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
    color: colors.grey3,
  },
});

export default inject('rootStore', 'userStore')(observer(DiscussionCard));
