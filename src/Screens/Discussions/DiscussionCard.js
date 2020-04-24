import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';
import FirebaseService from '../../Services/FirebaseService';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

const DiscussionCard = props => {
  const data = props.data;
  const commonId = props.commonId;
  const [user, setUser] = useState({});
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await FirebaseService.getInstance().getUserById(
        data.owner,
      );
      setUser(userData);
    };
    fetchUser();
  }, [data]);

  useEffect(() => {
    const fetchList = async () => {
      const snapshot = await firestore()
        .collection('common')
        .doc(commonId)
        .collection('discussion')
        .doc(data.id)
        .collection('message')
        .get();
      setMsgCount(snapshot.docs.length);
    };
    fetchList();
  }, [commonId, data]);

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        props.navigation.navigate('Discussions', {
          data: data,
          commonId: commonId,
        })
      }>
      <View style={styles.container}>
        <Text style={styles.title}>{data.title}</Text>
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
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={{fontWeight: 'bold'}}>{user.displayName}</Text>
            {/* <Text style={{color: colors.grey3}}>0.1% REP</Text> */}
          </View>
          <Text>{moment(data.createTime.toDate()).fromNow()}</Text>
        </View>
        {data.message.length < 150 ? (
          <Text style={{marginVertical: 10}}>{data.message}</Text>
        ) : (
          <>
            <Text style={{marginVertical: 10}}>
              {data.message.slice(0, 150)}
            </Text>
            <TouchableOpacity
              style={{marginVertical: 12, marginBottom: 20}}
              onPress={() =>
                props.navigation.navigate('Discussions', {
                  data,
                  commonId,
                  user,
                })
              }>
              <Text
                style={{fontSize: 15, color: colors.black, fontWeight: 'bold'}}>
                Read More
              </Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{flexDirection: 'row'}}>
            <Text>💬</Text>
            <Text
              style={{fontSize: 15, color: colors.grey3, paddingHorizontal: 5}}>
              {msgCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey4,
    borderBottomWidth: 4,
    borderBottomColor: colors.grey4,
    // marginHorizontal: 25,
    marginVertical: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: colors.black,
  },
});

export default DiscussionCard;
