import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';

import Icon from '../../Assets/iconfont/Icon';
import {layout, colors, text} from '../../Theme';

const JoinAmount = ({amount, isCustom, onPress}) => {
  const [isSelected, setIsSelected] = useState(false);

  const deselect = () => {
    setIsSelected(false);
  };

  const onAmountPress = e => {
    setIsSelected(true);
    onPress(isCustom, amount);
  };

  return (
    <TouchableOpacity
      style={isSelected ? styles.containerSelected : styles.container}
      onPress={onAmountPress}>
      <Text style={isSelected ? styles.amountSelected : styles.amount}>{`${
        isCustom ? 'Custom' : amount
      }`}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...layout.content,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey4,
  },
  containerSelected: {
    ...layout.content,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey4,
    backgroundColor: colors.mainBlue,
  },
  amount: {
    ...text.h3Black,
    fontWeight: '500',
    color: colors.mainBlue,
  },
  amountSelected: {
    ...text.h3Black,
    fontWeight: '500',
    color: colors.white,
  },
  ruleDescription: {
    ...text.blackText,
    ...layout.marginTopM,
    marginLeft: 30,
  },
});

export default JoinAmount;
