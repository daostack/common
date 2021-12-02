import {StyleSheet} from 'react-native';

import {font, colors, text, layout} from '~/Theme';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 26, 54, 0.3)',
  },
  container: {
    position: 'absolute',
    width: '90%',
  },
  modal: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: colors.mainBlue,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    ...font.fontSize(5),
    ...font.heading.bold,
    color: colors.white,
    textAlign: 'center',
  },
  description: {
    ...text.greyText,
    ...font.fontSize(2),
    fontWeight: '600',
    color: colors.grey4,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 14,
  },
  btn: {
    ...layout.btnOutline,
    height: 50,
  },
  btnText: {
    ...font.fontSize(3),
    color: colors.white,
  },
});
