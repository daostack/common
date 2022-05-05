import {observer} from 'mobx-react';
import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import {colors, font} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {firebase} from '~/Firebase';
import {CurrencySymbols} from '~/Util/locale';

interface Props {
  date: firebase.firestore.Timestamp;
  amount: number;
}

export const ContributionChargesItem = observer(({date, amount}: Props) => {
  const paymentDate = useMemo(() => {
    return moment(date).format('DD MMMM YYYY');
  }, [date]);

  return (
    <View style={styles.container}>
      {paymentDate && <Text style={styles.paymentInfo}>{paymentDate}</Text>}
      <Text style={styles.paymentInfo}>
        {CurrencySymbols.SHEKEL}
        {amount ? amount / 100 : '0'}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: baseMargin * 3,
    borderBottomColor: colors.grey4,
    borderBottomWidth: 1,
  },
  paymentInfo: {
    ...font.primary.regular,
    ...font.fontSize(2),
    color: colors.black,
  },
});
