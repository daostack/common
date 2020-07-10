import React from 'react';
import {Text, StyleSheet} from 'react-native';

import PropTypes from 'prop-types';
import {colors, font} from '../../../Theme';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginBottom: 10,
    ...font.primary.regular,
    ...font.fontSize(1),
    color: colors.slate,
  },
  val: {
    fontSize: 20,
    fontWeight: 'bold',
    ...font.primary.bold,
    ...font.fontSize(3),
    textAlign: 'center',
  },
});

const CreateStep4Indicators = ({currencySymbol = true, title, number}) => (
  <>
    <Text style={styles.text}>{title}</Text>
    <Text style={styles.val}>
      {currencySymbol && '$'}
      {number}
    </Text>
  </>
);
CreateStep4Indicators.propTypes = {
  title: PropTypes.string,
};
export default CreateStep4Indicators;
