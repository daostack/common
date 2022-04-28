import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {CurrencySymbols} from '~/Util/locale';

interface Props {
  amount: number;
}

export const PaymentsHistoryInfo = observer(({amount}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        To this day, I have contributed to {'\n'} this common
      </Text>
      <Text style={styles.paymentAmount}>
        {CurrencySymbols.SHEKEL}
        {amount}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: baseMargin * 2,
    backgroundColor: colors.iceBlue,
    marginHorizontal: baseMargin * 3,
    marginVertical: baseMargin * 2,
    borderRadius: 10,
  },
  infoText: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
    textAlign: 'center',
    marginBottom: baseMargin * 2,
  },
  paymentAmount: {
    ...font.primary.bold,
    ...font.fontSize(5),
  },
});
