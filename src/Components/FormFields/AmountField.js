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
      console.log(textInputRef.current);
      onCustomSelect();
    } else {
      onAmountSelected();
    }
  };

  const onTogglePress = e => {
    setIsCustomSelected(false);
    onCustomClose();
  };

  return (
    <View>
      <View style={isCustomSelected ? styles.hidden : {}}>
        <JoinAmount amount="$10" onPress={onAmountPress} />
        <JoinAmount amount="$20" onPress={onAmountPress} />
        <JoinAmount amount="$50" onPress={onAmountPress} />
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
        toggleName="Custom"
        validation={{
          name: RequestToJoinForm.FIELD_AMOUNT,
          formStore: formStore,
          validateRule: 'required|integer',
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
