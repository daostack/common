import {StyleSheet} from 'react-native';
import {colors, font} from '~/Theme';

export default StyleSheet.create({
  root:  {
    paddingTop: 100,
    height: '100%',
  },
  view: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
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
  piggyBank: {
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
    backgroundColor: colors.iceBlue,
    paddingVertical: 12,
    paddingHorizontal: 19,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 28,
    marginBottom: 24,
  },
  button: {
    color: colors.white,
    ...font.primary.regular,
    fontSize: 16,
    padding: 14,
    textAlign: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: colors.mainBlue,
    marginBottom: 40,
  },
});
