const fonts = [
  12, // 0
  14, // 1
  16, // 2
  18, // 3
  20, // 4
  24, // 5
  29,
  32,
  // 15?
  // 17?
];

export const fontSize = fontIndex => ({
  fontSize: fonts[fontIndex],
});

const font = {
  heading: {
    bold: {
      fontFamily: 'NotoSerif-Bold',
      fontWeight: 'normal',
      letterSpacing: -0.2, // Semi Compressed
    },
  },
  primary: {
    bold: {
      letterSpacing: 0.2,
      fontFamily: 'NunitoSans-Bold',
      fontWeight: 'bold',
    },
    semiBold: {
      letterSpacing: 0.2,
      fontFamily: 'NunitoSans-SemiBold',
      fontWeight: 'normal',
    },
    italic: {
      letterSpacing: 0.2,
      fontFamily: 'NunitoSans-Italic',
      fontWeight: 'normal',
    },
    regular: {
      letterSpacing: 0.2,
      fontFamily: 'NunitoSans-Regular',
      fontWeight: 'normal',
    },
    regular2: {
      fontFamily: 'Nunito-Regular',
      fontWeight: 'normal',
    },
    thin: {
      letterSpacing: 0.2,
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
  ...font,
};
