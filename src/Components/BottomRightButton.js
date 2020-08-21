import { TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import colors from '../Theme/colors';
import Icon from '../Assets/iconfont/Icon';

const BottomRightButton = (props) => (
  <TouchableOpacity
    style={{ ...styles.button, bottom: props.bottom || 12 }}
    onPress={props.onPress}
  >
    <Icon
      name={props.iconName ? props.iconName : 'add-24'}
      color="white"
      size={props.iconSize ? props.iconSize : 28}
    />
  </TouchableOpacity>
);

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
