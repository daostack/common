import React, {useState, useEffect} from 'react';
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
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import FirebaseService from '../../Services/FirebaseService';
import moment from 'moment';

const DiscussionMessage = props => {
  const data = props.data;
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await FirebaseService.getInstance().getUserById(
        data.owner,
      );
      setUser(userData);
    };
    fetchUser();
  }, [data]);

  console.log('data', data);
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{
            backgroundColor: colors.grey3,
            height: 30,
            width: 30,
            borderRadius: 15,
          }}
          source={{uri: user.photoURL}}
        />
        <Text style={{flex: 1, marginLeft: 10, fontWeight: 'bold'}}>
          {user.displayName}
        </Text>
        {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
      </View>
      <Text style={{marginVertical: 10}}>{data.text}</Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={{flex: 1, fontSize: 12, fontWeight: '300'}}>
          {moment(data.createTime.toDate()).format('MM-DD hh:mm')}
        </Text>
        {/* <TouchableOpacity style={{flexDirection: 'row'}}>
          <Text>👍</Text>
          <Text
            style={{fontSize: 15, color: colors.grey3, paddingHorizontal: 5}}>
            23
          </Text>
        </TouchableOpacity> */}
        {/* <View style={{flexDirection: 'row'}}>
        <Text>💬</Text>
        <Text style={{ fontSize: 15, color: colors.grey3, paddingHorizontal: 5}}>22</Text>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.grey4,
    borderRadius: 8,
    marginHorizontal: 25,
    marginVertical: 10,
    padding: 10,
  },
});

export default DiscussionMessage;
