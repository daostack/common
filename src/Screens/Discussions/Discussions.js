import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  SectionList,
  Platform,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import Icon from '~/Assets/iconfont/Icon';
import {colors, layout, font, text, sizeM, sizeS, sizeXL} from '~/Theme';
import DiscussionMessage from './DiscussionMessage';
import firestore from '@react-native-firebase/firestore';
import Toast from '~/Util/Toast.js';
import UserService from '~/Services/UserService';
import moment from 'moment';
import NavigationBar from 'react-native-navbar';
import auth from '@react-native-firebase/auth';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {BOTTOM_SHEET_TEMPLATES} from '~/Stores/BottomSheetStore';
import ImageView from 'react-native-image-viewing';
import {db} from '../../Firebase';
import logger from '../../Services/Logger';
import {func, object, shape, string} from 'prop-types';
import DiscussionService from '../../Services/DiscussionService';
const {width} = Dimensions.get('window');

const Discussions = ({daoStore, userStore, bottomSheetStore, navigation,
  route: {params: {commonId, discussionId, data}}}) => {

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);
  let listRef = useRef([]);

  const [imageGalleryIndex, setImageGalleryIndex] = useState(-1);
  const [followState, setFollowState] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inputText, setInputText] = useState(null);
  const [msgGroup, setMsgGroup] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [dataState, setData] = useState(data);
  const [user, setUser] = useState({});
  const [inputHeight, setInputHeight] = useState(false);

  const currentUser = auth().currentUser;

  useEffect(() => {
    const currentDao = daoStore.daos.find((dao) => dao.id === commonId);
    const isCurrMember = userStore.userInfo && userStore.isDaoMember(currentDao.members);
    setIsMember(isCurrMember);
  }, []);

  const hideMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    let uid = null;
    if (currentUser) {
      uid = currentUser.uid;
    }
    const unsubscribe = db.collection('discussion')
      .doc(discussionId)
      .onSnapshot((snapshot) => {
        if (!snapshot.exists) {
          return;
        }
        setData({id: snapshot.id, ...snapshot.data()});
        const follower = snapshot.data().follower;
        if (follower && uid) {
          const state = follower.includes(uid);
          setFollowState(state);
        }
      });
    return unsubscribe;
  }, [commonId, discussionId, currentUser]);

  useEffect(() => {
    const unsubscribe = db.collection('discussionMessage')
      .where('discussionId', '==', discussionId)
      .orderBy('createTime', 'desc')
      // .startAt(0)
      // .limit(25)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.docChanges().length !== 0) {
            const newList = snapshot.docChanges().map(({doc}) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const msgList = [...newList, ...listRef.current];
            // _.union(listRef.current, newList);
            listRef.current = msgList;
            logger.log('newMessage', newList);
            const groupDate = msgList
              .map((msg) => ({
                date: moment(msg.createTime.toDate()).format('YYYY-MM-DD'),
                data: msg,
              }))
              .reduce((acc, curr) => {
                var key = curr.date;
                let el = acc.find((x) => x && x.date === key);
                if (el) {
                  el.data.push(curr.data);
                } else {
                  acc.push({
                    date: key,
                    data: [curr.data],
                  });
                }
                return acc;
              }, []);
            setMsgGroup(groupDate);
          }
        },
        (error) => logger.error(error),
      );

    return unsubscribe;
  }, [commonId, dataState.id]);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await UserService.getInstance().getUserById(
        dataState.ownerId,
      );
      setUser(userData);
    };

    fetchUser();
  }, [dataState]);

  // const openOptionsMenu = () => {
  //   if (!currentUser) {
  //     showLoginScreen();
  //     return;
  //   }
  //   props.bottomSheetStore.showBottomSheet(
  //     BOTTOM_SHEET_TEMPLATES.SCREEN_OPTIONS,
  //   );
  // };

  const showLoginScreen = () => {
    bottomSheetStore.showBottomSheet(
      BOTTOM_SHEET_TEMPLATES.LOGIN_SHEET_SCREEN,
    );
  };

  const followDiscussion = async () => {
    let uid = null;
    if (currentUser) {
      uid = currentUser.uid;
    } else {
      showLoginScreen();
    }

    db.collection('discussion')
      .doc(discussionId)
      .update({
        follower: followState
          ? firestore.FieldValue.arrayRemove(uid)
          : firestore.FieldValue.arrayUnion(uid),
      })
      .then(() => {
        logger.log('Follow State Change');
        setShowMenu(false);
      });
  };

  const handleLayoutLoaded = ({nativeEvent}) => {
    try {
      // Once the list is loaded, measure it and scroll the user to the end of it
      scrollRef.current.scrollTo({
        y: nativeEvent.layout.height,
        animated: true,
      });
    } catch (error) {
      logger.error('HandleLayoutLoaded error: ', error);
    }
  };

  const sendMessageToDiscussion = async () => {

    if (isSending) {
      return;
    }
    setIsSending(true);

    if (!currentUser) {
      showLoginScreen();
      setIsSending(false);
      return;
    }

    const message = inputText;
    if (message && message.trim().length) {
      inputRef.current.clear();

      db.collection('discussionMessage')
        .doc()
        .set({
          text: message,
          createTime: new Date(),
          ownerId: currentUser.uid,
          ownerName: currentUser.displayName,
          ownerAvatar: currentUser.photoURL,
          commonId: commonId,
          discussionId: discussionId,
        })
        .then(async () => {
          Keyboard.dismiss();
          setInputText('');

          await DiscussionService.getInstance().updateDiscussionLastMessage(discussionId);
        })
        .catch((error) => {
          Toast.error(error);
        })
        .finally(() => {
          setIsSending(false);
        });
    } else {
      Toast.error('Empty Message');
      setIsSending(false);
    }
  };

  const headerImages = () => (
    <>
      {dataState.images ?
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 20}}>
          <View style={styles.imageGallery}>
            <View style={{width: 20}} />
            {dataState.images.map((currImage, currIndex) => (
              <View
                key={`proposalImg_${currIndex}`}>
                <TouchableOpacity
                  onPress={() => setImageGalleryIndex(currIndex)}>
                  <Image
                    key={currIndex}
                    style={{
                      ...styles.galleryImage,
                      ...{width: width * 0.8},
                    }}
                    resizeMode="cover"
                    source={{uri: currImage.value}}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <View style={{width: 20}} />
          </View>
        </ScrollView>
        : null}
    </>
  );

  const headerFiles = () => (
    <>
      {dataState.files && (
        dataState.files.map((f, index) => <View style={styles.adRow} key={`discussion_file_${index}`}>
          <Icon name="file" color={colors.mainBlue} size={16} />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Browser', {
                url: f.value,
              })
            }>
            <Text style={styles.adsText}>
              {fileName(f.value)}
            </Text>
          </TouchableOpacity>
        </View>)
      )
      }
    </>
  );

  const fileName = (url) => {
    url = url.split('_');
    return url[url.length - 2];
  };

  const header = () => (
    // <SafeAreaView flex={1}>
    <>
      <NavigationBar
        statusBar={{hidden: true}}
        style={{
          height: 48,
        }}
        title={{
          title: dataState.title,
          style: [text.h2Black, {paddingLeft: 50, paddingRight: 20}],
          ellipsizeMode: 'tail',
          numberOfLines: 1,
        }}
        leftButton={
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => navigation.pop()}>
            <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
          </TouchableOpacity>
        }
      // rightButton={
      //   <TouchableOpacity
      //     style={{justifyContent: 'center'}}
      //     onPress={openOptionsMenu}>
      //     <Icon
      //       name="menu-horizontal"
      //       size={32}
      //       style={{marginRight: 10}}
      //     />
      //   </TouchableOpacity>
      // }
      />
      <View style={{overflow: 'hidden', paddingBottom: 5}}>
        <View
          style={styles.headerContainer}>
          {isExpanded ? (
            <View style={{
              paddingTop: 20,
              paddingHorizontal: 20,
              maxHeight: '94%',
            }}>
              <ScrollView>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={styles.avatar}
                    source={user.photoURL ? {uri: user.photoURL} : null}
                  />
                  <View style={{flex: 1, paddingHorizontal: 10}}>
                    <Text style={styles.displayName}>{user.displayName}</Text>
                    {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
                    <Text style={styles.date}>
                      {moment(dataState.createTime.toDate()).fromNow()}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text
                    style={styles.message}>
                    {dataState.message}
                  </Text>
                </View>

                {headerImages()}
                {headerFiles()}
              </ScrollView>


              <TouchableOpacity
                style={{alignItems: 'center', paddingVertical: 10}}
                onPress={() => {
                  setIsExpanded(!isExpanded);
                }}>
                <Image style={{height: 10, width: 60}} source={require('../../Assets/collapse.png')} />
              </TouchableOpacity>
            </View>
          ) : (
              <>
                <TouchableOpacity
                  style={{alignItems: 'center', paddingVertical: 10}}
                  onPress={() => {
                    setIsExpanded(!isExpanded);
                  }}>
                  <Image style={{height: 10, width: 60}} source={require('../../Assets/expand.png')} />
                </TouchableOpacity>
              </>
          )}
          {/* <View
            style={{
              height: 4,
              marginTop: 10,
              // paddingHorizontal: -20,
              marginHorizontal: -20,
              backgroundColor: colors.grey4,
            }}
          /> */}
        </View>
      </View>
      {/* </SafeAreaView> */}
    </>
  );

  return (
    <SafeAreaView style={styles.safeView}>
      {header()}
      <ScrollView style={{flex: 1, paddingBottom: 30}} ref={scrollRef}>
        {msgGroup.length > 0 ? (
          <SectionList
            inverted
            ref={chatRef}
            sections={msgGroup}
            keyExtractor={(x) => x.id}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={{
              paddingTop: 100,
            }}

            renderItem={(x) => (
              <DiscussionMessage data={x.item} />
            )}

            renderSectionFooter={({section: {date}}) => (
              <Text style={styles.timeHeader}>
                {moment().isSame(date, 'day') ? 'Today' : date}
              </Text>
            )}

            onLayout={handleLayoutLoaded}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../Assets/empty-discussion.png')}
              style={{width: 240, height: 240}}
            />


            <Text style={styles.emptyTitle}> No comments yet</Text>
            <Text style={styles.emptyBody}>Have any thoughts? Share them with other members by adding the first comment.</Text>
          </View>
        )}

      </ScrollView>


      <KeyboardAvoidingView
        style={{
          position: 'absolute',
          bottom: 0,
          flex: 1,
          color: '#fbfdff',
        }}
      >
        <View style={styles.inputContainer}>
          {isMember ? (
            <View style={[styles.input, {height: Math.max(35, inputHeight + 20)}]}>
              <TextInput
                ref={inputRef}
                editable={true}
                fontSize={15}
                multiline
                placeholder="What do you think?"
                onChangeText={(currText) => setInputText(currText)}
                onContentSizeChange={(event) => {
                  setInputHeight(event.nativeEvent.contentSize.height);
                }}
                style={{
                  flex: 1,
                  maxHeight: 110,
                  paddingVertical: 10,
                  marginHorizontal: 10,
                  height: Math.max(35, inputHeight + 10),
                }}
              />
              <TouchableOpacity
                onPress={sendMessageToDiscussion}
                style={{
                  paddingRight: 15,
                  justifyContent: 'center',
                }}
              >
                <Icon
                  name="send-message"
                  size={20}
                  color={
                    inputText && inputText.trim()
                      ? colors.mainBlue
                      : colors.grey3}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{...styles.joinCommonText}}>
              {'Only members can send messages'}
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>

      <BottomSheetModal
        isVisible={showMenu}
        onClose={hideMenu}
        style={styles.modalStyle}>
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>Options</Text>
          <TouchableOpacity onPress={() => followDiscussion()}>
            <View style={styles.sheetButton}>
              <Icon name="following" color={colors.black} />
              <View style={{flex: 1}}>
                <Text style={[styles.sheetText, {color: colors.black}]}>
                  {followState ? 'Unfollow' : 'Follow'}
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

      <ImageView
        images={dataState.images ? dataState.images.map((x) => ({uri: x.value})) : []}
        imageIndex={imageGalleryIndex}
        visible={imageGalleryIndex > -1}
        onRequestClose={() => setImageGalleryIndex(-1)}
      // FooterComponent={ImageGalleryFooter}
      />
    </SafeAreaView>
  );
};

