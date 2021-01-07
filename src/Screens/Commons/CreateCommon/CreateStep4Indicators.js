import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {string, bool} from 'prop-types';

import {colors, font} from '~/Theme';

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginBottom: 10,
    ...font.primary.regular,
    ...font.fontSize(1),
    color: colors.slate,
  },
  val: {
    ...font.primary.bold,
    ...font.fontSize(3),
    textAlign: 'center',
  },
  date: {
    ...font.primary.regular,
    ...font.fontSize(0),

    textAlign: 'center',
  },
});

const CreateStep4Indicators = ({contribution, date, title, value}) => (
  <>
    <Text style={styles.text}>{title}</Text>

    <Text style={styles.val}>{contribution ? `$${value}` : value}</Text>

    {!contribution && <Text style={styles.date}>{date}</Text>}
  </>
);

CreateStep4Indicators.propTypes = {
  title: string.isRequired,
  value: string.isRequired,
  date: string,
  contribution: bool,
};

export default CreateStep4Indicators;
