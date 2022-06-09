import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {colors, font} from '~/Theme';
import FastImage from 'react-native-fast-image';
import {InferProps, number, object} from 'prop-types';

const props = {
  userInfo: object,
  style: object,
  imgStyle: object,
  id: number,
  size: number,
};
const MemberImage: React.FC<InferProps<typeof props>> = ({
  userInfo,
  style,
  imgStyle,
  id,
  size = 40,
}) => {
  const memberImageStyle = useMemo(() => {
    return {width: size, height: size, borderRadius: size / 2};
  }, [size]);

  return userInfo?.photoURL ? (
    <FastImage
      key={id}
      style={[styles.memberImage, memberImageStyle, imgStyle]}
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
        ...memberImageStyle,
        ...style,
      }}>
      <Text style={styles.memberImageDisplayName}>{userInfo?.displayName}</Text>
    </View>
  );
};

MemberImage.propTypes = props;

const styles = StyleSheet.create({
  memberImageDisplayName: {
    ...font.primary.regular,
    ...font.fontSize(2),
    width: 17,
    height: 17,
    color: colors.white,
  },
  memberImage: {
    backgroundColor: colors.grey3,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default MemberImage;
