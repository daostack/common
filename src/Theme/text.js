import {StyleSheet} from 'react-native';
import colors from './colors';
import font from './font';
import layout from './layout';

const appFontFamily = {
  fontFamily: 'NunitoSans-Regular',
};

const style = {
  h1Black: {
    ...font.primary.bold,
    ...font.fontSize(5),
    lineHeight: 29,
    textAlign: 'center',
    color: colors.black,
  },
  h4Black: {
    ...font.primary.bold,
    ...font.fontSize(1),
    textAlign: 'center',
    color: colors.black,
  },
};

const isRTL = (text) => {
  const ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
    rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
    rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
  return text && rtlDirCheck.test(text);
};

export default StyleSheet.create({
  writingDirection: (text) => ({writingDirection: isRTL(text) ? 'rtl' : 'ltr'}),
  // textAlign: (text) => ({textAlign: isRTL(text) ? 'right' : 'left'}),
  h1Black: style.h1Black,
  h1BlackTitle: {
    lineHeight: 29,
    textAlign: 'center',
    ...layout.marginTopM,
    ...layout.marginBottomM,
    color: colors.black,
    ...font.heading.bold,
    ...font.fontSize(5),
  },
  h1BlackRegular: {
    ...style.h1Black,
    fontWeight: '200',
  },
  h2Black: {
    ...font.primary.bold,
    ...font.fontSize(3),
    textAlign: 'center',
    color: colors.black,
  },
  h3Black: {
    ...font.primary.bold,
    ...font.fontSize(2),
    textAlign: 'center',
    color: colors.black,
  },
  h4Black: {
    ...style.h4Black,
  },
  h4BlackRegular: {
    ...style.h4Black,
    fontWeight: '200',
  },
  buttonblack: {
    ...font.primary.regular,
    ...font.fontSize(3),
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.black,
  },
  buttoncenterwhite: {
    ...font.primary.regular,
    ...font.fontSize(3),
    lineHeight: 20,
    textAlign: 'center',
    color: colors.white,
  },
  buttonblue: {
    ...font.primary.semiBold,
    ...font.fontSize(3),
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.mainBlue,
  },
  buttonred: {
    ...font.primary.regular,
    ...font.fontSize(3),
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.error,
  },
  runningboldblue: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.mainBlue,
  },
  paragraphitaliclightGray: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'italic',
    letterSpacing: 0,
    textAlign: 'right',
    color: colors.paleblue,
  },
  textFieldplaceholder: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.grey3,
  },
  textFieldfocus: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.black,
  },
  textFielddisabled: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.paleblue,
  },
  runningred: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#ff1700',
  },
  runninglightGray: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.grey2,
  },
  runninggray: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.gray1,
  },
  runningblack: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: colors.black,
  },
  paragraphred: {
    ...appFontFamily,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.error,
  },
  tapBarUnselected: {
    ...appFontFamily,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.grey3,
  },
  tapBarselected: {
    ...appFontFamily,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.mainBlue,
  },
  smallBlackText: {
    ...font.primary.regular,
    ...font.fontSize(1),
    textAlign: 'center',
    color: colors.black,
  },
  ashleyjquimbacom: {
    ...appFontFamily,
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.mainBlue,
  },
  ashleyjquimbacom2: {
    ...font.primary.regular,
    ...font.fontSize(2),
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.grey3,
  },
  bvBmseYstWetqTFn5Au: {
    ...font.primary.regular,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    color: colors.slate,
  },

  greyText: {
    ...font.primary.regular,
    ...font.fontSize(2),
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.greyText,
  },
  smallGreyText: {
    ...font.primary.regular,
    ...font.fontSize(1),
    textAlign: 'center',
    color: colors.grey3,
  },

  smallBoldGreyText: {
    ...font.primary.bold,
    ...font.fontSize(1),
    ...appFontFamily,
    textAlign: 'center',
    color: colors.grey3,
  },

  orangeSmallBold: {
    ...appFontFamily,
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'center',
    color: colors.orange,
  },

  blackText: {
    ...font.primary.bold,
    ...font.fontSize(2),
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.black,
  },
  regularText: {
    ...font.primary.regular,
    ...font.fontSize(2),
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.black,
  },
  regularTextBig: {
    ...font.primary.regular,
    ...font.fontSize(3),
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.black,
  },

  lightishGreenText: {
    ...font.primary.bold,
    ...font.fontSize(3),
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.lightishGreen,
  },

  againstText: {
    ...font.primary.bold,
    ...font.fontSize(3),
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.against,
  },

  againstTextBlack: {
    ...appFontFamily,
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.black,
  },

  // Custom text styles
  centered: {
    textAlign: 'center',
  },

  bold: {
    fontWeight: 'bold',
  },

  // Font Colors

  fontColorGreySteel: {
    color: colors.greySteel,
  },
});
