import axios from 'axios';
import auth from '@react-native-firebase/auth';

import {subscriptionsUrl} from '../Config';
import {db} from '../Firebase';

export const CANCELED_BY_PAYMENT = 'CanceledByPaymentFailure';
export const CANCELED_BY_USER = 'CanceledByUser';
export const PAYMENT_FAILED = 'PaymentFailed';
export const ACTIVE = 'Active';

export const cancelSubscription = async (subscriptionId) => {
  await axios.post(`${subscriptionsUrl()}/cancel?subscriptionId=${subscriptionId}`, null, {
    headers: {
      Authorization: await auth().currentUser.getIdToken(),
    },
  });
};

export const getUserSubscriptions = async (userId, onSnapshot) => {
  await db
    .collection('subscriptions')
    .where('userId', '==', userId)
    .onSnapshot(onSnapshot);
};

export const getSubscription = async (subscriptionId, onSnapshot) => {
  await db
    .collection('subscriptions')
    .doc(subscriptionId)
    .onSnapshot(onSnapshot);
};
