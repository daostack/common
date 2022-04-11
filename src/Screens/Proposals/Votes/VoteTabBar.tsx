import React, {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  TabBar,
  SceneRendererProps,
  NavigationState,
} from 'react-native-tab-view';
import {colors, font, layout} from '~/Theme';

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
      <View
        style={{
          ...layout.content,
          ...layout.flexRow,
          padding: 0,
        }}>
        <Text style={[focused ? styles.textStyleActive : styles.textStyle]}>
          {route.title}
        </Text>
      </View>
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
    width: 'auto',
    paddingHorizontal: 24,
  },
  textStyle: {
    ...font.primary.regular,
    color: colors.grey3,
    ...font.fontSize(2),
  },
  textStyleActive: {
    ...font.primary.semiBold,
    ...font.fontSize(2),
    color: colors.mainBlue,
    flex: 1,
  },
});
