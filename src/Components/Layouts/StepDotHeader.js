import React from 'react';
import {View, StyleSheet, Animated, Text, TouchableOpacity} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, font, layout} from '~/Theme';
import {
  string,
  object,
  number,
  oneOfType,
  shape,
  array,
  bool,
  func,
} from 'prop-types';

const StepDotHeader = ({
  headerHeight = 0,
  isFirstStepSkipped,
  currentIndex,
  navigation,
  title,
  totalDots,
  onClose,
}) => {
  if (isFirstStepSkipped) {
    totalDots = totalDots - 1;
    currentIndex = currentIndex - 1;
  }

  return (
    <Animated.View
      style={{
        ...styles.header,
        height: headerHeight,
        borderBottomWidth: headerHeight > 1 ? 1 : 0,
      }}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.pop()}>
          <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
        </TouchableOpacity>
        <View style={styles.bar}>
          <View style={styles.barContent}>
            {[...Array(totalDots).keys()].map((x) => (
              <View
                key={x}
                style={x === currentIndex - 1 ? styles.dot : styles.dot2}
              />
            ))}
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.close} onPress={() => onClose()}>
          <Icon
            name="close"
            size={18}
            style={{marginRight: 20}}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

StepDotHeader.propTypes = {
  headerHeight: oneOfType([
    number,
    shape({
      inputRange: array,
      outputRange: array,
      extrapolate: string,
    }),
  ]),
  isFirstStepSkipped: bool,
  currentIndex: number,
  navigation: object,
  title: string,
  totalDots: number,
  onClose: func,
};

const styles = StyleSheet.create({
  bar: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  barContent: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: {},
  close: {},
  headerContent: {
    ...layout.content,
    ...layout.flexRow,
    backgroundColor: colors.white,
    padding: 0,
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

export default StepDotHeader;
