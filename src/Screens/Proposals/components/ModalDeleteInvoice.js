import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {colors, font, layout, text} from '~/Theme';
import {func, object} from 'prop-types';
import BottomSheetModal from '~/Components/BottomSheetModal';

const ModalDeleteInvoice = ({isVisible, onPressClose, onConfirm}) => (
  <BottomSheetModal isVisible={isVisible} onClose={onPressClose}>
    <View style={{alignItems: 'center', width: '100%'}}>
      <Text
        style={{
          marginTop: 10,
          marginBottom: 10,
          ...font.primary.semiBold,
          ...font.fontSize(3),
        }}>
        Are you sure want to delete this invoice
      </Text>

      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{...layout.btnOutline, ...layout.marginTopL, marginRight: 10}}
          onPress={onPressClose}>
          <Text style={{...text.buttoncenterwhite, color: colors.black}}>
            Done
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...layout.btnPrimary,
            ...layout.marginTopL,
            marginLeft: 10,
            backgroundColor: colors.against,
          }}
          onPress={onConfirm}>
          <Text style={text.buttoncenterwhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </BottomSheetModal>
);

ModalDeleteInvoice.propTypes = {
  onPressClose: func,
  children: object,
};

const styles = StyleSheet.create({});

export default ModalDeleteInvoice;
