import axios from 'axios';
import auth from '@react-native-firebase/auth';

import {subscriptionsUrl} from '../Config';
import {db} from '../Firebase';

export const CanceledByPayment = 'CanceledByPayment';
export const CanceledByUser = 'CanceledByUser';
export const PaymentFailed = 'PaymentFailed';
export const Active = 'Active';

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
