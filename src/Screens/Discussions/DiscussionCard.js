import React from 'react';
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
  TouchableWithoutFeedback,
} from 'react-native';
import {text, layout, colors} from '../../Theme';
import Icon from '../../Assets/iconfont/Icon';

const DiscussionCard = props => {
  const data = props.data;
  const commonId = props.commonId;

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
          />
          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={{fontWeight: 'bold'}}>Test Name</Text>
            <Text style={{color: colors.grey3}}>0.1% REP</Text>
          </View>
          <Text>8h ago</Text>
        </View>
        <Text style={{marginVertical: 10}}>{data.message}</Text>
        <TouchableOpacity
          style={{marginVertical: 12, marginBottom: 20}}
          onPress={() =>
            props.navigation.navigate('Discussions', {
              data: data,
              commonId: commonId,
            })
          }>
          <Text style={{fontSize: 15, color: colors.black, fontWeight: 'bold'}}>
            Read More
          </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{flexDirection: 'row'}}>
            <Text>💬</Text>
            <Text
              style={{fontSize: 15, color: colors.grey3, paddingHorizontal: 5}}>
              23
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
