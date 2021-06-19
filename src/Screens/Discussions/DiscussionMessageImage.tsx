import React, {useState, useEffect, useCallback, FC} from 'react';
import {observer, inject} from 'mobx-react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, font, layout} from '~/Theme';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {NAVIGATION_SCREENS} from '~/Util/constants/routes.enum';
import {reporterName} from '~/Components/Moderation/Reported';
import {FLAGS} from '~/Components/Moderation/constants';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import Icon from '~/Assets/iconfont/Icon';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import {IDiscussionMessageEntity} from '~/Firebase/Databasee/EntityTypes/IDiscussionMessageEntity';
import RootStore from '~/Stores/RootStore';

const {width} = Dimensions.get('window');

type FlagViewProps = {
  isModerator: boolean;
  isHidden: boolean;
  isFlagged: boolean;
  moderatorName: string;
  flag: string;
};

const FlagView: FC<FlagViewProps> = ({
  isModerator,
  isHidden,
  isFlagged,
  moderatorName,
  flag,
}) => {
  if (!isFlagged) {
    return null;
  }

  return (
    <View style={{flexDirection: 'row', marginLeft: isHidden ? 30 : 0}}>
      {isHidden && (
        <Icon
          name={'hidden'}
          style={layout.marginRightS}
          color={colors.grey3}
        />
      )}
      <Text style={{...styles.hiddenTitle, color: colors.grey3}}>
        {_.upperFirst(flag)}
        {isHidden && !isModerator ? '' : ` by ${moderatorName}`}
      </Text>
    </View>
  );
};

type DateViewProps = {
  data: IDiscussionMessageEntity;
};

const DateView: FC<DateViewProps> = ({data}) => (
  <Text style={styles.date}>
    {moment(data.createTime.toDate()).format('HH:mm')}
  </Text>
);

type DiscussionMessageImageProps = {
  data: IDiscussionMessageEntity;
  rootStore: RootStore;
  commonId: string;
  openMessageOptions: any;
  isMember: boolean;
  viewerPermission: any;
};

const DiscussionMessageImage: FC<DiscussionMessageImageProps> = ({
  data,
  rootStore,
  commonId,
  openMessageOptions,
  isMember,
  viewerPermission,
}) => {
  const isHidden = data.moderation?.flag === FLAGS.hidden;
  const flag = data.moderation?.flag || '';
  const [permission, setPermission] = useState('');
  const userStore = rootStore.userStore;
  const authStore = rootStore.authStore;
  const isFlagged = !!flag && flag !== FLAGS.visible;
  const isOwner = authStore.isCurrentlyLogged(data.ownerId);
  const currentUserUid = auth().currentUser ? auth().currentUser?.uid : null;
  const isModerator = viewerPermission === PERMISSIONS.MODERATOR;
  const navigation = useNavigation();
  const ownerInfo = userStore.getUserById(data.ownerId);

  const goToUserProfile = useCallback(() => {
    navigation.navigate(NAVIGATION_SCREENS.PROFILE, {
      userId: ownerInfo?.id,
      ownerInfo,
    });
  }, [ownerInfo]);

  const moderatorInfo =
    data.moderation &&
    userStore.getUserById(
      data?.moderation?.moderator || data?.moderation?.reporter,
    );
  const moderatorName = reporterName(moderatorInfo!, currentUserUid!);

  useEffect(() => {
    const userPermission = authStore.getPermission(commonId, ownerInfo!.id);
    if (userPermission) {
      setPermission(userPermission);
    }
  }, []);

  const handleOpenFullScreen = useCallback(() => {
    navigation.navigate(NAVIGATION_SCREENS.DISCUSSION_FULL_SCREEN_IMAGE, {
      userId: ownerInfo?.id,
      userAvatar: ownerInfo?.photoURL,
      userName: ownerInfo?.displayName,
      imageUrl: data.image?.url,
      createTime: data.createTime,
      isModerator: isModerator,
      openMessageOptions: openMessageOptions,
    });
  }, []);

  return (
    <Pressable
      style={styles.container}
      onLongPress={() =>
        (!isHidden || viewerPermission) &&
        isMember &&
        !isOwner &&
        openMessageOptions()
      }>
      {currentUserUid === data.ownerId ? (
        <View style={styles.contentOwnerContainer}>
          <View
            style={{
              ...styles.contentOwner,
              backgroundColor: isHidden ? colors.paleLilacTwo : colors.white,
              alignItems: isHidden ? 'flex-start' : 'flex-end',
              elevation: 2,
            }}>
            <FlagView
              {...{isModerator, isHidden, isFlagged, moderatorName, flag}}
            />
            {(!isHidden || viewerPermission) && (
              <TouchableOpacity
                onPress={handleOpenFullScreen}
                style={styles.imageContainer}>
                <FastImage
                  resizeMode={'cover'}
                  source={{uri: data.image!.url}}
                  style={styles.messageImage}
                />
                {!isHidden && <DateView {...{isHidden, data}} />}
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <>
          <View style={styles.contentMember}>
            <View>
              <TouchableOpacity onPress={goToUserProfile}>
                <Image
                  style={styles.avatarImage}
                  // @ts-ignore
                  source={ownerInfo && {uri: ownerInfo.photoURL}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                ...styles.contentOwner,
                marginLeft: 10,
                maxWidth: width - 90,
                backgroundColor: isHidden
                  ? colors.paleLilacTwo
                  : colors.mainBlueOpacity,
              }}>
              {(!isHidden || viewerPermission) && (
                <TouchableOpacity
                  onPress={handleOpenFullScreen}
                  style={styles.imageContainer}>
                  <FastImage
                    source={{uri: data.image!.url}}
                    style={styles.messageImage}
                  />
                  {!isHidden && <DateView {...{isHidden, data}} />}
                </TouchableOpacity>
              )}

              <View style={styles.userTitleView}>
                <Text style={styles.ownerName}>{ownerInfo?.displayName}</Text>
                {!isHidden && (
                  <Text style={styles.permission}>{permission}</Text>
                )}
                <FlagView
                  {...{isModerator, isHidden, isFlagged, moderatorName, flag}}
                />
              </View>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ownerName: {
    ...font.primary.bold,
    ...font.fontSize(2),
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  permission: {
    ...font.primary.bold,
    fontSize: 13,
    color: colors.white,
    marginLeft: 10,
  },
  hiddenTitle: {
    ...font.primary.bold,
    fontSize: 13,
  },
  container: {
    borderRadius: 8,
    marginVertical: 3,
    padding: 10,
    flex: 1,
  },
  text: {
    flexShrink: 1,
    marginVertical: 2,
    lineHeight: 24,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  date: {
    position: 'absolute',
    ...font.primary.regular,
    color: colors.white,
    fontSize: 10,
    marginVertical: 2,
    bottom: 8,
    right: 10,
  },
  contentOwnerContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  contentOwner: {
    borderRadius: 15,
    alignSelf: 'flex-end',
    flexShrink: 1,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.2,
  },
  contentMember: {
    flexDirection: 'row',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    padding: 10,
  },
  messageImage: {
    height: 168,
    width: 279,
    backgroundColor: colors.grey3,
    borderRadius: 15,
  },
  avatarImage: {
    backgroundColor: colors.grey3,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

export default inject('rootStore')(observer(DiscussionMessageImage));
