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
}) => {
  const [isCustomSelected, setIsCustomSelected] = useState(0);
  const [selectedAmountId, setSelectedAmountId] = useState(-1);
  const textInputRef = useRef();

  const onAmountPress = (isCustom, amount, id) => {
    if (isCustom) {
      setIsCustomSelected(true);
      setSelectedAmountId(-1);
      textInputRef.current.focus();
      onCustomSelect();
    } else {
      setSelectedAmountId(id);
      onAmountSelected(amount);
    }
  };

  const onTogglePress = (e) => {
    setIsCustomSelected(false);
    onCustomClose();
  };

  return (
    <View>
      <View style={isCustomSelected ? styles.hidden : {}}>
        {
          [1, 2.5, 5, 1].map((c, index) =>
            <JoinAmount
              key={`JoinAmount_${index}`}
              id={index}
              isSelected={index === selectedAmountId}
              isCustom={index === 3}
              amount={c * minFeeToJoin}
              onPress={onAmountPress}
              isMonthly={isMonthly}/>)
        }
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
        toggleName="Other"
        validation={{
          name: RequestToJoinForm.FIELD_AMOUNT,
          formStore: formStore,
          validateRule: `required|numeric|min:${minFeeToJoin.toString()}`,
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
