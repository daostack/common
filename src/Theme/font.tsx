import {TextStyle} from 'react-native';

const fonts = [12, 13, 14, 18, 21, 24, 29, 32];
const letterSpacing = [0.4, 0.3, 0.2, 0.1, 0.4, 0.4, 0.4, 0.4];

export const fontSize = (fontIndex: number) => ({
  fontSize: fonts[fontIndex],
  letterSpacing: letterSpacing[fontIndex],
});
const lineHeights = [28
  , 28, 28];
const lineHeightForm = 28;

export const lineHeight = (lineHeightIndex: number) => ({
  lineHeight: lineHeights[lineHeightIndex],
});
const font = {
  heading: {
    bold: {
      fontFamily: 'NotoSerif-SemiBold',
    } as TextStyle,
  },
  primary: {
    bold: {
      fontFamily: 'NunitoSans-Bold',
      fontWeight: 'bold',
    } as TextStyle,
    semiBold: {
      fontFamily: 'NunitoSans-SemiBold',
      fontWeight: 'normal',
    } as TextStyle,
    italic: {
      fontFamily: 'NunitoSans-Italic',
      fontWeight: 'normal',
    } as TextStyle,
    regular: {
      fontFamily: 'NunitoSans-Regular',
      fontWeight: 'normal',
    } as TextStyle,
    regular2: {
      fontFamily: 'Nunito-Regular',
      fontWeight: 'normal',
    } as TextStyle,
    thin: {
      fontFamily: 'NunitoSans-Light',
      fontWeight: '100',
    } as TextStyle,
  },
};

export default {
  fontSize,
  lineHeight,
  lineHeightForm,
  ...font,
};
