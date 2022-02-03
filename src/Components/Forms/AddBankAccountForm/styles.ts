import {StyleSheet, Dimensions, Platform} from 'react-native';
import {colors, font, layout} from '~/Theme';
import {STATUS_BAR_HEIGHT} from '~/Util/bottomTabHeight';

const {height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  body: {
    width: '100%',
    maxHeight: height - 150 - STATUS_BAR_HEIGHT,
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 6,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  image: {
    height: 116,
    aspectRatio: 1,
  },
  title: {
    ...font.primary.bold,
    fontSize: 20,
    lineHeight: 28,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    ...font.primary.bold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
    textAlign: 'left',
    width: '100%',
    marginTop: 14,
    marginBottom: 4,
    zIndex: 10,
  },
  text: {
    ...font.primary.regular,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  rowFieldsView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 10,
  },
  rowLeftView: {
    flex: 1,
    marginRight: 8,
    marginTop: 0,
  },
  rowRightView: {
    flex: 1,
    marginLeft: 8,
    marginTop: 0,
    ...(Platform.OS === 'android' && {zIndex: 10000}),
  },
  textfieldView: {
    alignSelf: 'stretch',
    marginTop: 12,
    flex: 1,
    paddingBottom: 0,
    zIndex: 10,
  },
  fileSelectorBlock: {
    width: '100%',
    ...layout.marginTopS,
  },
  btn: {
    alignSelf: 'stretch',
    ...layout.content,
    ...layout.flexRow,
    ...layout.flexStart,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 32,
    borderColor: colors.grey4,
    justifyContent: 'center',
  },
  deleteBtn: {
    marginTop: 35,
    marginBottom: 16,
    backgroundColor: colors.mainBlue,
  },
  btnText: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.mainBlue,
  },
  btnDeleteText: {
    textAlign: 'center',
    ...font.primary.regular,
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
  },
  inputTitle: {
    ...font.primary.regular,
    width: '100%',
    textAlign: 'left',
    lineHeight: 20,
    fontSize: 14,
  },
});
