import {func, object} from 'prop-types';
import React, {ReactElement, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BottomSheetModal from '~/Components/BottomSheetModal';
import TextInputFieldWithIcon from '~/Components/FormikForm/TextInputFieldWithIcon';
import {font, layout, text, colors} from '~/Theme';

type Props = {
  isVisible: boolean;
  onPressClose: () => void;
  amount: number;
  onConfirm: (value: number) => void;
};

const ModalAddInvoiceAmount = ({
  isVisible,
  onPressClose,
  amount,
  onConfirm,
}: Props): ReactElement => {
  const [amountText, setAmountText] = useState<number>(amount);

  console.log('Amount,', amount);

  useEffect(() => {
    setAmountText(amount);
  }, [amount]);

  return (
    <BottomSheetModal isVisible={isVisible} onClose={onPressClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Invoice Amount</Text>
        <View style={{width: '100%', backgroundColor: '#fff'}}>
          <TextInputFieldWithIcon
            key={1}
            value={String(amountText)}
            iconName="shekel"
            iconSize={12}
            editable
            iconStyle={{paddingRight: 5}}
            iconEmptyColor={colors.grey3}
            viewStyle={{alignSelf: 'stretch'}}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            maxLength={5}
            onChangeText={(value) => setAmountText(Number(value))}
          />
        </View>
        <TouchableOpacity
          style={{
            ...layout.btnPrimary,
            ...layout.marginTopL,
            ...layout.marginBottomXL,
          }}
          onPress={() => {
            onConfirm(amountText);
          }}>
          <Text style={text.buttoncenterwhite}>Done</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
    ...font.primary.semiBold,
    ...font.fontSize(3),
  },
  textInput: {
    // alignSelf: 'stretch',
    width: '100%',
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default ModalAddInvoiceAmount;
