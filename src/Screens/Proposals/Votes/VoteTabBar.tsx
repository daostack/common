import React, {ReactNode} from 'react';
import {StyleSheet, Text} from 'react-native';
import {
  NavigationState,
  SceneRendererProps,
  TabBar,
} from 'react-native-tab-view';
import {colors, font} from '~/Theme';

export const VoteTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<{
      index: number;
      key: string;
      title: string;
    }>;
  },
): ReactNode => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: colors.mainBlue,
    }}
    scrollEnabled
    renderLabel={({route, focused}) => (
      <Text
        style={[
          styles.tabTextStyle,
          focused ? styles.activeTextStyle : styles.inactiveTextStyle,
        ]}>
        {route.title}
      </Text>
    )}
    style={styles.commonStyles}
    tabStyle={styles.tabStyle}
  />
);

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
