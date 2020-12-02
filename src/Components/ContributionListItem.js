import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {colors, font, text} from '../Theme';
import {inject, observer} from 'mobx-react';
import {BOTTOM_SHEET_TEMPLATES} from '../Stores/BottomSheetStore';
import {subscriptionsUrl} from '../Config';
import Icon from '../Assets/iconfont/Icon';
import MonthlyContributionStatus from '../Screens/UserProfile/MonthlyContributionStatus';
import moment from 'moment';


const ContributionListItem = ({subscription, navigation}) => {
  const isCanceled = subscription.status === 'CanceledByPayment' ||
    subscription.status === 'CanceledByUser';

  const onClick = () => {
    navigation.navigate('MonthlyContribution', {
      subscription,
    });
  };

  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>
            {subscription.metadata?.common?.name}
          </Text>

          {isCanceled
            ? subscription.dueDate.toDate() < new Date()
              ? (
                <Text style={styles.bottomText}>
                  Canceled by user
                </Text>
              ) : (
                <Text style={styles.bottomText}>
                  Cancels at
                </Text>
              )
            : (
              <Text style={styles.bottomText}>
                Payment Due: {moment(subscription.dueDate.toDate()).format('D MMMM YYYY')}
              </Text>
            )
          }
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusTextContainer}>
            <MonthlyContributionStatus
              status={subscription.status}
              dueDate={subscription.dueDate.toDate()}
            />

            {isCanceled ? (
              <Text style={styles.bottomText}>
                {moment(subscription.dueDate.toDate()).format('D MMMM YYYY')}
              </Text>
            ) : (
              <Text style={styles.bottomText}>
                {(subscription.amount / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}/mo
              </Text>
            )}
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
      'Active',
      'CanceledByUser',
      'CanceledByPaymentFailure',
      'PaymentFailed',
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

