import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../Theme';

const MemberImage = ({userInfo, style, key}) => {
  return userInfo?.photoURL ? (
    <Image
      key={key}
      style={styles.memberImage}
      source={{
        uri: userInfo?.photoURL,
      }}
    />
  ) : (
    <View
      style={{
        ...styles.memberImage,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6e7d82',
        ...style,
      }}>
      <Text style={{width: 17, height: 17, color: 'white'}}>
        {userInfo?.displayName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default MemberImage;
