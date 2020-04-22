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
} from 'react-native';
import {observer, inject} from 'mobx-react';
import Icon from '../../Assets/iconfont/Icon';
import {text, layout, colors} from '../../Theme';
import DiscussionMessage from './DiscussionMessage';
import firestore from '@react-native-firebase/firestore';
import Toast from '../../Util/Toast.js';

const {width} = Dimensions.get('window');

const Discussions = props => {
  const [inputHeight, setInputHeight] = useState(60);
  const inputRef = useRef(null);

  const data = props.route.params.data;
  const commonId = props.route.params.commonId;
  const [list, setList] = useState([]);
  const [trigger, setTrigger] = useState(true);

  console.log('commonId', commonId);
  console.log('discussionId', data.id);
  console.log('data1', data);

  useEffect(() => {
    const fetchList = async () => {
      const snapshot = await firestore()
        .collection('common')
        .doc(commonId)
        .collection('discussion')
        .doc(data.id)
        .collection('message')
        .get();
      setList(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    };
    fetchList();
  }, [commonId, trigger]);

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
          setTrigger(!trigger);
          Keyboard.dismiss();
        })
        .catch(error => {
          console.log('NO', error);
          Toast.done(error);
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 60}}>
        <View style={{backgroundColor: colors.white, flex: 1, padding: 20}}>
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
              // source={require('../../Assets/daoGeneralInfo.png')}
            />
            <View style={{flex: 1, paddingHorizontal: 10}}>
              <Text style={{fontWeight: 'bold'}}>Name</Text>
              <Text style={{color: colors.grey3}}>0.1% REP</Text>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={{color: colors.white}}>Quick reply</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={{fontSize: 16, lineHeight: 25, paddingVertical: 20}}>
              {data.message}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
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
          </View>

          <View
            style={{
              height: 2,
              marginVertical: 20,
              backgroundColor: colors.grey4,
            }}
          />
        </View>
        {list.map(x => (
          <DiscussionMessage data={x} />
        ))}
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
    shadowOpacity: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  }
});

export default inject('userStore')(observer(Discussions));
