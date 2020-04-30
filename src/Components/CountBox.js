import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {text} from '../Theme';
import React from 'react';

const CountBox = ({count, name, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.countBox}>
      <Text style={{...styles.btnText, ...text.h1Black}}>{count}</Text>
      <Text style={styles.btnText}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  countBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',

    alignSelf: 'stretch',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
    alignSelf: 'center',
  },
});

export default CountBox;
