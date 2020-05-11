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
        <TouchableOpacity>
          <View style={{position: 'absolute', right: 0, top: 0}}>
            <Icon name="menu" size={20} />
          </View>
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
            <Text style={{fontWeight: 'bold'}}>{user.displayName}</Text>
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
              onPress={() =>
                props.navigation.navigate('Discussions', {
                  data: data,
                  commonId: commonId,
                })
              }>
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
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
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
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
    fontSize: 18,
    marginBottom: 20,
    fontWeight: '500',
    fontFamily: 'Roboto',
    color: colors.black,
  },
});

export default DiscussionCard;
