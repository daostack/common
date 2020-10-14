import React from 'react';
import {View, StyleSheet, Animated, Text, TouchableOpacity} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {colors, text, layout} from '~/Theme';
import {string, bool, object, number, array, shape, oneOfType} from 'prop-types';

const RequestStepDotHeader = ({headerHeight = 0, isFirstStepSkipped, currentIndex, navigation, title}) => {
  const totalDots = isFirstStepSkipped
    ? 4
    : 5;

  currentIndex = isFirstStepSkipped
    ? currentIndex - 1
    : currentIndex;

  return (
    <Animated.View style={[styles.header, {height: headerHeight}]}>
      <View style={{overflow: 'hidden'}}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 0,
            top: -2,
            padding: 0,
            zIndex: 9999,
          }}
          onPress={() => navigation.pop()}
        >
          <Icon name="left-arrow" size={32} style={{margin: 10}} />
        </TouchableOpacity>
        <View style={styles.bar}>
          <Text style={styles.title}>{title}
          </Text>
          <View
            style={{
              ...layout.marginTopS,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {[...Array(totalDots).keys()].map((x) => (
              <View
                key={x}
                style={x < currentIndex ? styles.dot : styles.dot2}
              />
            ))}
          </View>
        </View>
        <View />
      </View>
    </Animated.View>
  );
};

RequestStepDotHeader.propTypes = {
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
};

const styles = StyleSheet.create({
  bar: {
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    // bottomborder: 'solid',
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    overflow: 'hidden',
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.grey5,
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
    ...text.h3Black,
  },
});

export default RequestStepDotHeader;
