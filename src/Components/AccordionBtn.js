import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const AccordionBtn = props => {
  return (
    <TouchableOpacity
      key={props.key}
      onPress={console.log}
      style={styles.accordionBtn}>
      <Text style={styles.btnText}>{props.name}</Text>
      <Image source={require('../Assets/rightArrow16.png')} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  accordionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    alignSelf: 'stretch',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 20,
    letterSpacing: 0,
  },
});

export default AccordionBtn;
