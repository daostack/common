import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {layout, colors, font} from '~/Theme';
import Icon from '~/Assets/iconfont/Icon';
import {TabBar} from 'react-native-tab-view';
import {object} from 'prop-types';

const CommonTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: colors.mainBlue,
    }}
    renderLabel={({route, focused}) => (
      <View
        style={{
          ...layout.content,
          ...layout.flexRow,
          padding: 0,
          width: '100%',
        }}>
        {route.icon ? (
          <Icon
            name={route.icon}
            size={30}
            color={focused ? colors.mainBlue : colors.grey3}
          />
        ) : null}
        <Text style={focused ? styles.textStyleActive : styles.textStyle}>
          {route.title}
        </Text>
      </View>
    )}
    style={styles.commonStyles}
    tabStyle={styles.tabStyle}
  />
);

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
