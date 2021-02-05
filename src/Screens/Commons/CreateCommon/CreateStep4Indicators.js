import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {string, bool, shape, number} from 'prop-types';

import {colors, font} from '~/Theme';
import {convertAmountToIls, isIsraelLocale} from '~/Util/locale';
import {inject, observer} from 'mobx-react';

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
  conversion: {
    ...font.primary.regular,
    ...font.fontSize(1),
    color: colors.grey2,
    textAlign: 'center',
  },
});

const CreateStep4Indicators = ({
  contribution,
  date,
  title,
  value,
  amount,
  userStore: {conversionRate},
}) => (
  <>
    <Text style={styles.text}>{title}</Text>

    <Text style={styles.val}>{contribution ? `$${value}` : value}</Text>

    {!contribution && <Text style={styles.date}>{date}</Text>}

    {contribution && isIsraelLocale && (
      <Text style={styles.conversion}>
        {convertAmountToIls(amount, conversionRate)}
      </Text>
    )}
  </>
);

CreateStep4Indicators.propTypes = {
  title: string.isRequired,
  value: string.isRequired,
  date: string,
  contribution: bool,
  amount: string,
  userStore: shape({
    conversionRate: number,
  }),
};

export default inject('userStore')(observer(CreateStep4Indicators));
