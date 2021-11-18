import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {observer} from 'mobx-react';
import {colors, sizeM, font, text} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import moment from 'moment';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {EditType, PERMISSIONS} from '~/Types';
import {ModerationMenu} from '~/Components/Moderation/ModerationMenu';
import {DiscussionCardHeader} from '~/Components/Discussion';
import {FLAGS} from '~/Components/Moderation/constants';
import {Common, Discussion} from '~/Stores/Models';
import {useStore} from '~/Stores';

const {width} = Dimensions.get('window');

interface DiscussionCardProps {
  discussion: Discussion;
  common: Common;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = observer(
  ({discussion, common}) => {
    const navigation = useNavigation();
    const {
      userStore,
      authStore,
      discussionMessageStore,
      uiStore: {bottomSheetStore},
    } = useStore();
    const owner = userStore.getUserById(discussion.ownerId);
    const msgCount =
      discussionMessageStore.getDiscussionMessages(discussion)?.length || 0;
    const ownerPermissions = common.getPermission(owner.uid);
    const showHeader =
      discussion.moderation?.flag === FLAGS.hidden ||
      (discussion.moderation?.flag === FLAGS.reported &&
        common.getPermission() === PERMISSIONS.MODERATOR);

    const isVisible =
      discussion.moderation?.flag !== FLAGS.hidden || !discussion.moderation;
    const showCard = isVisible || (!isVisible && ownerPermissions);
    const isOwner = authStore.uid === owner.id;

    const navigateToDiscussion = () => {
      if (discussion.isModerationHidden && discussion.moderation) {
        bottomSheetStore.showHiddenNote(
          discussion.moderation,
          EditType.rules,
          common.isModerator,
        );
      } else {
        const navigate = CommonActions.navigate({
          name: 'Discussions',
          params: {
            data: discussion,
            discussionId: discussion.id,
            commonId: common.id,
          },
        });
        navigation.dispatch(navigate);
      }
    };

    const getReporter = () =>
      discussion.moderation?.reporter &&
      userStore.getUserById(discussion.moderation?.reporter);

    /*const follow = () => {
      logger.log('Follow user id', data.ownerId);
      NotificationService.follow(data.ownerId);
      bottomSheetStore.hideBottomSheet();
    };*/

    //       {
    //         userName: reporterName(userStore.getUserById(moderation.moderator)),
    //         date: timeReported(moderation.updatedAt),
    //         reasons: moderation.reasons,
    //         moderatorNote: moderation?.moderatorNote,
    //         type,
    //         isModerator,
    //       },

    return (
      <>
        <TouchableOpacity onPress={() => navigateToDiscussion()}>
          <View style={styles.containerView}>
            {showHeader && (
              <DiscussionCardHeader discussion={discussion} common={common} />
            )}
            {showCard && (
              <View style={styles.container}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title} numberOfLines={2}>
                    {discussion.title}
                  </Text>
                  {(!discussion.isModerationHidden || ownerPermissions) &&
                    common.isMember &&
                    !isOwner && (
                      <ModerationMenu
                        moderation={discussion.moderation}
                        common={common}
                      />
                    )}
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {owner.photoURL ? (
                    <FastImage
                      style={styles.image}
                      source={{uri: owner.photoURL}}
                    />
                  ) : (
                    <View style={styles.displayNameContainer}>
                      <Text style={styles.displayName}>
                        {owner.displayName && owner.displayName.substring(0, 1)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.primaryNameContainer}>
                    <Text style={styles.primaryName}>{owner.displayName}</Text>
                    {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
                    <Text style={styles.date}>
                      {moment(discussion.createTime).fromNow()}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    ...styles.message,
                    ...text.writingDirection(discussion.message),
                  }}
                  numberOfLines={3}>
                  {discussion.message}
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
  },
);

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
