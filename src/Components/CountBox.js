import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {text, font, colors} from '~/Theme';
import React from 'react';
import PropTypes from 'prop-types';

const CountBox = ({count, name, onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.countBox}>
    <Text style={styles.btnText}>{name}</Text>
    <Text style={text.h1Black}>{count}</Text>
  </TouchableOpacity>
);

CountBox.propTypes = {
  count: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
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
    ...font.fontSize(2),
    ...font.primary.regular,
    color: colors.greySteel,
    alignSelf: 'center',
    marginVertical: 10,
  },
});

export default CountBox;
