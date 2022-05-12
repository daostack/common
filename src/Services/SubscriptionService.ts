import axios, {AxiosInstance} from 'axios';
import {auth} from '~/Firebase';
import {subscriptionsUrl} from '~/Config';
import {SubscriptionsCollection} from '~/Firebase/Databasee/Collections/SubscriptionsCollection';
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

class SubscriptionService {
  private axiosClient: AxiosInstance;
  private endpoints: {cancelSubscription: string; updateSubscription: string};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: subscriptionsUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      cancelSubscription: '/cancel',
      updateSubscription: '/update',
    };
  }

  cancelSubscription = async (subscriptionId: string): Promise<void> => {
    await this.axiosClient.post(
      this.endpoints.cancelSubscription,
      {
        subscriptionId,
      },
      {
        headers: {
          Authorization: await auth().currentUser?.getIdToken(),
        },
      },
    );
  };

  getUserSubscriptions = async (
    userId: string,
    onSnapshot: SubscriptionSnapshot,
  ): Promise<void> => {
    await SubscriptionsCollection.where('userId', '==', userId).onSnapshot(
      onSnapshot,
    );
  };

  getSubscription = async (
    subscriptionId: string,
    onSnapshot: SubscriptionSnapshot,
  ): Promise<void> => {
    await SubscriptionsCollection.doc(subscriptionId).onSnapshot(onSnapshot);
  };

  async updateSubscriptionAmount({
    subscriptionId,
    amount,
  }: {
    subscriptionId: string;
    amount: number;
  }): Promise<any> {
    try {
      return await this.axiosClient.post(
        this.endpoints.updateSubscription,
        {
          subscriptionId,
          amount,
        },
        {
          headers: {
            Authorization: await auth().currentUser.getIdToken(true),
          },
        },
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new SubscriptionService();
