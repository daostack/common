import {StyleSheet} from 'react-native';
import colors from './colors';

// Common style for reuse in Stylesheet
const btn = {
  height: 56,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
  alignSelf: 'stretch',
  borderRadius: 28,
  paddingHorizontal: 50,
  flexGrow: 1,
};

const messageContainer = {
  position: 'relative',
  borderRadius: 7,
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowRadius: 3,
  shadowOpacity: 0.1,
};

const messageContainerTriangle = {
  position: 'absolute',
  bottom: -7,
  alignSelf: 'center',
  width: 0,
  height: 0,
  borderLeftWidth: 7,
  borderRightWidth: 7,
  borderTopWidth: 7,
  borderStyle: 'solid',
  backgroundColor: 'transparent',
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderTopColor: colors.mainBlue,
};

export const sizeXS = 5;
export const sizeS = 10;
export const sizeM = 15;
export const sizeL = 20;
export const sizeXL = 40;
export const sizeXXL = 55;

// Layout Stylesheet
export default StyleSheet.create({
  content: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexStart: {
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },

  // Margin TOP
  marginTopXS: {
    marginTop: sizeXS,
  },
  marginTopS: {
    marginTop: sizeS,
  },
  marginTopM: {
    marginTop: sizeM,
  },
  marginTopL: {
    marginTop: sizeL,
  },
  marginTopXL: {
    marginTop: sizeXL,
  },

  // Margin Bottom
  marginBottomS: {
    marginBottom: 10,
  },
  marginBottomM: {
    marginBottom: 15,
  },
  marginBottomL: {
    marginBottom: 20,
  },
  marginBottomXL: {
    marginBottom: 40,
  },

  // Margin LEFT

  marginLeftXS: {
    marginLeft: sizeXS,
  },

  marginLeftS: {
    marginLeft: sizeS,
  },
  marginLeftM: {
    marginLeft: sizeM,
  },
  marginLeftL: {
    marginLeft: sizeL,
  },
  marginLeftXL: {
    marginLeft: sizeXL,
  },

  // Margin RIGHT
  marginRightXS: {
    marginRight: sizeXS,
  },
  marginRightS: {
    marginRight: 10,
  },
  marginRightM: {
    marginRight: 15,
  },
  marginRightL: {
    marginRight: 20,
  },
  marginRightXL: {
    marginRight: 40,
  },

  // Padding Horizontal
  paddingHorizontalXL: {
    paddingLeft: 40,
    paddingRight: 40,
  },

  // Buttons
  btnPrimary: {
    ...btn,
    backgroundColor: colors.mainBlue,
  },
  btnOutline: {
    ...btn,
    borderWidth: 1,
    borderRadius: 28,
    borderColor: colors.grey4,
  },
  btnLeftIcon: {
    position: 'absolute',
    left: 12,
  },

  // Message container
  messageError: {
    ...messageContainer,
    backgroundColor: colors.redLight,
    padding: 20,
    color: colors.error,
  },

  messageErrorTriangle: {
    ...messageContainerTriangle,
    borderTopColor: colors.redLight,
  },

  // Forms
});
