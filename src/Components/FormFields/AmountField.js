import {StyleSheet, View} from 'react-native';
import React, {useState, useRef} from 'react';
import {layout, colors, text} from '~/Theme';
import JoinAmount from '../Commons/JoinAmount';
import TextInputFieldWithIcon from './TextInputFieldWithIcon';
import RequestToJoinForm from '../Forms/RequestToJoinForm';
import {number, func, object, bool} from 'prop-types';

const AmountField = ({
  formStore,
  onCustomSelect,
  onCustomClose,
  onAmountSelected,
  minFeeToJoin,
  isMonthly,
  zeroContribution,
}) => {
  const currFieldValue = formStore.getFormField(RequestToJoinForm.FIELD_AMOUNT)
    ?.value;
  const [isCustomSelected, setIsCustomSelected] = useState(0);
  const [selectedAmountId, setSelectedAmountId] = useState(
    currFieldValue ? currFieldValue.index : -1,
  );
  const textInputRef = useRef();
  const multiplications = zeroContribution ? [0, 1, 2.5] : [1, 2.5, 5];

  // from now on, there will be no option to create a common with 0 minFreeToJoin
  let contributionValues =
    minFeeToJoin > 0
      ? [...multiplications.map((m) => m * minFeeToJoin), 1 * minFeeToJoin]
      : [0, 5, 10, 10];

  const onAmountPress = (isCustom, amount, id) => {
    if (isCustom) {
      setIsCustomSelected(true);
      setSelectedAmountId(-1);
      textInputRef.current.focus();
      onCustomSelect();
    } else {
      setSelectedAmountId(id);
      onAmountSelected(amount, id);
    }
  };

  const onTogglePress = (e) => {
    setIsCustomSelected(false);
    onCustomClose();
  };

  const onCustomAmountChange = (amount) => {
    formStore.fieldChanged(RequestToJoinForm.FIELD_AMOUNT, {
      value: amount,
      index: -1,
    });
  };

  return (
    <View>
      <View style={isCustomSelected ? styles.hidden : {}}>
        {contributionValues.map((c, index) => (
          <JoinAmount
            key={`JoinAmount_${index}`}
            id={index}
            isSelected={index === selectedAmountId}
            isCustom={index === 3}
            amount={c}
            onPress={onAmountPress}
            isMonthly={isMonthly}
          />
        ))}
      </View>

      <TextInputFieldWithIcon
        forwardRef={textInputRef}
        iconName="dollar"
        iconSize={12}
        iconStyle={{paddingRight: 5}}
        iconEmptyColor={colors.grey3}
        iconFillColor={colors.grey}
        viewStyle={isCustomSelected ? styles.selectedCustom : styles.hidden}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numeric"
        onTogglePress={onTogglePress}
        onChangeText={onCustomAmountChange}
        toggleName="Other"
        value={{value: currFieldValue?.value || '', index: -1}}
        maxLength={5}
        validation={{
          name: RequestToJoinForm.FIELD_AMOUNT,
          formStore: formStore,
          validateRule: `required|numeric|min:${minFeeToJoin.toString()}|max:2500`,
          customErrorMessage: `The amount must be at least $${minFeeToJoin.toString()} and at most $2500.`,
        }}
      />
    </View>
  );
};

AmountField.propTypes = {
  formStore: object,
  onCustomSelect: func,
  onCustomClose: func,
  onAmountSelected: func,
  minFeeToJoin: number,
  isMonthly: bool,
  zeroContribution: bool,
};

const styles = StyleSheet.create({
  selectedCustom: {},

  hidden: {
    display: 'none',
  },
  container: {
    ...layout.content,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.grey4,
  },
  amount: {
    ...text.h3Black,
    color: colors.mainBlue,
  },
  ruleDescription: {
    ...text.blackText,
    ...layout.marginTopM,
    marginLeft: 30,
  },
});

export default AmountField;
