import React, {useEffect} from 'react';
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
import {BOTTOM_SHEET_TEMPLATES} from '~/Screens/BottomSheetScreens';
import ModerationService from '~/Services/ModerationService';

const {width} = Dimensions.get('window');

const DiscussionMessage = ({
  data,
  outcome,
  showCurrentUserAvatar,
  userListStore,
  bottomSheetStore,
  hasPermission,
}) => {
  let currentUserUid = null;
  const isHidden = data.moderation?.flag === 'hidden';
  const actionType = isHidden ? 'Show' : 'Hide';
  if (auth().currentUser) {
    currentUserUid = auth().currentUser.uid;
  }

  const [outcomeState, setOutcomeState] = React.useState();
  const ownerInfo = userListStore.getUserById(data.ownerId);

  useEffect(() => {
    if (typeof outcome === 'object') {
      outcome.then((out) => setOutcomeState(out));

      console.log(typeof outcomeState);
    }
  }, [outcome]);

  const onModerate = async () => {
    bottomSheetStore.hideBottomSheet();
    if (actionType === 'Show') {
      //show message
    } else {
      const moderation = {itemId: data.id};
      await ModerationService.getInstance().hide('DiscussionMessage', data.commonId, moderation);
    }
  };

  const openMessageOptions = () => {
    if (hasPermission) {
      bottomSheetStore.showBottomSheet(
        BOTTOM_SHEET_TEMPLATES.SCREEN_COMMON_PROFILE_OPTIONS,
        {
          onAction: () => onModerate(),
          moderatorOptions: {
            data,
            actions: [actionType],
          },
        },
      );
    }
  };

  // icon missing
  const hiddenView = isHidden && <Text style={{...styles.ownerName, color: colors.grey3, marginLeft: 30}} >Hidden</Text>;


  const dateView = () =>
    <Text style={{...styles.date, color: isHidden ? colors.grey3 : colors.formPlaceholderColor}}>
      {moment(data.createTime.toDate()).format('HH:mm')}
    </Text>;

  return (
    <Pressable style={styles.container} onLongPress={() => openMessageOptions()}>
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
              <View style={{flexDirection: 'row'}} >
              <Text style={{...styles.ownerName, color: isHidden ? colors.grey3 : colors.black}}>{ownerInfo?.displayName}</Text>
              {hiddenView}
              </View>
              <Hyperlink linkDefault={true} linkStyle={styles.hyperLinkStyle}>
                <Text
                  style={{...styles.text, color: isHidden ? colors.grey3 : colors.black, ...textjs.writingDirection(data.text)}}
                  selectable>
                  {data.text}
                </Text>
              </Hyperlink>
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
  outcome: shape({
    then: func.isRequired,
    catch: func.isRequired,
  }),
  showCurrentUserAvatar: bool,
  userListStore: shape({
    getUserById: func,
  }),
  bottomSheetStore: object,
  hasPermission: bool
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

export default inject('userListStore', 'bottomSheetStore')(observer(DiscussionMessage));
