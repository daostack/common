import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {layout, colors, text, font} from '~/Theme';
import {func, bool, number, InferProps, shape} from 'prop-types';
import {convertAmountToIls, isIsraelLocale} from '~/Util/locale';
import {inject, observer} from 'mobx-react';

const props = {
  id: number.isRequired,
  amount: number,
  isCustom: bool,
  onPress: func,
  isSelected: bool,
  isMonthly: bool,
  userStore: shape({
    conversionRate: number,
  }),
};
const JoinAmount: React.FC<InferProps<typeof props>> = ({
  id,
  amount,
  isCustom,
  onPress,
  isSelected,
  isMonthly,
  userStore: {conversionRate},
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

export default inject('userStore')(observer(JoinAmount));
