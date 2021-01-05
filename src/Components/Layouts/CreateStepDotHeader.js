import React from 'react';
import {View, StyleSheet, Animated, Text, TouchableOpacity} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font} from '~/Theme';
import {string, object, number, oneOfType, shape, array} from 'prop-types';

const CreateStepDotHeader = ({headerHeight = 0, currentIndex, navigation, title}) => (
  <Animated.View style={{...styles.header, height: headerHeight, borderBottomWidth: headerHeight > 1 ? 1 : 0}}>
    <TouchableOpacity
      style={styles.back}
      onPress={() => navigation.pop()}>
      <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
    </TouchableOpacity>
    <View style={styles.bar}>
      <View style={styles.barContent}>
        {[...Array(4).keys()].map((x) => (
          <View
            key={x}
            style={x === currentIndex - 1 ? styles.dot : styles.dot2}
          />
        )
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  </Animated.View>
);

CreateStepDotHeader.propTypes = {
  headerHeight: oneOfType([
    number,
    shape({
      inputRange: array,
      outputRange: array,
      extrapolate: string,
    }),
  ]),
  currentIndex: number,
  navigation: object,
  title: string,
};

const styles = StyleSheet.create({
  bar: {
    //marginTop: 28,
    // height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    // bottomborder: 'solid',
    backgroundColor: colors.white,
  },
  barContent: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: {
    left: 0,
    top: 49,
    position: 'absolute',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 999,
    borderBottomColor: colors.grey4,
    backgroundColor: colors.grey4,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.mainBlue,
    borderColor: colors.mainBlue,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  dot2: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.grey5,
    borderColor: colors.grey3,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  title: {
    backgroundColor: 'transparent',
    color: colors.black,
    ...font.primary.bold,
    ...font.fontSize(3),
    paddingVertical: 5,
  },
});

export default CreateStepDotHeader;
