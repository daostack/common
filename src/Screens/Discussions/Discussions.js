import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
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
  Platform,
  SectionList,
} from 'react-native';
import {observer, inject} from 'mobx-react';
import Icon from '../../Assets/iconfont/Icon';
import {text, layout, colors} from '../../Theme';
import DiscussionMessage from './DiscussionMessage';
import firestore from '@react-native-firebase/firestore';
import Toast from '../../Util/Toast.js';
import FirebaseService from '../../Services/FirebaseService';
import moment from 'moment';

const {width} = Dimensions.get('window');

const Discussions = props => {
  const [inputHeight, setInputHeight] = useState(60);
  const inputRef = useRef(null);
  const [user, setUser] = useState({});
  const chatRef = useRef(null);

  const data = props.route.params.data;
  const commonId = props.route.params.commonId;
  const [list, setList] = useState([]);
  const [msgGroup, setMsgDroup] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('common')
      .doc(commonId)
      .collection('discussion')
      .doc(data.id)
      .collection('message')
      .orderBy('createTime', 'desc')
      // .startAt(0)
      // .limit(4)
      .onSnapshot(
        snapshot => {
          if (snapshot.docChanges().length !== 0) {
            const newList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            const msgList = [...list, ...newList];
            setList(msgList);
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
                // acc[key].push(curr.data);
                return acc;
              }, []);
            console.log('groupDate', groupDate);
            // const group = Object.keys(groupDate).map(key => ({section: key, data: groupDate[key]}))
            setMsgDroup(groupDate);
          }
        },
        error => console.error(error),
      );
    return () => {
      unsubscribe();
    };
  }, [commonId, data.id]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (chatRef.current) {
  //       chatRef.current.scrollToLocation({
  //         animated: true,
  //         itemIndex: 1,
  //         sectionIndex: 0,
  //       });
  //     }
  //   }, 200);
  // }, [chatRef]);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const userData = await FirebaseService.getInstance().getUserById(
  //       data.owner,
  //     );
  //     setUser(userData);
  //   };
  //   fetchUser();
  // }, [data]);

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
    const userStore = props.userStore;
    console.log('userStore', userStore);
    const message = inputRef.current._lastNativeText;
    console.log('Message', inputRef.current._lastNativeText);
    if (message && message.trim().length) {
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
          owner: userStore.userInfo.uid,
        })
        .then(() => {
          console.log('YES');
          inputRef.current.clear();
          // inputRef.focused
          // Toast.done('Sent');
          // setTrigger(!trigger);
          Keyboard.dismiss();
        })
        .catch(error => {
          console.log('NO', error);
          Toast.done(error);
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.lightBlue}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 60}}>
        <View
          style={{
            backgroundColor: colors.white,
            flex: 1,
            padding: 20,
            paddingBottom: 0,
          }}>
          <Text style={styles.title}>{data.title}</Text>
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

            {/* <TouchableOpacity style={styles.button}>
              <Text style={{color: colors.white}}>Quick reply</Text>
            </TouchableOpacity> */}
          </View>

          <View>
            <Text style={{fontSize: 16, lineHeight: 25, paddingVertical: 10}}>
              {data.message}
            </Text>
          </View>

          {/* <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 8}}>
              <Icon name="edit" />
              <Text>23</Text>
            </View>
            <View style={{flexDirection: 'row', paddingHorizontal: 8}}>
              <Icon name="edit" />
              <Text>23</Text>
            </View>
            <View style={{flexDirection: 'row', paddingHorizontal: 8}}>
              <Icon name="edit" />
              <Text>23</Text>
            </View>
          </View> */}

          <View
            style={{
              height: 4,
              marginTop: 20,
              // paddingHorizontal: -20,
              marginHorizontal: -20,
              backgroundColor: colors.grey4,
            }}
          />
        </View>
        <SectionList
          sections={msgGroup}
          ref={chatRef}
          renderItem={x => <DiscussionMessage data={x.item} />}
          renderSectionFooter={({section: {date}}) => (
            <Text
              style={{
                textAlign: 'center',
                marginVertical: 3,
                color: colors.grey3,
              }}>
              {date}
            </Text>
          )}
          keyExtractor={x => x.id}
          inverted={true}
          initialScrollIndex={0}
        />
      </ScrollView>

      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{position: 'absolute', bottom: 0, flex: 1}}>
        <View style={styles.input}>
          <TextInput
            ref={inputRef}
            editable={true}
            multiline={true}
            onContentSizeChange={e =>
              setInputHeight(e.nativeEvent.contentSize.height)
            }
            style={{flex: 1, height: inputHeight}}
            fontSize={20}
          />
          <TouchableOpacity onPress={sendMessageToDiscussion}>
            <Icon name="edit" size={25} />
          </TouchableOpacity>
        </View>
        <View style={{height: 30, backgroundColor: colors.white}} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: colors.black,
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
    backgroundColor: colors.white,
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
});

export default inject('userStore')(observer(Discussions));
