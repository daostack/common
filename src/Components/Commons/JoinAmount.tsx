import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {layout, colors, text, font} from '~/Theme';
import {convertAmountToIls, isIsraelLocale} from '~/Util/locale';
import {inject, observer} from 'mobx-react';

export const JoinAmount: React.FC<{
  id: number;
  amount: number;
  isCustom: boolean;
  onPress: func;
  isSelected: boolean;
  isMonthly: boolean;
}> = ({
  id,
  amount,
  isCustom,
  onPress,
  isSelected,
  isMonthly,
  uiStore: {conversionRate},
}) => {
  const onAmountPress = () => {
    onPress(isCustom, amount, id);
  };
  return (
    <TouchableOpacity
      style={isSelected ? styles.containerSelected : styles.container}
      onPress={onAmountPress}>
      <Text style={isSelected ? styles.amountSelected : styles.amount}>{`${
        isCustom ? 'Other' : `$${amount}${isMonthly ? '/mo' : ''}`
      }`}</Text>
      {!!amount && !isCustom && isIsraelLocale && (
        <Text
          style={isSelected ? styles.conversionSelected : styles.conversion}>
          {convertAmountToIls(amount, conversionRate)}
        </Text>
      )}
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
  conversion: {
    ...font.primary.regular,
    ...font.fontSize(1),
    color: colors.grey2,
  },
  conversionSelected: {
    ...font.primary.regular,
    ...font.fontSize(1),
    color: colors.white,
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

export default inject('uiStore')(observer(JoinAmount));
