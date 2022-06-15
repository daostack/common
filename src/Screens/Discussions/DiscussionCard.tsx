import {CommonActions, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import moment from 'moment';
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
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import {useStore} from '~/Util/hooks/useStore';
import DiscussionCardHeader from '../../Components/Discussion/DiscussionCardHeader';
import {FLAGS} from '../../Components/Moderation/constants';
import ModerationMenu from '../../Components/Moderation/ModerationMenu';

const {width} = Dimensions.get('window');

interface DiscussionCardProps {
  data: {
    id: string;
    ownerId: string;
    title: string;
    createTime: string;
    message: string;
  };
  commonId: string;
  openCommonOptions: () => void;
  hiddenDiscussionNote: () => void;
  viewerPermission: string;
}

export const DiscussionCard = observer((props: DiscussionCardProps) => {
  const {
    data,
    commonId,
    openCommonOptions,
    hiddenDiscussionNote,
    viewerPermission,
  } = props;
  const navigation = useNavigation();
  const rootStore = useStore('rootStore');
  const userStore = rootStore.userStore;
  const authStore = rootStore.authStore;
  const discussionMessageStore = rootStore.discussionMessageStore;
  const user = userStore.getUserById(data.ownerId);
  const hasPermission = authStore.getPermission(
    commonId,
    authStore?.userInfo?.uid,
  );
  const showHeader =
    data.moderation?.flag === FLAGS.hidden ||
    data.moderation?.flag === FLAGS.reported;

  const isVisible = data.moderation?.flag !== FLAGS.hidden || !data.moderation;
  const showCard =
    isVisible || (!isVisible && hasPermission === PERMISSIONS.MODERATOR);
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

  return (
    <>
      <TouchableOpacity
        style={[styles.cardContainer, showCard ? styles.containerBorders : {}]}
        onPress={() => navigateToDiscussion()}>
        {showHeader && (
          <DiscussionCardHeader
            isReported={data.moderation?.flag !== FLAGS.visible}
            moderation={data.moderation}
            reporter={getReporter()}
            hasPermission={hasPermission}
            viewerPermission={viewerPermission}
            showCard={showCard}
          />
        )}
        {showCard && (
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {data.title}
              </Text>
              {!discussionMessageStore.isModerationHidden && !isOwner && (
                <ModerationMenu showOptions={openCommonOptions} />
              )}
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {user?.photoURL ? (
                <FastImage
                  style={styles.image}
                  source={{uri: user?.photoURL}}
                />
              ) : (
                <View style={styles.displayNameContainer}>
                  <Text style={styles.displayName}>
                    {user?.displayName && user?.displayName.substring(0, 1)}
                  </Text>
                </View>
              )}
              <View style={styles.primaryNameContainer}>
                <Text style={styles.primaryName}>{user?.displayName}</Text>
                <Text style={styles.date}>
                  {moment(data.createTime.toDate()).fromNow()}
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
            <View style={styles.divider} />

            <View style={styles.messageCountContainer}>
              <View style={styles.messageCountContainer}>
                <Icon name="discussion" size={20} />
                <Text style={styles.msgCount}>{data.messageCount}</Text>
              </View>
              <TouchableOpacity
                style={styles.navigateToDiscussion}
                onPress={() => navigateToDiscussion()}>
                <Text style={styles.joinTheDiscussion}>
                  Join the discussion
                </Text>
                <Icon name="right-arrow" size={20} color={colors.mainBlue} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </>
  );
});

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
    marginVertical: 16,
    lineHeight: 22,
    color: colors.black,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  joinTheDiscussion: {
    textAlign: 'right',
    ...font.primary.bold,
    fontSize: 16,
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
  cardContainer: {
    backgroundColor: colors.white,
    marginBottom: 24,
    marginHorizontal: 24,
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 2,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  container: {
    padding: 16,
  },
  containerBorders: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
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
    fontSize: 16,
    marginBottom: 8,
    color: colors.black,
    maxWidth: width * 0.67,
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
  divider: {
    backgroundColor: colors.grey4,
    height: 1,
    marginBottom: 15,
    marginHorizontal: -16,
  },
});
