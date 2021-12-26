import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, font, layout, text} from '~/Theme';
import {func, object} from 'prop-types';
import BottomSheetModal from '~/Components/BottomSheetModal';
import Icon from '~/Assets/iconfont/Icon';
import TextInputField from '~/Components/FormikForm/TextInputField';

const ModalAddInvoiceAmount = ({
  isVisible,
  onPressClose,
  amount,
  onConfirm,
}) => {
  const [amountText, setAmountText] = useState(amount);

  console.log('Amount,', amount);

  useEffect(() => {
    setAmountText(amount);
    console.log('Changing amount,', amount);
  }, [amount]);

  return (
    <BottomSheetModal isVisible={isVisible} onClose={onPressClose}>
      <View style={{alignItems: 'center', width: '100%'}}>
        <Text
          style={{
            marginTop: 10,
            marginBottom: 10,
            ...font.primary.semiBold,
            ...font.fontSize(3),
          }}>
          Invoice Amount
        </Text>
        <TextInputField
          value={amountText}
          iconName="shekel"
          iconSize={12}
          viewStyle={{alignSelf: 'stretch'}}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(amountTextValue) => setAmountText(amountTextValue)}
        />
        <TouchableOpacity
          style={{...layout.btnPrimary, ...layout.marginTopL}}
          onPress={() => {
            onConfirm(amountText);
          }}>
          <Text style={text.buttoncenterwhite}>Done</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

ModalAddInvoiceAmount.propTypes = {
  onPressClose: func,
  children: object,
};

const styles = StyleSheet.create({});

export default ModalAddInvoiceAmount;
