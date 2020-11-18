import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {layout, colors, text, font} from '~/Theme';
type JoinAmountProps = {
  id: any,
  amount?: any,
  isCustom?: any,
  onPress?: any,
  isSelected?: any,
  isMonthly?: any
};
const JoinAmount: React.FC<JoinAmountProps> = ({
  id,
  amount,
  isCustom,
  onPress,
  isSelected,
  isMonthly,
}: JoinAmountProps) => {
  const onAmountPress = () => {
    onPress(isCustom, amount, id);
  };
  return (
    <TouchableOpacity
      style={isSelected ? styles.containerSelected : styles.container}
      onPress={onAmountPress}
    >
      <Text style={isSelected ? styles.amountSelected : styles.amount}>{`${
        isCustom ? 'Other' : `$${amount}${isMonthly ? '/mo' : ''}`
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
