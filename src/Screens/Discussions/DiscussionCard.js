import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {string, shape, object} from 'prop-types';
import FastImage from 'react-native-fast-image';
import {observer, inject} from 'mobx-react';
import {colors, sizeM, font} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import UserService from '../../Services/UserService';
import moment from 'moment';
import BottomSheetModal from '../../Components/BottomSheetModal';
import NotificationService from '../../Services/NotificationService';
import {BOTTOM_SHEET_TEMPLATES} from '../../Stores/BottomSheetStore';
import {db} from '../../Firebase';
import logger from '../../Services/Logger';

const {width} = Dimensions.get('window');

const DiscussionCard = ({
  data,
  commonId,
  userStore: {userInfo},
  navigation,
  bottomSheetStore,
}) => {
  //when will data.owner be not undefined?
  const discussionId = data.id;
  const [user, setUser] = useState({});
  const [msgCount, setMsgCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  var isFollowing = false;

  if (userInfo) {
    isFollowing = userInfo.following.includes(data.owner);
  }

  const hideMenu = () => {
    setShowMenu(false);
  };

  const navigateToDiscussion = () => {
    navigation.navigate('Discussions', {
      data: data,
      discussionId: data.id,
      commonId: commonId,
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await UserService.getInstance().getUserById(
        data.ownerId,
      );
      if (userData) {
        // logger.log('userData', userData);
        setUser(userData);
      }
    };
    fetchUser();
  }, [data]);

  useEffect(() => {
    const unsubscribe = db.collection('discussionMessage')
      .where('discussionId', '==', discussionId)
      .onSnapshot((snapshot) => {
        setMsgCount(snapshot.docs.length);
      });

    return () => {
      unsubscribe();
    };
  }, [discussionId]);

  const follow = () => {
    logger.log('Follow user id', data.owner);
    NotificationService.follow(data.owner);
    bottomSheetStore.hideBottomSheet();
  };

  const showOptions = () => {
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_OPTIONS,
      {onFollow: follow},
    );
  };

  return (
    <>
      <TouchableOpacity onPress={() =>navigateToDiscussion()}      >
        <View style={styles.container}>
          <TouchableOpacity onPress={showOptions}>
            <Icon name="menu" size={20} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={2}>
            {data.title}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {
              user.photoURL ? <FastImage
                style={styles.image}
                source={{uri: user.photoURL}}
              /> : <View
                style={styles.displayNameContainer}
              >
                <Text style={styles.displayName}>
                  {user.displayName && user.displayName.substring(0,1)}
                </Text>
              </View>

            }
            <View style={styles.primaryNameContainer}>
              <Text
                style={styles.primaryName}>
                {user.displayName}
              </Text>
              {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
              <Text style={styles.date}>
                {moment(data.createTime.toDate()).fromNow()}
              </Text>
            </View>
          </View>
          <Text style={styles.message}     numberOfLines={3}>
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
                <Text
                  style={styles.startTheDiscussion}>
                  Start the discussion
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.messageCountContainer}>
              <View style={styles.messageCountContainer}>
                <Icon name="discussion" size={20} />
                <Text
                  style={styles.msgCount}>
                  {msgCount}
                </Text>
              </View>
              {/* <TouchableOpacity onPress={() => navigateToDiscussion()}> */}
              <TouchableOpacity
                style={styles.navigateToDiscussion}
                onPress={() => navigateToDiscussion()}>
                <Text
                  style={styles.joinTheDiscussion}>
                  Join the discussion
                </Text>
                <Icon name="right-arrow" size={20} color={colors.mainBlue} />
              </TouchableOpacity>
              {/* </TouchableOpacity> */}
            </View>
          )}
        </View>
      </TouchableOpacity>

      <BottomSheetModal
        isVisible={showMenu}
        onClose={hideMenu}
        style={styles.modalStyle}>
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>Options</Text>
          <TouchableOpacity
            onPress={() => {
              logger.log('Follow user id', data.owner);
              if (isFollowing) {
                NotificationService.unfollow(data.owner);
              } else {
                NotificationService.follow(data.owner);
              }
              setShowMenu(false);
            }}>
            <View style={styles.sheetButton}>
              <Icon name="following" color={colors.black} />
              <View style={{flex: 1}}>
                <Text style={[styles.sheetText, {color: colors.black}]}>
                  {isFollowing ? 'UnFollow' : 'Follow'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.sheetButton}>
              <Icon name="report" color={colors.against} />
              <Text style={styles.sheetText}>Report</Text>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </>
  );
};

DiscussionCard.propTypes = {
  data: shape({
    id: string.isRequired,
    owner: string.isRequired,
    ownerId: string.isRequired,
    title: string.isRequired,
    createTime: object.isRequired,
    message: string.isRequired,
  }),
  commonId: string,
  userStore: shape({
    userInfo: object,
  }).isRequired,
  navigation: object.isRequired,
  bottomSheetStore: object.isRequired,
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
});

export default inject(
  'userStore',
  'bottomSheetStore',
)(observer(DiscussionCard));
