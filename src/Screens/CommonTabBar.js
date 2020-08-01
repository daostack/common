import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import {layout, colors, font} from '../Theme';
import Icon from '../Assets/iconfont/Icon';
import {TabBar} from 'react-native-tab-view';

const CommonTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: colors.mainBlue,
    }}
    renderLabel={(props) => {
      return (
        <View style={{...layout.content, padding: 0}}>
          <Icon
            name={props.route.icon}
            size={30}
            color={props.focused ? colors.mainBlue : colors.grey3}
          />
          <Text style={props.focused ? styles.textStyleActive : styles.textStyle}>
            {props.route.title}
          </Text>
        </View>
      );
    }}
    style={styles.commonStyles}
    tabStyle={styles.tabStyle}
  />
);

export default CommonTabBar;

const styles = StyleSheet.create({
  commonStyles: {
    backgroundColor: colors.white,
  },
  tabStyle: {
    // borderTopWidth: 1,
    borderColor: colors.grey4,
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
  },
});
