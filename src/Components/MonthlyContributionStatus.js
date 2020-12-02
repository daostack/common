import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native';
import {colors} from '../Theme';

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
  <Text style={styles[(status === 'Active' || dueDate > new Date()) ? 'green' :
    status === 'CanceledByUser'
      ? 'gray'
      : 'red']}
  >
    {(status === 'Active' || dueDate > new Date())
      ? 'Active'
      : (status === 'CanceledByUser')
        ? 'Canceled'
        : 'Payment Failed'
    }
  </Text>
);

MonthlyContributionStatus.propTypes = {
  status: PropTypes.string.isRequired,
  dueDate: PropTypes.instanceOf(Date),
};

export default MonthlyContributionStatus;
