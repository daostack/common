import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

import {layout, colors, text, font} from '../../Theme';

const JoinAmount = ({amount, isCustom, onPress}) => {
  const [isSelected, setIsSelected] = useState(false);

  const onAmountPress = e => {
    setIsSelected(true);
    onPress(isCustom, amount);
  };

  return (
    <TouchableOpacity
      style={isSelected ? styles.containerSelected : styles.container}
      onPress={onAmountPress}>
      <Text style={isSelected ? styles.amountSelected : styles.amount}>{`${
        isCustom ? 'Other' : `$${amount}`
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
    borderRadius: 5,
  },
  containerSelected: {
    ...layout.content,
    borderRadius: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey4,
    backgroundColor: colors.mainBlue,
  },
  amount: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.mainBlue,
  },
  amountSelected: {
    ...font.primary.regular,
    ...font.fontSize(3),
    color: colors.white,
  },
  ruleDescription: {
    ...text.blackText,
    ...layout.marginTopM,
    marginLeft: 30,
  },
});

export default JoinAmount;
