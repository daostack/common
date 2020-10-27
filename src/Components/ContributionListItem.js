import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import auth from '@react-native-firebase/auth';
import axios from 'axios';

import Icon from '../Assets/iconfont/Icon';
import {colors, font, text} from '../Theme';
import {inject, observer} from 'mobx-react';
import {BOTTOM_SHEET_TEMPLATES} from '../Stores/BottomSheetStore';
import {subscriptionsUrl} from '../Config';


const ContributionListItem = ({subscription, bottomSheetStore}) => {
  const isCanceled = subscription.status === 'CanceledByPayment' ||
      subscription.status === 'CanceledByUser';

  const onCancelConfirm = async () => {
    console.log(subscription);

    await axios.post(`${subscriptionsUrl()}/cancel?subscriptionId=${subscription.id}`, {}, {
      headers: {
        Authorization: await auth().currentUser.getIdToken(),
      },
    });
  };

  const onCancelClick = () => {
    bottomSheetStore.showBottomSheet(BOTTOM_SHEET_TEMPLATES.CANCEL_SUBSCRIPTION, {
      onCancelConfirm,
      commonName: subscription.metadata?.common?.name,
      dueDate: subscription.dueDate.toDate(),
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          {subscription.metadata?.common?.name}
        </Text>

        {isCanceled
          ? subscription.dueDate.toDate() < new Date()
            ? (
              <Text style={styles.dueText}>
                Your subscription is canceled!
              </Text>
            ) : (
              <Text style={styles.dueText}>
                Your subscription is canceled and you will be removed from the common on {subscription.dueDate.toDate()}
              </Text>
            )
          : (
            <Text style={styles.dueText}>
              Payment Due: {subscription.dueDate.toDate().toDateString()}
            </Text>
          )
        }

        <Text style={styles[subscription.status === 'Active' ? 'active' : 'inactive']}>
          {subscription.status === 'Active'
            ? 'Active'
            : isCanceled
              ? 'Canceled'
              : 'Attention Needed! Payment Failed!'
          }
        </Text>
      </View>

      {!isCanceled && (
        <TouchableOpacity style={styles.rightContainer} onPress={onCancelClick}>
          <Icon
            name="delete"
            size={16}
            style={styles.icon}
          />

          <Text>${subscription.amount}/mo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

ContributionListItem.propTypes = {
  commonName: PropTypes.string.isRequired,
  dueDate: PropTypes.instanceOf(Date).isRequired,
  amount: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  proposalId: PropTypes.string,

  subscriptionId: PropTypes.string.isRequired,

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

  rightContainer: {
    alignItems: 'flex-end',
  },

  title: {
    ...text.bold,
    ...font.fontSize(2),
  },

  dueText: {
    ...font.fontSize(1),
    marginVertical: 10,
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

export default inject('bottomSheetStore')(observer(ContributionListItem));

