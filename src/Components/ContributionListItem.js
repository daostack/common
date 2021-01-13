import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {colors, font} from '../Theme';

import Icon from '../Assets/iconfont/Icon';
import MonthlyContributionStatus from './MonthlyContributionStatus';
import {
  ACTIVE,
  CANCELED_BY_PAYMENT,
  CANCELED_BY_USER,
  PAYMENT_FAILED,
} from '~/Services/SubscriptionService';
import {formatCurrency, formatDate} from '~/Util';

const ContributionListItem = ({subscription, navigation}) => {
  const isCanceled =
    subscription.status === CANCELED_BY_PAYMENT ||
    subscription.status === CANCELED_BY_USER;

  const onClick = () => {
    navigation.navigate('MonthlyContribution', {
      subscription,
    });
  };

  const dueDate = moment(subscription.dueDate.toDate()).format('D MMMM YYYY');
  const paymentAmount = formatCurrency(subscription.amount);

  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>
            {subscription.metadata?.common?.name}
          </Text>

          <Text style={styles.bottomText}>
            {isCanceled
              ? (subscription.dueDate.toDate() < new Date())
                ? 'Canceled by user'
                : 'Cancels at'
              : `Payment Due: ${dueDate}`}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusTextContainer}>
            <MonthlyContributionStatus
              status={subscription.status}
              dueDate={subscription.dueDate.toDate()}
            />

            <Text style={styles.bottomText}>
              {isCanceled
                ? formatDate(subscription.dueDate.toDate())
                : `${paymentAmount}/mo`}
            </Text>
          </View>

          <View>
            <Icon name="right-arrow" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

ContributionListItem.propTypes = {
  navigation: PropTypes.object,

  subscription: PropTypes.shape({
    metadata: PropTypes.shape({
      common: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
      }),
    }),

    id: PropTypes.string,
    dueDate: PropTypes.any,
    amount: PropTypes.number,

    status: PropTypes.oneOf([
      ACTIVE,
      PAYMENT_FAILED,
      CANCELED_BY_USER,
      CANCELED_BY_PAYMENT,
    ]),
  }),

  bottomSheetStore: PropTypes.shape({
    showBottomSheet: PropTypes.func,
  }),
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },

  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusTextContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 10,
  },

  title: {
    ...font.fontSize(3),
    fontWeight: '600',
  },

  bottomText: {
    ...font.fontSize(1),
    marginTop: 20,
  },

  icon: {
    marginBottom: 10,
  },

  active: {
    color: colors.lightishGreen,
  },

  inactive: {
    color: colors.error,
  },
});

export default ContributionListItem;
