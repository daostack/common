import React, {useState, useEffect} from 'react';
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
import {colors, font, text as textjs, layout} from '~/Theme';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {shape, string, object, bool, func} from 'prop-types';
import Hyperlink from 'react-native-hyperlink';
import {rootStorePropTypes} from '~/Types/propTypes';
import {NAVIGATION_SCREENS} from '../../Util/constants/routes.enum';
import {HyperText} from '~/Components/Text/HyperText';
import {reporterName} from '../../Components/Moderation/Reported';
import {FLAGS} from '../../Components/Moderation/constants';
import {PERMISSIONS} from '~/Util/constants/permissions.enum';
import Icon from '~/Assets/iconfont/Icon';
import _ from 'lodash';

const {width} = Dimensions.get('window');

const DiscussionMessage = ({
  data,
  showCurrentUserAvatar,
  rootStore,
  commonId,
  openMessageOptions,
  isMember,
  viewerPermission,
}) => {
  let currentUserUid = null;
  const isHidden = false; // TODO: data.moderation?.flag === FLAGS.hidden;
  const flag = ''; // TODO: data.moderation?.flag || '';
  const [permission, setPermission] = useState('');
  const userStore = rootStore.userStore;
  const authStore = rootStore.authStore;
  const isFlagged = !!flag && flag !== FLAGS.visible;
  const isOwner = authStore.isCurrentlyLogged(data.userId);

  const isModerator = viewerPermission === PERMISSIONS.MODERATOR;

  if (auth().currentUser) {
    currentUserUid = auth().currentUser.uid;
  }

  const navigation = useNavigation();
  const ownerInfo = userStore.getUserById(data.userId);

  function goToUserProfile() {
    navigation.navigate(NAVIGATION_SCREENS.PROFILE, {
      userId: ownerInfo.id,
      ownerInfo,
    });
  }
  // TODO: implement moderation for messages
  const moderatorInfo =
    data.moderation &&
    userStore.getUserById(
      data?.moderation?.moderator || data?.moderation?.reporter,
    );
  const moderatorName = reporterName(moderatorInfo, currentUserUid);
  useEffect(() => {
    (async () => {
      const userPermission = await authStore.getPermission(
        commonId,
        ownerInfo.id,
      );
      if (userPermission) {
        setPermission(userPermission);
      }
    })();
  }, []);

  const flagView = (isModerator || isHidden) && isFlagged && (
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

  const dateView = () => (
    <Text
      style={{
        ...styles.date,
        color: isHidden ? colors.grey3 : colors.formPlaceholderColor,
      }}>
      {moment(data.createdAt).format('HH:mm')}
    </Text>
  );

  return (
    <Pressable
      style={styles.container}
      onLongPress={() =>
        (!isHidden || viewerPermission) &&
        isMember &&
        !isOwner &&
        openMessageOptions()
      }>
      {currentUserUid === data.userId ? (
        <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <View
            style={{
              ...styles.contentOwner,
              backgroundColor: isHidden ? colors.paleLilacTwo : colors.white,
              alignItems: isHidden ? 'flex-start' : 'flex-end',
              elevation: 2,
            }}>
            {flagView}
            {(!isHidden || viewerPermission) && (
              <View style={styles.textContainer}>
                <HyperText
                  textStyle={{
                    ...styles.text,
                    color: isHidden ? colors.grey3 : colors.black,
                    ...textjs.writingDirection(data.message),
                    maxWidth: '93%',
                    minWidth: '20%',
                  }}
                  selectable>
                  {data.message}
                </HyperText>
                {!isHidden && dateView()}
              </View>
            )}
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
                backgroundColor: isHidden
                  ? colors.paleLilacTwo
                  : colors.mainBlueOpacity,
              }}>
              <Hyperlink linkDefault={true} linkStyle={styles.hyperLinkStyle}>
                <View style={styles.userTitleView}>
                  <Text
                    style={{
                      ...styles.ownerName,
                      color: isHidden ? colors.grey3 : colors.black,
                    }}>
                    {ownerInfo?.displayName}
                  </Text>
                  {!isHidden && (
                    <Text style={styles.permission}>{permission}</Text>
                  )}
                  {flagView}
                </View>
              </Hyperlink>
              {(!isHidden || viewerPermission) && (
                <View style={styles.textContainer}>
                  <HyperText
                    textStyle={{
                      ...styles.text,
                      color: isHidden ? colors.grey3 : colors.black,
                      ...textjs.writingDirection(data.message),
                      maxWidth: '93%',
                      minWidth: '40%',
                    }}>
                    {data.message}
                  </HyperText>
                  {!isHidden && dateView()}
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
};

DiscussionMessage.propTypes = {
  data: shape({
    userId: string,
    message: string,
    createTime: object,
  }),
  showCurrentUserAvatar: bool,
  hasPermission: string,
  rootStore: rootStorePropTypes,
  commonId: string,
  openMessageOptions: func,
  isMember: bool,
  viewerPermission: string,
};

const styles = StyleSheet.create({
  hyperLinkStyle: {
    textDecorationLine: 'underline',
    color: colors.mainBlue,
    flexDirection: 'row',
  },
  ownerName: {
    ...font.primary.bold,
    ...font.fontSize(2),
  },
  permission: {
    ...font.primary.bold,
    fontSize: 13,
    color: colors.grey3,
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
    textAlign: 'right',
    ...font.primary.regular,
    fontSize: 10,
    marginVertical: 2,
    alignSelf: 'flex-end',
  },
  contentOwner: {
    padding: 12,
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
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default inject('rootStore')(observer(DiscussionMessage));
