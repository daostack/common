import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {layout, colors, text, font} from '~/Theme';
import {func, bool, number, InferProps} from 'prop-types';
import {inject, observer} from 'mobx-react';
import {uiStorePropTypes} from '~/Types/propTypes';
import {CurrencySymbols} from '~/Util/locale';

const props = {
  id: number.isRequired,
  amount: number,
  isCustom: bool,
  onPress: func,
  isSelected: bool,
  isMonthly: bool,
  uiStore: uiStorePropTypes.isRequired,
};
const JoinAmount: React.FC<InferProps<typeof props>> = ({
  id,
  amount,
  isCustom,
  onPress,
  isSelected,
  isMonthly,
}) => {
  const onAmountPress = () => {
    onPress(isCustom, amount, id);
  };
  return (
    <TouchableOpacity
      style={isSelected ? styles.containerSelected : styles.container}
      onPress={onAmountPress}>
      <Text style={isSelected ? styles.amountSelected : styles.amount}>{`${
        isCustom ? 'Other' : `${CurrencySymbols.SHEKEL}${amount}${isMonthly ? '/mo' : ''}`
      }`}</Text>
    </TouchableOpacity>
  );
};

JoinAmount.propTypes = props;

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
