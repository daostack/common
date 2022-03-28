import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font} from '~/Theme';
import {CurrencySymbols} from '~/Util/locale';

interface Props {
  contributionType: string;
  minFeeToJoin: number;
}

export const PaymentDetailsHeader = ({
  minFeeToJoin,
  contributionType,
}: Props): ReactElement => (
  <View>
    <Text style={styles.header}>Payment Details</Text>
    <Text style={styles.hint}>
      You are contributing{' '}
      <Text style={styles.minFeeToJoin}>
        {CurrencySymbols.SHEKEL}
        {minFeeToJoin / 100} ({contributionType}){' '}
      </Text>
      to this {'\n'} Common.
      <Text style={[styles.hint, font.primary.bold]}>
        {' '}
        You will not be charged until another member joins
      </Text>{' '}
      the Common
    </Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    ...font.heading.bold,
  },
  hint: {
    color: colors.black,
    fontSize: 16,
    textAlign: 'center',
  },
  minFeeToJoin: {
    color: colors.mainBlue,
  },
});
