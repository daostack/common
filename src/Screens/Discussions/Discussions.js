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
} from 'react-native';
import {observer, inject} from 'mobx-react';
import Icon from '../../Assets/iconfont/Icon';
import {colors, text} from '../../Theme';
import DiscussionMessage from './DiscussionMessage';
import firestore from '@react-native-firebase/firestore';
import Toast from '../../Util/Toast.js';
import FirebaseService from '../../Services/FirebaseService';
import moment from 'moment';
import NavigationBar from 'react-native-navbar';
import auth from '@react-native-firebase/auth';
import ChatRoom from './Chat/ChatRoom';
import BottomSheetModal from '../../Components/BottomSheetModal';
// import _ from 'lodash';

const {width} = Dimensions.get('window');

const Discussions = props => {
  const [inputHeight, setInputHeight] = useState(60);
  const inputRef = useRef(null);
  const [user, setUser] = useState({});
  const [inputText, setInputText] = useState(null);
  const chatRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const data = props.route.params.data;
  const commonId = props.route.params.commonId;
  const [msgGroup, setMsgDroup] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  const hideMenu = () => {
    setShowMenu(false);
  };

  let listRef = useRef([]);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('common')
      .doc(commonId)
      .collection('discussion')
      .doc(data.id)
      .collection('message')
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
            // chatRef.current.scrollToLocation({
            //   animated: true,
            //   itemIndex: 0,
            //   sectionIndex: 0,
            // });
          }
        },
        error => console.error(error),
      );
    return () => {
      unsubscribe();
    };
  }, [commonId, data.id]);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await FirebaseService.getInstance().getUserById(
        data.owner,
      );
      setUser(userData);
    };
    fetchUser();
  }, [data]);

  sendMessageToDiscussion = async () => {
    const userStore = auth().currentUser;
    // props.userStore;
    console.log('userStore', commonId, data.id, userStore);
    const message = inputRef.current._lastNativeText;
    if (message && message.trim().length) {
      console.log('message', message);
      firestore()
        .collection('common')
        .doc(commonId)
        .collection('discussion')
        .doc(data.id)
        .collection('message')
        .doc()
        .set({
          text: message,
          createTime: new Date(),
          ownerId: userStore.uid,
          ownerName: userStore.displayName,
          ownerAvatar: userStore.photoURL,
          commonId: commonId,
          discussionId: data.id,
        })
        .then(() => {
          console.log('YES');
          inputRef.current.clear();
          Keyboard.dismiss();
        })
        .catch(error => {
          console.log('NO', error);
          Toast.error(error);
        });
    } else {
      Toast.error('Empty Message');
    }
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
            style: text.h3Black,
          }}
          leftButton={
            <TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={() => props.navigation.pop()}>
              <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
            </TouchableOpacity>
          }
          rightButton={
            <TouchableOpacity
              style={{justifyContent: 'center'}}
              onPress={() => setShowMenu(!showMenu)}>
              <Icon
                name="menu-horizontal"
                size={32}
                style={{marginRight: 10}}
              />
            </TouchableOpacity>
          }
        />
        <View
          style={{
            backgroundColor: colors.white,
            // flex: 1,
            paddingBottom: 0,
          }}>
          {isExpanded ? (
            <View style={{paddingTop: 20, paddingHorizontal: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={styles.avatar}
                  source={{uri: user.photoURL}}
                  // source={require('../../Assets/daoGeneralInfo.png')}
                />
                <View style={{flex: 1, paddingHorizontal: 10}}>
                  <Text style={{fontWeight: 'bold'}}>{user.displayName}</Text>
                  {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
                  <Text style={{color: colors.grey3}}>
                    {moment(data.createTime.toDate()).fromNow()}
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  style={{fontSize: 16, lineHeight: 25, paddingVertical: 10}}>
                  {data.message}
                </Text>
              </View>

              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => {
                  setIsExpanded(!isExpanded);
                }}>
                <Icon name="up-arrow" size={32} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={{alignItems: 'center'}}
                onPress={() => {
                  setIsExpanded(!isExpanded);
                }}>
                <Icon name="down-arrow" size={32} />
              </TouchableOpacity>
            </>
          )}
          <View
            style={{
              height: 4,
              marginTop: 10,
              // paddingHorizontal: -20,
              marginHorizontal: -20,
              backgroundColor: colors.grey4,
            }}
          />
        </View>
        {/* </SafeAreaView> */}
      </>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.lightBlue}}>
      {header()}
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
          // initialScrollIndex={2}
        />
        {/* <View style={{flex: 1}}>
        <ChatRoom
          path={`common/${commonId}/discussion/${data.id}/message`}
          commonId={commonId}
        />
        </View> */}
      </ScrollView>

      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{position: 'absolute', bottom: 0, flex: 1, color: '#fbfdff'}}>
        <View style={styles.input}>
          <View style={styles.inputBorder}>
            <TextInput
              ref={inputRef}
              editable={true}
              multiline={true}
              onContentSizeChange={e =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              style={{flex: 1, height: inputHeight, marginHorizontal: 10}}
              fontSize={15}
              onChangeText={text => setInputText(text)}
            />
            <TouchableOpacity
              style={{paddingRight: 15, justifyContent: 'center'}}
              onPress={sendMessageToDiscussion}>
              <Icon
                name="edit"
                size={20}
                color={
                  inputText && inputText.trim() ? colors.mainBlue : colors.grey3
                }
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 30, backgroundColor: colors.white}} />
      </KeyboardAvoidingView>

      <BottomSheetModal
        isVisible={showMenu}
        onClose={hideMenu}
        style={styles.modalStyle}>
        <View style={styles.bottomSheet}>
          <Text style={styles.sheetTitle}>Options</Text>
          <TouchableOpacity>
            <View style={styles.sheetButton}>
              <Icon name="following" color={colors.black} />
              <View style={{flex: 1}}>
                <Text style={[styles.sheetText, {color: colors.black}]}>
                  Follow
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: colors.black,
    textAlign: 'center',
    // textAlignVertical: 'center',
    flex: 1,
    lineHeight: 20,
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
    borderColor: colors.grey4,
    // borderwidth: 1,
    borderBottomWidth: 1,
    // height: 60,
    width: width,
    flexDirection: 'row',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  timeHeader: {
    textAlign: 'center',
    marginVertical: 3,
    color: colors.grey3,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  inputBorder: {
    flex: 1,
    flexDirection: 'row',
    borderColor: colors.grey4,
    borderWidth: 1,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 40,
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

export default inject('userStore')(observer(Discussions));
