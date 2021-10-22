import {StyleSheet} from 'react-native';

import {layout, font, colors, text, sizeS} from '~/Theme';

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionTabView: {},
  sectionContainer: {
    ...layout.content,
    marginVertical: sizeS,
    alignItems: 'center',
  },
  title: {
    ...font.heading.bold,
    ...font.fontSize(5),
  },
  tabStyleActive: {
    ...text.ashleyjquimbacom2,
    color: colors.black,
    fontWeight: 'bold',
  },
  tabStyle: {
    ...text.ashleyjquimbacom2,
    fontWeight: 'bold',
  },
});
