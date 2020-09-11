import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {colors, text} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import FastImage from 'react-native-fast-image';
import {string, object} from 'prop-types';

const UserAvatar = ({ image, iconName, displayName, imageStyle = {} }) =>
  <View style={styles.imageFieldContainer}>
    <FastImage
      style={{ ...styles.imageFieldStyle, ...imageStyle }}
      resizeMode="cover"
      source={{uri: image}}/>

    {iconName && <View style={styles.imageFielFollowIcon}>
      <Icon name={iconName} size={17} color={colors.white} />
    </View>}

    {displayName && <Text style={text.regularText}>{displayName}</Text>}

  </View>;

UserAvatar.propTypes = {
  image: string,
  iconName: string,
  displayName: string,
  imageStyle: object,
};

const styles = StyleSheet.create({
  imageFieldContainer: {
    position: 'relative',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
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
    elevation: 3,
    alignSelf: 'center',
  },
  imageFielFollowIcon: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    padding: 2,
    backgroundColor: colors.mainBlue,
    borderWidth: 2,
    borderColor: colors.white,
    elevation: 3,
  },
});


export default UserAvatar;
