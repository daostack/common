import React from 'react';
import {View, StyleSheet, Animated, Text, TouchableOpacity} from 'react-native';
import Icon from '../../Assets/iconfont/Icon';
import {colors} from '../../Theme';

const RequestStepDotHeader = props => {
  const headerHeight = props.headerHeight;
  const currentIndex = props.currentIndex;

  return (
    <Animated.View style={[styles.header, {height: headerHeight}]}>
      <TouchableOpacity
        style={{left: 0, top: 49, position: 'absolute'}}
        onPress={() => props.navigation.pop()}>
        <Icon name="left-arrow" size={32} style={{marginLeft: 10}} />
      </TouchableOpacity>
      <View style={styles.bar}>
        <View
          style={{
            marginTop: 80,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {[...Array(4).keys()].map(x => (
            <View key={x} style={x < currentIndex ? styles.dot : styles.dot2} />
          ))}
        </View>
        <Text style={styles.title}>{props.title}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    // bottomborder: 'solid',
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
    backgroundColor: 'transparent',
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});

export default RequestStepDotHeader;
