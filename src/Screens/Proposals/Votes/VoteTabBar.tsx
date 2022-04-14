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
      <Text style={[focused ? styles.textStyleActive : styles.textStyle]}>
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
  textStyle: {
    ...font.primary.regular,
    color: colors.grey3,
    ...font.fontSize(2),
    flexShrink: 1,
    paddingHorizontal: 8,
  },
  textStyleActive: {
    ...font.primary.semiBold,
    ...font.fontSize(2),
    color: colors.mainBlue,
    flexShrink: 1,
    flexWrap: 'nowrap',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
