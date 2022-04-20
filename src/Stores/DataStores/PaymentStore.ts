import {makeAutoObservable, observable, ObservableMap} from 'mobx';
import {IPaymentEntityBase} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';
import {ISubscriptionEntity} from '~/Firebase/Databasee/EntityTypes/ISubscriptionEntity';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import Logger from '~/Services/Logger';
import PaymentsService from '~/Services/PaymentsService';
import {Payment} from '~/Stores/Models/Payment';
import {Subscription} from '~/Stores/Models/Subscription';
import {
  getDataArray,
  getDataById,
  updateStoreData,
} from '~/Util/firebaseHelper';

export default class PaymentStore {
  private payments: ObservableMap<string, Payment> = observable.map({});
  private subscriptions: ObservableMap<string, Subscription> = observable.map(
    {},
  );

  constructor() {
    makeAutoObservable(this);
  }

  getCommonPayments(commonId: string): Array<Payment> | undefined {
    try {
      return getDataArray(this.payments)
        .filter((payment) => payment.commonId === commonId)
        .sort(
          (payment, prevPayment) =>
            prevPayment?.updatedAt?.seconds - payment?.updatedAt?.seconds,
        );
    } catch (e) {
      Logger.log('------ getCommonPayments error', e);
    }
  }

  getCommonSubscriptions(commonId: string): Array<Subscription> | undefined {
    try {
      return getDataArray(this.subscriptions)
        .filter((subscription) => {
          return subscription.metadata.common.id === commonId;
        })
        .sort(
          (subscription, prevSubscription) =>
            prevSubscription?.updatedAt?.seconds -
            subscription?.updatedAt?.seconds,
        );
    } catch (e) {
      Logger.log('------ getCommonSubscriptions error', e);
    }
  }

  getPaymentById = (id: string): Payment | undefined => {
    return getDataById<Payment>(this.payments, id);
  };

  getPaymentEntityModel(entity: IPaymentEntityBase): Payment {
    return new Payment(entity);
  }

  resetPayments(): void {
    this.payments.clear();
  }

  resetSubscriptions(): void {
    this.subscriptions.clear();
  }

  subscribeToUserPayments = (userId: string): FirestoreUnsubscribeFn =>
    PaymentsService.subscribeToUserPayments(
      userId,
      updateStoreData<IPaymentEntityBase, Payment>(
        this.payments,
        this.getPaymentEntityModel,
      ),
    );

  getSubscriptionEntityModel(entity: ISubscriptionEntity): Subscription {
    return new Subscription(entity);
  }

  subscribeToUserSubscriptions = (userId: string): FirestoreUnsubscribeFn =>
    PaymentsService.subscribeToUserSubscriptions(
      userId,
      updateStoreData<ISubscriptionEntity, Subscription>(
        this.subscriptions,
        this.getSubscriptionEntityModel,
      ),
    );
}
