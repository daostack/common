import {Dimensions, StyleSheet} from 'react-native';
import {colors, font, text, layout} from '~/Theme';

const {width} = Dimensions.get('screen');

export const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 25,
  },
  successContainer: {
    alignItems: 'center',
  },
  successLogo: {
    marginTop: 62,
    marginBottom: 62,
  },
  title: {
    ...text.h1BlackTitle,
    marginBottom: 20,
  },
  successTitle: {
    textAlign: 'center',
    ...font.primary.bold,
    ...font.fontSize(6),
    color: colors.black,
    lineHeight: 32,
  },
  hint: {
    marginVertical: 30,
    ...font.primary.semiBold,
    ...font.fontSize(3),
  },
  hintSuccess: {
    marginTop: 8,
    textAlign: 'center',
    ...font.primary.bold,
    ...font.fontSize(3),
    color: colors.black,
    lineHeight: 26,
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
  doneBtn: {
    marginTop: 130,
    marginBottom: 40,
  },
  disabledUploadInvoiceBtn: {
    ...layout.btnPrimary,
    marginTop: 190,
    marginBottom: 40,
    width: '100%',
    backgroundColor: 'rgba(119,134,255,0.3)',
  },
});
