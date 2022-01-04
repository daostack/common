import React, {ReactElement} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextInputField from '~/Components/FormikForm/TextInputField';
import {colors, font, layout, text} from '~/Theme';
import {CurrencySymbols} from '~/Util/locale';

const {width} = Dimensions.get('screen');

type Props = {
  onPressClose: () => void;
  proposalAmount?: number;
  invoicesAmount: number;
  description: string;
  setDescription: (value: string) => void;
  uploadInvoices: () => void;
};

export const UploadInvoicesInfo = ({
  onPressClose,
  proposalAmount,
  invoicesAmount,
  description,
  setDescription,
  uploadInvoices,
}: Props): ReactElement => (
  <>
    <View>
      <Text style={styles.title}>
        Please, make sure you've uploaded all the invoices
      </Text>
      <Text style={styles.hint}>You won't be able to add after uploading</Text>
    </View>
    <View style={styles.amountInfoContainer}>
      <View style={styles.amountInfo}>
        <Text style={styles.amountLabelText}>Proposal Requested</Text>
        <Text style={styles.amountValueText}>
          {`${CurrencySymbols.SHEKEL} ${
            proposalAmount ? proposalAmount / 100 : 0
          }`}
        </Text>
      </View>
      <View style={styles.amountInfo}>
        <Text style={styles.amountLabelText}>Invoices Total</Text>
        <Text style={styles.amountValueText}>
          {`${CurrencySymbols.SHEKEL} ${invoicesAmount}`}
        </Text>
      </View>
    </View>

    <TextInputField
      value={description}
      numberOfLines={5}
      multiline={true}
      viewStyle={styles.textInputView}
      placeholderText="Add Note"
      autoCapitalize="none"
      autoCorrect={false}
      onChangeText={(descriptionText) => setDescription(descriptionText)}
    />

    <TouchableOpacity
      style={{...layout.btnPrimary, ...layout.marginTopL}}
      onPress={uploadInvoices}>
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
  </>
);

export const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 25,
  },
  title: {
    ...text.h1BlackTitle,
    marginBottom: 20,
  },
  hint: {
    marginVertical: 30,
    ...font.primary.semiBold,
    ...font.fontSize(3),
  },
  amountInfoContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  amountInfo: {
    marginRight: 8,
    backgroundColor: colors.iceBlue,
    width: width / 2 - 24 - 8, // 24 - Horizontal, 8 margin between info blocks
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  amountLabelText: {
    marginBottom: 10,
    ...font.primary.regular,
    ...font.fontSize(1),
  },
  amountValueText: {
    ...font.fontSize(7),
    ...font.primary.bold,
  },
  textInputView: {
    alignSelf: 'stretch',
  },
  disabledUploadInvoiceBtn: {
    ...layout.btnPrimary,
    marginTop: 190,
    marginBottom: 40,
    width: '100%',
    backgroundColor: 'rgba(119,134,255,0.3)',
  },
});
