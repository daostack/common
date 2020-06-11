import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '../Theme';
import Icon from '../Assets/iconfont/Icon';


const UserAvatar = ({image, iconName}) =>
  <View style={styles.imageFieldContainer}>
    <Image
      style={styles.imageFieldStyle}
      resizeMode="cover"
      source={{uri: image}}
    />
    <View style={styles.imageFielFollowIcon}>
      <Icon name={iconName} size={16} color={colors.white} />
    </View>
  </View>;


const styles = StyleSheet.create({
  imageFieldContainer: {
    position: 'relative',
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  imageFieldStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: 'rgba(0, 26, 54, 0.1)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    alignSelf: 'center',
  },
  imageFielFollowIcon: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    padding: 2,
    backgroundColor: colors.mainBlue,
    borderWidth: 2,
    borderColor: colors.white,
  },
});


export default UserAvatar;
