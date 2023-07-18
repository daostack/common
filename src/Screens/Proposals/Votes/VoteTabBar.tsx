import React, {ReactNode} from 'react';
import {StyleSheet, Text} from 'react-native';
// import {
//   NavigationState,
//   SceneRendererProps,
//   TabBar,
// } from 'react-native-tab-view';
import {colors, font} from '~/Theme';

export const VoteTabBar = (): ReactNode => <View />;

const styles = StyleSheet.create({
  commonStyles: {
    backgroundColor: colors.white,
  },
  tabStyle: {
    borderColor: colors.grey4,
  },
  tabTextStyle: {
    ...font.fontSize(2),
    flexShrink: 1,
    paddingHorizontal: 8,
  },
  inactiveTextStyle: {
    ...font.primary.regular,
    color: colors.grey3,
  },
  activeTextStyle: {
    ...font.primary.semiBold,
    color: colors.mainBlue,
  },
});
