const fonts = [
  12, // 0
  13, // 1
  14, // 2
  18, // 3
  20, // 4
  24, // 5
  29,
  32,
  // 15?
  // 17?
];

const letterSpacing = [0.4, 0.3, 0.2, 0.1, -0.1, -0.2, -0.2, -0.2];

export const fontSize = fontIndex => ({
  fontSize: fonts[fontIndex],
  letterSpacing: letterSpacing[fontIndex],
});

const lineHeights = [28, 28, 28];
const lineHeightForm = 28;
export const lineHeight = lineHeightIndex => ({
  lineHeight: lineHeights[lineHeightIndex],
});

const font = {
  heading: {
    bold: {
      fontFamily: 'NotoSerif-Bold',
      fontWeight: 'normal',
    },
    reguar: {
      fontFamily: 'NotoSerif-Bold',
      fontWeight: '200',
    },
  },
  primary: {
    bold: {
      fontFamily: 'NunitoSans-Bold',
      fontWeight: 'bold',
    },
    semiBold: {
      fontFamily: 'NunitoSans-SemiBold',
      fontWeight: 'normal',
    },
    italic: {
      fontFamily: 'NunitoSans-Italic',
      fontWeight: 'normal',
    },
    regular: {
      fontFamily: 'NunitoSans-Regular',
      fontWeight: 'normal',
    },
    regular2: {
      fontFamily: 'Nunito-Regular',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'NunitoSans-Light',
      fontWeight: '100',
    },
  },
  secondary: {
    semiBold: {
      fontFamily: 'Roboto',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
    },
    regular: {
      fontFamily: 'Roboto',
      fontWeight: 'normal',
    },
  },
};

export default {
  fontSize,
  lineHeight,
  lineHeightForm,
  ...font,
};
