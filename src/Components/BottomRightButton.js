import {TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import colors from '~/Theme/colors';
import Icon from '~/Assets/iconfont/Icon';
import {string, func, number} from 'prop-types';

const BottomRightButton = ({bottom, onPress, iconName, iconSize}) => (
  <TouchableOpacity
    style={{...styles.button, bottom: bottom || 12}}
    onPress={onPress}>
    <Icon
      name={iconName ? iconName : 'add-24'}
      color="white"
      size={iconSize ? iconSize : 28}
    />
  </TouchableOpacity>
);

BottomRightButton.propTypes = {
  bottom: number,
  onPress: func,
  iconName: string,
  iconSize: number,
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 12,
    right: 15,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.mainBlue,
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusImage: {
    resizeMode: 'contain',
    width: 52,
    height: 52,
  },
});

export default BottomRightButton;
