import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import {colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import FirebaseService from '../../Services/FirebaseService';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import BottomSheetModal from '../../Components/BottomSheetModal';
import NotificationService from '../../Services/NotificationService';
import {BOTTOM_SHEET_TEMPLATES} from '../../Stores/BottomSheetStore';

const {width} = Dimensions.get('window');

const DiscussionCard = props => {
  const data = props.data;
  const discussionId = data.id;
  const commonId = props.commonId;
  const [user, setUser] = useState({});
  const [msgCount, setMsgCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const isFollowing = props.userStore.userInfo.following.includes(data.owner);

  console.log('item', data);

  const hideMenu = () => {
    setShowMenu(false);
  };

  const navigateToDiscussion = () => {
    props.navigation.navigate('Discussions', {
      data: data,
      commonId: commonId,
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await FirebaseService.getInstance().getUserById(
        data.ownerId,
      );
      setUser(userData);
      console.log('userData', userData);
    };
    fetchUser();
  }, [data]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('discussion')
      .doc(discussionId)
      .collection('message')
      .onSnapshot(snapshot => {
        setMsgCount(snapshot.docs.length);
      });
    return () => {
      unsubscribe();
    };
  }, [discussionId]);

  const follow = () => {
    console.log('Follow user id', data.owner);
    NotificationService.follow(data.owner);
    props.bottomSheetStore.hideBottomSheet();
  };

  const showOptions = () => {
    props.bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.SCREEN_OPTIONS,
      {onFollow: follow},
    );
  };

  return (
    <>
      <View
      // onPress={() =>
      //   props.navigation.navigate('Discussions', {
      //     data: data,
      //     commonId: commonId,
      //   })
      // }
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={{position: 'absolute', right: 0, top: 0, padding: 20}}
            onPress={showOptions}>
            <Icon name="menu" size={20} />
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={2}>
            {data.title}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{
                backgroundColor: colors.grey3,
                height: 40,
                width: 40,
                borderRadius: 20,
              }}
              source={{uri: user.photoURL}}
            />
            <View style={{flex: 1, marginLeft: 10}}>
              <Text
                style={{
                  fontWeight: 'normal',
                  fontFamily: 'Roboto',
                  fontSize: 14,
                }}>
                {user.displayName}
              </Text>
              {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
              <Text style={{color: colors.grey3, fontSize: 12}}>
                {moment(data.createTime.toDate()).fromNow()}
              </Text>
            </View>
          </View>
          <Text
            style={{
              marginVertical: 10,
              fontSize: 14,
              lineHeight: 20,
              fontFamily: 'Roboto',
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
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    fontWeight: '500',
                    fontStyle: 'normal',
                    color: colors.mainBlue,
                    textAlign: 'center',
                  }}>
                  Start the discussion
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <Icon name="discussion" size={20} />
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.grey3,
                    paddingHorizontal: 5,
                  }}>
                  {msgCount}
                </Text>
              </View>
              {/* <TouchableOpacity onPress={() => navigateToDiscussion()}> */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
                onPress={() => navigateToDiscussion()}>
                <Text
                  style={{
                    textAlign: 'right',
                    fontSize: 16,
                    fontFamily: 'Roboto',
                    fontWeight: '500',
                    color: colors.mainBlue,
                  }}>
                  Join the discussion
                </Text>
                <Icon name="right-arrow" size={20} color={colors.mainBlue} />
              </TouchableOpacity>
              {/* </TouchableOpacity> */}
            </View>
          )}
        </View>
      </View>

      <BottomSheetModal
        isVisible={showMenu}
        onClose={hideMenu}
        style={styles.modalStyle}>
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>Options</Text>
          <TouchableOpacity
            onPress={() => {
              console.log('Follow user id', data.owner);
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

const styles = StyleSheet.create({
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
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: colors.black,
  },
  sheetTitle: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: 'bold',
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
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: '500',
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
});

export default inject('userStore','bottomSheetStore')(observer(DiscussionCard));
