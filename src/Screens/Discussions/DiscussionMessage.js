import React, {useState, useEffect} from 'react';
import {observer, inject} from 'mobx-react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import {colors, font, text as textjs} from '~/Theme';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {shape, string, object, bool, func} from 'prop-types';
import Hyperlink from 'react-native-hyperlink';
import {userStorePropTypes} from '~/Types/propTypes';
import {rootStorePropTypes} from '~/Types/propTypes';

const {width} = Dimensions.get('window');

const DiscussionMessage = ({
  data,
  showCurrentUserAvatar,
  hasPermission,
  userStore,
  rootStore,
  commonId,
  openMessageOptions,
}) => {
  let currentUserUid = null;
  const isHidden = data.moderation?.flag === 'hidden';
  const [permission, setPermission] = useState('');

  const action = hasPermission ? (isHidden ? 'Show' : 'Hide') : 'Report';
  if (auth().currentUser) {
    currentUserUid = auth().currentUser.uid;
  }

  const ownerInfo = userStore.getUserById(data.ownerId);
  const moderatorInfo = data.moderation && userStore.getUserById(data.moderation?.moderator);
  const moderatorName = moderatorInfo?.uid === currentUserUid ? 'you' : `${moderatorInfo?.firstName || ''} ${moderatorInfo?.lastName || ''}`;

  useEffect(() => {
    (async () => {
      const userPermission = await rootStore.authStore.getPermission(commonId, ownerInfo);
      setPermission(userPermission);
    })();

  }, []);

  // icon missing
  const hiddenView = isHidden && <Text style={{...styles.hiddenTitle, color: colors.grey3, marginLeft: 30}} >Hidden by {moderatorName}</Text>;


  const dateView = () =>
    <Text style={{...styles.date, color: isHidden ? colors.grey3 : colors.formPlaceholderColor}}>
      {moment(data.createTime.toDate()).format('HH:mm')}
    </Text>;

  return (
    <Pressable style={styles.container} onLongPress={() => openMessageOptions(action, data)}>

      {currentUserUid === data.ownerId ? (
        <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
          {showCurrentUserAvatar && (
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
          )}

          <View style={{...styles.contentOwner, backgroundColor: isHidden ? colors.paleLilacTwo : colors.white}}>
            {hiddenView}
            <Hyperlink linkDefault={true} linkStyle={styles.hyperLinkStyle}>
              <Text
                style={{...styles.text, color: isHidden ? colors.grey3 : colors.black, ...textjs.writingDirection(data.text)}}
                selectable>
                {data.text}
              </Text>
            </Hyperlink>
            <View style={{position: 'relative', right: 0, bottom: 0}}>
              {dateView()}
            </View>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.contentMember}>
            <View>
              <Image
                style={{
                  backgroundColor: colors.grey3,
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                }}
                source={ownerInfo && {uri: ownerInfo.photoURL}}
              />
            </View>
            <View
              style={{
                ...styles.contentOwner,
                marginLeft: 10,
                maxWidth: width - 90,
                backgroundColor: isHidden ? colors.paleLilacTwo : colors.white,
              }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}} >
              <Text style={{...styles.ownerName, color: isHidden ? colors.grey3 : colors.black}}>{ownerInfo?.displayName}</Text>
              {!isHidden && <Text style={{...styles.ownerName, color: colors.grey3}}>{permission}</Text>}
              {hiddenView}
              </View>
              {(!isHidden || hasPermission) && <Hyperlink linkDefault={true} linkStyle={styles.hyperLinkStyle}>
                <Text
                  style={{...styles.text, color: isHidden ? colors.grey3 : colors.black, ...textjs.writingDirection(data.text)}}
                  selectable>
                  {data.text}
                </Text>
              </Hyperlink>}
              {dateView()}
            </View>
          </View>
        </>
      )}
    </Pressable>
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
  bottomSheetStore: object,
  hasPermission: bool,
  rootStore: rootStorePropTypes,
  commonId: string,
  openMessageOptions: func,
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
  hiddenTitle: {
    ...font.primary.bold,
    ...font.fontSize(1),
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
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  date: {
    textAlign: 'right',
    ...font.primary.regular,
    ...font.fontSize(0),
  },
  contentOwner: {
    //backgroundColor: colors.white,
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

export default inject('userStore', 'rootStore')(observer(DiscussionMessage));
