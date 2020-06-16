import React from 'react';
import {View, StyleSheet, Animated, Text, TouchableOpacity} from 'react-native';
import Icon from '../../../Assets/iconfont/Icon';
import {colors, text, layout} from '../../../Theme';

const RequestStepDotHeader = props => {
  const headerHeight = props.headerHeight;
  const currentIndex = props.isFirstStepSkipped ? props.currentIndex - 1 : props.currentIndex;

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          shadowColor: 'rgba(79, 92, 105, 0.1)',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowRadius: 4,
          shadowOpacity: 1,
        },
      ]}>
      <View style={{overflow: 'hidden'}}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 0,
            top: -2,
            padding: 0,
            zIndex: 9999,
          }}
          onPress={() => props.navigation.pop()}>
          <Icon name="left-arrow" size={32} style={{margin: 10}} />
        </TouchableOpacity>
        <View style={styles.bar}>
          <Text style={styles.title}>{props.title}</Text>
          <View
            style={{
              ...layout.marginTopS,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {[...Array(3).keys()].map(x => (
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
    zIndex: 999,

    backgroundColor: colors.white,
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
