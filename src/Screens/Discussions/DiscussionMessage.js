import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import {colors} from '../../Theme';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

const {width} = Dimensions.get('window');

const DiscussionMessage = props => {
  const data = props.data;
  let currentUserUid = null;
  if (auth().currentUser) {
    currentUserUid = auth().currentUser.uid;
  }

  return (
    <View style={styles.container}>
      {currentUserUid === data.ownerId ? (
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#E1F1F8',
            alignSelf: 'flex-end',
            // flex: 1,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowRadius: 4,
            shadowOpacity: 0.2,
            // flexDirection: 'row',
          }}>
          <Text style={{marginVertical: 2}}>{data.text}</Text>
          <View style={{position: 'relative', right: 0, bottom: 0}}>
            <Text
              style={{
                fontSize: 10,
                color: colors.grey3,
                fontWeight: '300',
                textAlign: 'right',
              }}
              numberOfLines={1}>
              {moment(data.createTime.toDate()).format('hh:mm')}
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                backgroundColor: colors.grey3,
                height: 40,
                width: 40,
                borderRadius: 20,
              }}
              source={{uri: data.ownerAvatar}}
            />
            <View
              style={{
                marginLeft: 10,
                maxWidth: width - 90,
                padding: 10,
                borderRadius: 10,
                backgroundColor: colors.white,
                // alignSelf: 'flex-start',
                // flex: 1,
                shadowColor: 'rgba(0, 0, 0, 0.22)',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowRadius: 4,
                shadowOpacity: 0.5,
              }}>
              <Text style={{fontWeight: 'bold'}}>{data.ownerName}</Text>

              <Text style={{marginVertical: 2}}>{data.text}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.grey3,
                    fontWeight: '300',
                    position: 'relative',
                    right: 1,
                    bottom: 0,
                    textAlign: 'center',
                  }}
                  numberOfLines={1}>
                  {moment(data.createTime.toDate()).format('hh:mm')}
                </Text>
              </View>
            </View>
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: colors.grey4,
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 3,
    padding: 10,
    flex: 1,
  },
});

export default DiscussionMessage;
