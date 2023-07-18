import React, {ReactElement} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {layout, colors, font} from '~/Theme';
import Icon, {IconNames} from '~/Assets/iconfont/Icon';
import {object} from 'prop-types';

const CommonTabBar = (props: TabBarProps<any>): ReactElement => <View />;

CommonTabBar.propTypes = {
  props: object,
};

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

export default CommonTabBar;
