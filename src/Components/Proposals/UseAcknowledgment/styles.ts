import {StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';

export default StyleSheet.create({
  root:  {
    paddingTop: 65,
    height: '100%',
  },
  view: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
  },
  questionMark: {
    marginBottom: 2,
  },
  causesText: {
    color: colors.mainBlue,
    ...font.primary.bold,
    fontSize: 14,
    lineHeight: 20,
  },
  underlined: {
    textDecorationLine: 'underline',
  },
  plug: {
    backgroundColor: colors.paleblue,
    width: 72,
    height: 6,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 16,
  },
  content: {
    marginHorizontal: 24,
  },
  acknowledgment: {
    height: 116,
    width: 116,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.black,
    ...font.primary.bold,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    paddingBottom: 8,
  },
  agreeText: {
    color: colors.black,
    ...font.primary.bold,
    fontSize: 16,
    lineHeight: 20,
    marginTop: 3,
  },
  subtitle: {
    color: colors.black,
    ...font.primary.bold,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 16,
  },
  text: {
    color: colors.black,
    ...font.primary.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryBold: {
    ...font.primary.bold,
  },
  smallText: {
    color: colors.black,
    ...font.primary.regular,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 26,
  },
  terms: {
    marginBottom: 26,
  },
  underlinedText: {
    color: colors.black,
    ...font.primary.bold,
    fontSize: 12,
    lineHeight: 16,
    textDecorationLine: 'underline',
  },
  centerText: {textAlign: 'center'},
  line: {
    backgroundColor: colors.grey4,
    height:1,
    marginVertical: 24,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  flex: {
    flex: 1,
  },
  checkMark: {
    height: 24,
    width: 24,
    marginRight: 8,
  },
  highlighted: {
    color: colors.black,
    backgroundColor: colors.iceBlue,
    paddingVertical: 12,
    paddingHorizontal: 19,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
  },
  button: {
    color: colors.slate,
    ...font.primary.regular,
    fontSize: 16,
    padding: 14,
    textAlign: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: colors.paleblue,
    marginBottom: 40,
  },
  buttonSelected: {
    color: colors.white,
    backgroundColor: colors.mainBlue,
  },
});
