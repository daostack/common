import {observer} from 'mobx-react-lite';
import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import {colors, font} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {firebase} from '~/Firebase';
import {CurrencySymbols} from '~/Util/locale';

interface Props {
  createdAt: firebase.firestore.Timestamp;
  amount: number;
}

export const ContributionItem = observer(({createdAt, amount}: Props) => {
  const paymentDate = useMemo(() => moment(createdAt).format('DD MMMM YYYY'), [
    createdAt,
  ]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.paymentType}>One-time Contribution</Text>
        <Text style={styles.paymentInfo}>{paymentDate}</Text>
      </View>
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
  paymentType: {
    ...font.primary.bold,
    ...font.fontSize(2),
    marginBottom: baseMargin,
  },
  paymentInfo: {
    ...font.primary.regular,
    ...font.fontSize(1),
    color: colors.black,
  },
});
