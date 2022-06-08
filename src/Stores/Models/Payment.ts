import {makeAutoObservable} from 'mobx';
import {
  IPaymentEntityBase,
  PaymentType,
  PaymentStatus,
  IPaymentFees,
  IPaymentAmount,
  IPaymentSource,
} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';
import {Nullable} from '~/Firebase/types';
import {firebase} from '~/Firebase';
import {CONTRIBUTION_SOURCE_TYPE} from '~/Firebase/Databasee/EntityTypes/shared';

export class Payment implements IPaymentEntityBase {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  type: PaymentType;
  status: PaymentStatus;
  contributionSourceType: CONTRIBUTION_SOURCE_TYPE;
  paymentMethod: 'card';
  amount: IPaymentAmount;
  fees: IPaymentFees;
  source: IPaymentSource;
  proposalId: string;
  commonId: string;
  subscriptionId?: Nullable<string>;
  userId: string;

  constructor(newPaymentInfo: IPaymentEntityBase) {
    this.id = newPaymentInfo.id;
    this.createdAt = newPaymentInfo.createdAt;
    this.updatedAt = newPaymentInfo.updatedAt;
    this.type = newPaymentInfo.type;
    this.status = newPaymentInfo.status;
    this.contributionSourceType = newPaymentInfo.contributionSourceType;
    this.paymentMethod = newPaymentInfo.paymentMethod;
    this.amount = newPaymentInfo.amount;
    this.fees = newPaymentInfo.fees;
    this.source = newPaymentInfo.source;
    this.proposalId = newPaymentInfo.proposalId;
    this.commonId = newPaymentInfo.commonId;
    this.subscriptionId = newPaymentInfo.subscriptionId;
    this.userId = newPaymentInfo.userId;
    makeAutoObservable(this);
  }
}