Discussions.propTypes = {
  daoStore: shape({
    dao: object,
  }),
  userStore: shape({
    userInfo: object,
    isDaoMember: func,
  }),
  bottomSheetStore: shape({
    showBottomSheet: func,
  }),
  navigation: object,
  route: shape({
    params: shape({
      commonId: string,
      discussionId: string,
      data: object,
    }),
  }),
};

const styles = StyleSheet.create({
  message: {
    marginVertical: 10,
    lineHeight: 24,
    color: colors.black,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  date: {
    color: colors.formPlaceholderColor,
    ...font.primary.regular,
    ...font.fontSize(2),
  },
  displayName: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
  },
  title: {
    ...font.fontSize(3),
    ...font.primary.bold,
    color: colors.black,
    textAlign: 'center',
    // textAlignVertical: 'center',
    flex: 1,
    lineHeight: 20,
  },
  galleryImage: {
    marginRight: 15,
    width: 120,
    height: 250,
    borderRadius: 10,
    backgroundColor: colors.grey4,
  },
  safeView: {
    flex: 1,
    backgroundColor: colors.paleGrey,
  },
  imageGallery: {
    ...layout.flexRow,
    ...layout.flexStart,

    width: '100%',
  },
  avatar: {
    width: 35,
    height: 35,
    backgroundColor: colors.grey4,
    borderRadius: 17.5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    backgroundColor: colors.mainBlue,
  },
  inputContainer: {
    flex: 1,
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#fbfdff',
  },
  input: {
    // backgroundColor: colors.white,
    backgroundColor: '#fbfdff',
    borderTopColor: colors.grey4,
    borderTopWidth: 1,
    minHeight: 65,
    maxHeight: 110,
    width: width,
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  textInput: {
    flex: 1,
    paddingTop: 0,
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
    marginHorizontal: 10,
  },
  sendMessageIcon: {
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  timeHeader: {
    textAlign: 'center',
    marginVertical: 3,
    color: colors.grey3,
    ...font.fontSize(2),
    ...font.primary.regular,
  },

  sheetTitle: {
    ...font.fontSize(4),
    ...font.primary.bold,
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
    ...font.fontSize(3),
    ...font.primary.bold,
    color: colors.black,
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
  adsText: {
    ...font.fontSize(2),
    textDecorationLine: 'underline',
    ...font.primary.regular,
    ...layout.marginLeftXS,
  },

  adRow: {
    alignItems: 'center',
    ...layout.flexRow,
    alignSelf: 'stretch',
    paddingVertical: sizeM,
  },
  joinCommonText: {
    ...text.textFieldplaceholder,
    color: colors.greySubtitle,
    paddingTop: sizeS,
    paddingBottom: sizeXL,
  },
  emptyContainer: {
    flex: 0.8,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...font.fontSize(3),
    ...font.primary.bold,
    paddingVertical: 12,
  },
  emptyBody: {
    textAlign: 'center',
    ...font.fontSize(2),
    ...font.primary.regular,
  },
  headerContainer: {
    backgroundColor: colors.white,
    // flex: 1,
    paddingBottom: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    elevation: 5,
  },
});

export default inject('userStore', 'bottomSheetStore', 'daoStore')(observer(Discussions));
