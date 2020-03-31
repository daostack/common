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

// Layout Stylesheet
export default StyleSheet.create({
  content: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },

  // Margin TOP
  marginTopS: {
    marginTop: 10,
  },
  marginTopM: {
    marginTop: 15,
  },
  marginTopL: {
    marginTop: 20,
  },
  marginTopXL: {
    marginTop: 40,
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
  marginLeftS: {
    marginLeft: 10,
  },
  marginLeftM: {
    marginLeft: 15,
  },
  marginLeftL: {
    marginLeft: 20,
  },
  marginLeftXL: {
    marginLeft: 40,
  },

  // Margin RIGHT
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
