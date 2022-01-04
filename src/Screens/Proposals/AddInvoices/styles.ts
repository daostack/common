import {StyleSheet} from 'react-native';
import {colors, font, layout, text} from '~/Theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  logo: {
    width: '100%',
    marginTop: 36,
    marginBottom: 50,
    resizeMode: 'contain',
  },
  commonNameText: {
    width: '100%',
    textAlign: 'center',
    ...text.h1BlackTitle,
  },
  userGreetingsText: {
    width: '100%',
    textAlign: 'center',
    marginVertical: 30,
    ...font.primary.semiBold,
    ...font.fontSize(3),
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoicePreview: {
    height: 120,
    borderRadius: 20,
  },
  addInvoiceIcon: {
    width: 60,
    height: 50,
    marginVertical: 30,
    resizeMode: 'contain',
  },
  addInvoiceText: {
    fontSize: 13,
    marginBottom: 10,
  },
  amountText: {
    color: colors.mainBlue,
    flex: 1,
    marginBottom: 10,
  },
  totalAmountText: {
    width: '100%',
    textAlign: 'center',
    ...text.h1BlackTitle,
    marginBottom: 20,
  },
  imageFieldPlaceholderView: {
    ...layout.content,
    backgroundColor: colors.iceBlue,
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  finishGridContainer: {
    padding: 10,
    justifyContent: 'center',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.iceBlue,
    borderRadius: 20,
    marginBottom: 20,
    flex: 1,
  },
  backgroundPdf: {
    ...layout.content,
    backgroundColor: colors.grey4,
    borderRadius: 20,
    height: 120,
  },
});
