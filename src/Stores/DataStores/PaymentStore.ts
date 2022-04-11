import BaseStore from './BaseStore';
import RootStore from '../RootStore';
import {makeAutoObservable, observable, ObservableMap} from 'mobx';
import {IPaymentEntityBase} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';
import {Payment} from '~/Stores/Models/Payment';
import {Subscription} from '~/Stores/Models/Subscription';
import {ISubscriptionEntity} from '~/Firebase/Databasee/EntityTypes/ISubscriptionEntity';
import {Card} from '../Models/Card';
import {FirestoreUnsubscribeFn} from '~/Firebase/types';
import PaymentsService from '~/Services/PaymentsService';
import Logger from '~/Services/Logger';
import {
  updateStoreData,
  getDataArray,
  getDataById,
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
      return getDataArray(this.payments).filter(
        (payment) => payment.commonId === commonId,
      );
    } catch (e) {
      Logger.log('------ getCommonPayments error', e);
    }
  }

  getCommonSubscriptions(commonId: string): Array<Subscription> | undefined {
    try {
      return getDataArray(this.subscriptions).filter(
        (subscription) => subscription.metadata.common.id === commonId,
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

  subscribeToUserPayments = (userId: string): FirestoreUnsubscribeFn =>
    PaymentsService.subscribeToUserPayments(
      userId,
      updateStoreData(this.getPaymentEntityModel),
    );
}
