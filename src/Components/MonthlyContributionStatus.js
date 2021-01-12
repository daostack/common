import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native';
import {colors} from '../Theme';
import {ACTIVE, CANCELED_BY_USER} from '~/Services/SubscriptionService';

const styles = {
  green: {
    color: colors.lightishGreen,
  },

  red: {
    color: colors.error,
  },

  gray: {
    color: colors.gray1,
  },
};

const MonthlyContributionStatus = ({status, dueDate}) => (
  <Text
    style={
      styles[
        status === ACTIVE || (dueDate > new Date() && status === CANCELED_BY_USER)
          ? 'green'
          : status === CANCELED_BY_USER
          ? 'gray'
          : 'red'
      ]
    }>
    {status === ACTIVE || (dueDate > new Date() && status === CANCELED_BY_USER)
      ? 'Active'
      : status === CANCELED_BY_USER
      ? 'Canceled'
      : 'Payment Failed'}
  </Text>
);

MonthlyContributionStatus.propTypes = {
  status: PropTypes.string.isRequired,
  dueDate: PropTypes.instanceOf(Date),
};

export default MonthlyContributionStatus;
