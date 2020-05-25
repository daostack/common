import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Keyboard,
  SectionList,
} from 'react-native';
import DiscussionMessage from '../DiscussionMessage';
import firestore from '@react-native-firebase/firestore';
import {colors} from '../../../Theme';
import {observer, inject} from 'mobx-react';
const {width} = Dimensions.get('window');
import moment from 'moment';

const ChatRoom = props => {
  //const [inputHeight, setInputHeight] = useState(60);
  const inputRef = useRef(null);
  //const [user, setUser] = useState({});
  //const [inputText, setInputText] = useState(null);
  const chatRef = useRef(null);

  const path = props.path;
  // 'common/48NPcGnpskN9YkqVNXKA/proposal/DmZFnbSbkwcQHMAyGa54/discussion/43Q9abICrp2KpE86c1Az/message';
  const commonId = props.commonId;
  const [msgGroup, setMsgDroup] = useState([]);

  let listRef = useRef([]);
  useEffect(() => {
    // `common/${commonId}/discussion/${data.id}/message`;
    const unsubscribe = firestore()
      .collection(path)
      .orderBy('createTime', 'desc')
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
            chatRef.current.scrollToLocation({
              animated: true,
              itemIndex: 0,
              sectionIndex: 0,
            });
          }
        },
        error => console.error(error),
      );
    return () => {
      unsubscribe();
    };
  }, [path]);

  const sendMessageToDiscussion = async () => {
    const userStore = props.userStore;
    const message = inputRef.current._lastNativeText;
    if (message && message.trim().length) {
      // let path = `common/${commonId}/discussion/${data.id}/message`;
      firestore()
        .collection(path)
        .doc()
        .set({
          text: message,
          createTime: new Date(),
          ownerId: userStore.userInfo.uid,
          ownerName: userStore.userInfo.displayName,
          ownerAvatar: userStore.userInfo.photoURL,
          commonId: commonId,
          discussionId: discussionId,
          proposalId: proposalId,
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
    }
  };

  return (
    <View style={{}}>
      <SectionList
        // style={{flex: 1, height: height}}
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
        contentContainerStyle={{paddingTop: 80}}
        // initialScrollIndex={2}
      />

      {/* <KeyboardAvoidingView
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
      </KeyboardAvoidingView> */}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default inject('userStore')(observer(ChatRoom));
