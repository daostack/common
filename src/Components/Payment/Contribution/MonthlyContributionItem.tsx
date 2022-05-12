import {observer} from 'mobx-react';
import moment from 'moment';
import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from '~/Assets/iconfont/Icon';
import {SubscriptionStatus} from '~/Firebase/Databasee/EntityTypes/ISubscriptionEntity';
import {colors, font} from '~/Theme';
import {baseMargin} from '~/Theme/layout';
import {SUBSCRIPTION_STATUSES} from '~/Util/constants';
import {CurrencySymbols} from '~/Util/locale';

interface Props {
  dueDate: Date;
  status: SubscriptionStatus;
  amount?: number;
  onPress?: () => void;
}

export const MonthlyContributionItem = observer(
  ({dueDate, status, amount, onPress}: Props) => {
    const nextPaymentDate = useMemo(
      () => moment(dueDate).add(1, 'M').format('DD MMMM YYYY'),
      [dueDate],
    );

    if (status !== SUBSCRIPTION_STATUSES.ACTIVE) {
      return null;
    }

    return (
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        style={styles.container}>
        <View>
          <Text style={styles.paymentType}>Monthly Contribution</Text>
          <Text style={[styles.paymentText, styles.paymentInfo]}>
            Next payment: {nextPaymentDate}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.paymentText, styles.paymentAmount]}>
            {CurrencySymbols.SHEKEL}
            {amount ? amount / 100 : '0'}/mo
          </Text>
          <Icon name="right-arrow" color={colors.black} size={20} />
        </View>
      </TouchableOpacity>
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
    marginRight: baseMargin * 2,
  },
});
