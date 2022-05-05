import {observer} from 'mobx-react';
import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import moment from 'moment';
import {colors, font} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {CurrencySymbols} from '~/Util/locale';
import {SUBSCRIPTION_STATUSES} from '~/Util/constants';
import {SubscriptionStatus} from '~/Firebase/Databasee/EntityTypes/ISubscriptionEntity';

interface Props {
  dueDate: Date;
  status: SubscriptionStatus;
  amount?: number;
}

export const MonthlyContributionItem = observer(
  ({dueDate, status, amount}: Props) => {
    const nextPaymentDate = useMemo(
      () => moment(dueDate).add(1, 'M').format('DD MMMM YYYY'),
      [dueDate],
    );

    if (status !== SUBSCRIPTION_STATUSES.ACTIVE) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.paymentType}>Monthly Contribution</Text>
          <Text style={[styles.paymentText, styles.paymentInfo]}>
            Next payment: {nextPaymentDate}
          </Text>
        </View>
        <Text style={[styles.paymentText, styles.paymentAmount]}>
          {CurrencySymbols.SHEKEL}
          {amount ? amount / 100 : '0'}/mo
        </Text>
      </View>
    );
  },
);

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
    color: colors.mainBlue,
  },
  paymentText: {
    ...font.primary.regular,
    ...font.fontSize(1),
  },
  paymentInfo: {
    color: colors.mainBlue,
  },
  paymentAmount: {
    color: colors.black,
  },
});
