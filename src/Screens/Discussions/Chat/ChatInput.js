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
import Icon from '../../../Assets/iconfont/Icon';

const ChatInput = props => {
  const sendMessageToDiscussion = async () => {
    const userStore = props.userStore;
    const message = inputRef.current._lastNativeText;
    if (message && message.trim().length) {
      // let path = `common/${commonId}/discussion/${data.id}/message`;
      firestore()
        .collection(path)
        // .collection('common')
        // .doc(commonId)
        // .collection('discussion')
        // .doc(data.id)
        // .collection('message')
        .doc()
        .set({
          text: message,
          createTime: new Date(),
          owner: userStore.userInfo.uid,
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
  );
};

export default ChatInput;
