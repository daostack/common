import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors, font} from '~/Theme';
import FastImage from 'react-native-fast-image';
import {UserModel} from '~/Stores/Models/UserModel';

const MemberImage = ({
  userInfo,
  style,
  id,
}: {
  userInfo: UserModel;
  style?: object;
  id: string;
}) =>
  userInfo?.photoURL ? (
    <FastImage
      key={id}
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
      <Text style={styles.memberImageDisplayName}>{userInfo?.displayName}</Text>
    </View>
  );

const styles = StyleSheet.create({
  memberImageDisplayName: {
    ...font.primary.regular,
    ...font.fontSize(2),
    width: 17,
    height: 17,
    color: colors.white,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default MemberImage;
