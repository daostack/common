import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {font, layout, text} from '~/Theme';
import {func, object} from 'prop-types';
import BottomSheetModal from '~/Components/BottomSheetModal';
import {CurrencySymbols} from '~/Util/locale';
import TextInputField from '~/Components/FormikForm/TextInputField';

const ModalFinishUploadInvoices = ({
  isVisible,
  onPressClose,
  proposalAmount,
  invoicesAmount,
  description,
  setDescription,
  openFinish,
}) => (
  <BottomSheetModal
    isVisible={isVisible}
    onClose={onPressClose}
    style={{borderRadius: 25}}>
    <View>
      <Text
        style={{
          ...text.h1BlackTitle,
          marginBottom: 20,
        }}>
        Please, make sure you've uploaded all the invoices
      </Text>
      <Text
        style={{
          marginVertical: 30,
          ...font.primary.semiBold,
          ...font.fontSize(3),
        }}>
        You won't be able to add after uploading
      </Text>
    </View>
    <View style={{flexDirection: 'row'}}>
      <View style={{...styles.finishGridContainer, marginRight: 8}}>
        <Text
          style={{
            marginBottom: 10,
            ...font.primary.semiBold,
            ...font.fontSize(2),
          }}>
          Proposal Requested
        </Text>
        <Text
          style={{
            ...font.fontSize(7),
            ...font.primary.bold,
          }}>
          {`${CurrencySymbols.SHEKEL} ${proposalAmount / 100}`}
        </Text>
      </View>
      <View style={{...styles.finishGridContainer, marginLeft: 8}}>
        <Text
          style={{
            marginBottom: 10,
            ...font.primary.semiBold,
            ...font.fontSize(2),
          }}>
          Invoices Total
        </Text>
        <Text
          style={{
            ...font.fontSize(7),
            ...font.primary.bold,
          }}>
          {`${CurrencySymbols.SHEKEL} ${invoicesAmount}`}
        </Text>
      </View>
    </View>

    <TextInputField
      value={description}
      numberOfLines={5}
      multiline={true}
      viewStyle={{alignSelf: 'stretch'}}
      placeholderText="Describe your cause and let others know why they should join you. What makes you passionate about it? What does success look like?"
      autoCapitalize="none"
      autoCorrect={false}
      onChangeText={(descriptionText) => setDescription(descriptionText)}
    />

    <TouchableOpacity
      style={{...layout.btnPrimary, ...layout.marginTopL}}
      onPress={openFinish}>
      <Text style={text.buttoncenterwhite}>Upload Invoices</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        ...layout.btnOutline,
        ...layout.marginTopL,
        ...layout.marginBottomXL,
      }}
      onPress={onPressClose}>
      <Text>I have more invoices to upload</Text>
    </TouchableOpacity>
  </BottomSheetModal>
);

ModalFinishUploadInvoices.propTypes = {
  onPressClose: func,
  children: object,
};

const styles = StyleSheet.create({});

export default ModalFinishUploadInvoices;
