import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {colors, font} from '~/Theme';
import FastImage from 'react-native-fast-image';

interface MemberImageProps {
  user?: {
    photoURL: string;
    displayName: string;
  };
  style?: ViewStyle;
}

export const MemberImage = ({user, style}: MemberImageProps) =>
  user?.photoURL ? (
    <FastImage
      key={user?.photoURL}
      style={styles.memberImage}
      source={{
        uri: user?.photoURL,
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
      <Text style={styles.memberImageDisplayName}>{user?.displayName}</Text>
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
