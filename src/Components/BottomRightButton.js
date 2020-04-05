import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../Theme/colors';

const BottomRightButton = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Image
        source={require('../Assets/plus-sign.png')}
        style={styles.plusImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 12,
    right: 15,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mainBlue,
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusImage: {
    resizeMode: 'contain',
    width: 39,
    height: 39,
  },
});

export default BottomRightButton;
