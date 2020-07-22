import {StyleSheet, View} from 'react-native';
import React, {useState, useRef} from 'react';

import {layout, colors, text} from '../../Theme';
import JoinAmount from '../Commons/JoinAmount';
import TextInputFieldWithIcon from './TextInputFieldWithIcon';

import RequestToJoinForm from '../Forms/RequestToJoinForm';

const AmountField = ({
  formStore,
  onCustomSelect,
  onCustomClose,
  onAmountSelected,
  navigation,
  minFeeToJoin,
}) => {
  const [isCustomSelected, setIsCustomSelected] = useState(0);

  const textInputRef = useRef();
  /*
  const amount1Ref = useRef();
  const amount2Ref = useRef();
  const amount3Ref = useRef();
*/
  const onAmountPress = (isCustom, amount) => {
    if (isCustom) {
      setIsCustomSelected(true);
      textInputRef.current.focus();
      onCustomSelect();
    } else {
      onAmountSelected(amount);
    }
  };

  const onTogglePress = e => {
    setIsCustomSelected(false);
    onCustomClose();
  };

  return (
    <View>
      <View style={isCustomSelected ? styles.hidden : {}}>
        <JoinAmount amount={minFeeToJoin} onPress={onAmountPress} />
        <JoinAmount amount={2.5 * minFeeToJoin} onPress={onAmountPress} />
        <JoinAmount amount={5 * minFeeToJoin} onPress={onAmountPress} />
        <JoinAmount isCustom={true} onPress={onAmountPress} />
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
          validateRule: `required|integer|min:${minFeeToJoin}`,
        }}
      />
    </View>
  );
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
    fontWeight: '500',
    color: colors.mainBlue,
  },
  ruleDescription: {
    ...text.blackText,
    ...layout.marginTopM,
    marginLeft: 30,
  },
});

export default AmountField;
