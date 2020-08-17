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
import Icon from '../../Assets/iconfont/Icon';
import {colors, layout, font, text, sizeM, sizeS, sizeXL} from '../../Theme';
import DiscussionMessage from './DiscussionMessage';
import firestore from '@react-native-firebase/firestore';
import Toast from '../../Util/Toast.js';
import FirebaseService from '../../Services/FirebaseService';
import moment from 'moment';
import NavigationBar from 'react-native-navbar';
import auth from '@react-native-firebase/auth';
import BottomSheetModal from '../../Components/BottomSheetModal';
import {BOTTOM_SHEET_TEMPLATES} from '../../Stores/BottomSheetStore';
import ImageView from 'react-native-image-viewing';

const {width} = Dimensions.get('window');

const Discussions = ({daoStore, userStore, ...props}) => {
  const [inputHeight, setInputHeight] = useState(65);
  const inputRef = useRef(null);
  const [user, setUser] = useState({});
  const [inputText, setInputText] = useState(null);
  const chatRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  // const data = props.route.params.discussionId;
  const commonId = props.route.params.commonId;
  const discussionId = props.route.params.discussionId;
  const [msgGroup, setMsgDroup] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  // const [discussion, setDiscussion] = useState();
  const [followState, setFollowState] = useState(false);
  const [imageGalleryIndex, setImageGalleryIndex] = useState(-1);
  const [data, setData] = useState(props.route.params.data);
  const [isMember, setIsMember] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const currentUser = auth().currentUser;

  useEffect(() => {
    const currentDao = daoStore.daos.find((dao) => dao.id === commonId);
    const isMember = userStore.userInfo && userStore.isDaoMember(currentDao.members);
    setIsMember(isMember);
  }, []);

  const hideMenu = () => {
    setShowMenu(false);
  };

  let listRef = useRef([]);
  useEffect(() => {
    let uid = null;
    if (currentUser) {
      uid = currentUser.uid;
    }
    const unsubscribe = firestore()
      .collection('discussion')
      .doc(discussionId)
      .onSnapshot(snapshot => {
        // console.log(snapshot.data());
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
    const unsubscribe = firestore()
      .collection('discussionMessage')
      .where('discussionId', '==', discussionId)
      .orderBy('createTime', 'desc')
      // .startAt(0)
      // .limit(25)
      .onSnapshot(
        snapshot => {
          if (snapshot.docChanges().length !== 0) {
            const newList = snapshot.docChanges().map(({doc}) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const msgList = [...newList, ...listRef.current];
            // _.union(listRef.current, newList);
            listRef.current = msgList;
            console.log('newMessage', newList);
            const groupDate = msgList
              .map(msg => ({
                date: moment(msg.createTime.toDate()).format('YYYY-MM-DD'),
                data: msg,
              }))
              .reduce((acc, curr) => {
                var key = curr.date;
                let el = acc.find(x => x && x.date === key);
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
            console.log('groupDate', groupDate);
            setMsgDroup(groupDate);
          }
        },
        error => console.error(error),
      );
    return unsubscribe;
  }, [commonId, data.id]);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await FirebaseService.getInstance().getUserById(
        data.ownerId,
      );
      setUser(userData);
    };

    // chatRef.scrollToLocation({
    //   animated: true,
    //   sectionIndex: 0,
    //   itemIndex: 0,
    //   viewPosition: 0,
    // });
    fetchUser();
  }, [data]);

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
    props.bottomSheetStore.showBottomSheet(
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
    firestore()
      .collection('discussion')
      .doc(discussionId)
      .update({
        follower: followState
          ? firestore.FieldValue.arrayRemove(uid)
          : firestore.FieldValue.arrayUnion(uid),
      })
      .then(() => {
        console.log('Follow State Change');
        setShowMenu(false);
      });
  };

  const sendMessageToDiscussion = async () => {

    if (isSending) {
      return;
    }
    setIsSending(true);

    const userStore = currentUser;
    if (!userStore) {
      showLoginScreen();
      setIsSending(false);
      return;
    }

    const message = inputText;
    if (message && message.trim().length) {
      inputRef.current.clear();
      firestore()
        .collection('discussionMessage')
        .doc()
        .set({
          text: message,
          createTime: new Date(),
          ownerId: userStore.uid,
          ownerName: userStore.displayName,
          ownerAvatar: userStore.photoURL,
          commonId: commonId,
          discussionId: discussionId,
        })
        .then(() => {
          Keyboard.dismiss();
          setIsSending(false);
          setInputText(null);
        })
        .catch(error => {
          Toast.error(error);
          setIsSending(false);
        });
    } else {
      Toast.error('Empty Message');
      setIsSending(false);
    }
  };

  const headerImages = () => {
    return (
      <>
        {data.images ?
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{marginBottom: 20}}>
            <View style={styles.imageGallery}>
              <View style={{width: 20}} />
              {data.images.map((currImage, currIndex) => {
                return (
                  <View
                    key={`proposalImg_${currIndex}`}>
                    <TouchableOpacity
                      onPress={() => setImageGalleryIndex(currIndex)}>
                      <Image
                        key={currIndex}
                        style={{
                          ...styles.galleryImage,
                          ...{width: width * 0.8 },
                        }}
                        resizeMode="cover"
                        source={{uri: currImage.value}}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={{width: 20}} />
            </View>
          </ScrollView>
          : null}
      </>
    );
  };

  const headerFiles = () => {
    return (
      <>
        {data.files && (
          data.files.map((f, index) => <View style={styles.adRow} key={`discussion_file_${index}`}>
            <Icon name="file" color={colors.mainBlue} size={16} />
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Browser', {
                  url: f.value,
                })
              }>
              <Text style={styles.adsText}>
                {fileName(f.value)}
              </Text>
            </TouchableOpacity>
          </View> )
        )
        }
      </>
    );
  };

  const fileName = url => {
    return url
      .substring(url.lastIndexOf('/') + 1, url.length)
      .split('?')[0]
      .split('_')
      .slice(0, -1)
      .join('_')
      .replace('public_file%2F', '')
      .concat('.pdf');
  };

  const header = () => {
    return (
      // <SafeAreaView flex={1}>
      <>
        <NavigationBar
          statusBar={{hidden: true}}
          style={{
            height: 48,
          }}
          title={{
            title: data.title,
            style: text.h2Black,
          }}
          leftButton={
            <TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={() => props.navigation.pop()}>
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
        <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
          <View
            style={styles.headerContainer}>
            {isExpanded ? (
              <View style={{
                paddingTop: 20,
                paddingHorizontal: 20,
              }}>
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
                      {moment(data.createTime.toDate()).fromNow()}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text
                    style={styles.message}>
                    {data.message}
                  </Text>
                </View>

                {headerImages()}
                {headerFiles()}

                <TouchableOpacity
                  style={{alignItems: 'center', paddingVertical: 10}}
                  onPress={() => {
                    setIsExpanded(!isExpanded);
                  }}>
                  <Image style={{ height: 10, width: 60 }} source={require('../../Assets/collapse.png')} />
                </TouchableOpacity>
              </View>
            ) : (
            <>
              <TouchableOpacity
                style={{alignItems: 'center', paddingVertical: 10}}
                onPress={() => {
                  setIsExpanded(!isExpanded);
                }}>
                <Image style={{ height: 10, width: 60  }} source={require('../../Assets/expand.png')} />
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
  };

  return (
    <SafeAreaView style={styles.safeView}>
      {header()}
      { msgGroup.length > 0 ?
        <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 60}}>
          <SectionList
            sections={msgGroup}
            ref={chatRef}
            // ListFooterComponent={header}
            renderItem={x => <DiscussionMessage data={x.item} />}
            renderSectionFooter={({section: {date}}) => (
              <Text style={styles.timeHeader}>
                {moment().isSame(date, 'day') ? 'Today' : date}
              </Text>
            )}
            keyExtractor={x => x.id}
            stickySectionHeadersEnabled={true}
            inverted={true}
            contentContainerStyle={{paddingTop: 10}}
            // initialScrollIndex={1}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                chatRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />
        </ScrollView>
        :
        <View style={styles.emptyContainer}>
          <Image source={require('../../Assets/empty-discussion.png')} style={{ width: 240, height: 240 }} />
          <Text style={styles.emptyTitle}> No comments yet</Text>
          <Text style={styles.emptyBody}>Have any thoughts? Share them with other members by adding the first comment.</Text>
        </View>
      }

      <KeyboardAvoidingView
        behavior={'height'}
        style={{position: 'absolute', bottom: 0, flex: 1, color: '#fbfdff'}}>
        <View style={styles.input}>
          {isMember ? (<>
            <TextInput
              ref={inputRef}
              editable={true}
              multiline={true}
              placeholder="What do you think?"
              onContentSizeChange={e =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              style={{...styles.textInput, height: inputHeight}}
              fontSize={16}
              onChangeText={currText => setInputText(currText)}
            />
            <TouchableOpacity
              style={{paddingRight: 15, justifyContent: 'center'}}
              onPress={sendMessageToDiscussion}>
              <Icon
                name="send-message"
                style={styles.sendMessageIcon}
                size={32}
                color={
                  inputText && inputText.trim() ? colors.mainBlue : colors.grey3
                }
              />
            </TouchableOpacity>
          </>
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
        images={data.images ? data.images.map(x => ({uri: x.value})) : []}
        imageIndex={imageGalleryIndex}
        visible={imageGalleryIndex > -1}
        onRequestClose={() => setImageGalleryIndex(-1)}
        // FooterComponent={ImageGalleryFooter}
      />
    </SafeAreaView>
  );
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
  input: {
    // backgroundColor: colors.white,
    backgroundColor: '#fbfdff',
    flex: 1,
    borderTopColor: colors.grey4,
    borderTopWidth: 1,
    height: 65,
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
    paddingVertical: 15,
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
  }
});

export default inject('userStore', 'bottomSheetStore', 'daoStore')(observer(Discussions));
