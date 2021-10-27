import axios from 'axios';
import auth from '@react-native-firebase/auth';

import {subscriptionsUrl} from '../Config';
import {db} from '../Firebase';
import {IFirebaseSnapshot} from '~/Firebase/types';
import {ISubscriptionEntity} from '~/Firebase/Databasee/EntityTypes/ISubscriptionEntity';

export const CANCELED_BY_PAYMENT = 'CanceledByPaymentFailure';
export const CANCELED_BY_USER = 'CanceledByUser';
export const PAYMENT_FAILED = 'PaymentFailed';
export const ACTIVE = 'Active';

export const expirationPeriod = 1209600; // 14 days in seconds

export type SubscriptionSnapshot = (
  snap: IFirebaseSnapshot<ISubscriptionEntity>,
) => void;

export const cancelSubscription = async (
  subscriptionId: string,
): Promise<void> => {
  await axios.post(
    `${subscriptionsUrl()}/cancel?subscriptionId=${subscriptionId}`,
    null,
    {
      headers: {
        Authorization: await auth().currentUser?.getIdToken(),
      },
    },
  );
};

export const getUserSubscriptions = async (
  userId: string,
  onSnapshot: SubscriptionSnapshot,
): Promise<void> => {
  await db
    .collection('subscriptions')
    .where('userId', '==', userId)
    .onSnapshot(onSnapshot);
};

export const getSubscription = async (
  subscriptionId: string,
  onSnapshot: SubscriptionSnapshot,
): Promise<void> => {
  await db
    .collection('subscriptions')
    .doc(subscriptionId)
    .onSnapshot(onSnapshot);
};
