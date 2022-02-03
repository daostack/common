import React, {ReactElement} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '~/Theme/colors';
import Icon, {IconNames} from '~/Assets/iconfont/Icon';

interface Props {
  bottom?: number;
  onPress: () => void;
  iconName?: IconNames;
  iconSize?: number;
  isInModal?: boolean;
}

const BottomRightButton = ({
  bottom,
  onPress,
  iconName,
  iconSize,
  isInModal,
}: Props): ReactElement => (
  <TouchableOpacity
    style={{...styles.button, bottom: bottom || 12}}
    onPress={onPress}>
    <Icon
      name={iconName ? iconName : 'add-24'}
      color="white"
      size={iconSize ? iconSize : 28}
    />
    {isInModal && <View style={styles.backgroundBtn} />}
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
  backgroundBtn: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 7,
    borderColor: 'white',
    opacity: 0.5,
  },
});

export default BottomRightButton;
