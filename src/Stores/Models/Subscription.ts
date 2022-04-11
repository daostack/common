import {makeAutoObservable} from 'mobx';
import {firebase} from '~/Firebase';
import {
  ISubscriptionEntity,
  ISubscriptionMetadata,
  ISubscriptionPayment,
  SubscriptionStatus,
} from '~/Firebase/Databasee/EntityTypes/ISubscriptionEntity';
import {CONTRIBUTION_SOURCE_TYPE} from '~/Firebase/Databasee/EntityTypes/shared';

export class Subscription implements ISubscriptionEntity {
  id: string;
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  cardId: string;
  userId: string;
  contributionSourceType: CONTRIBUTION_SOURCE_TYPE;
  proposalId: string;
  dueDate: firebase.firestore.Timestamp;
  status: SubscriptionStatus;
  amount: number;
  metadata: ISubscriptionMetadata;
  paymentFailures?: ISubscriptionPayment[];
  revoked: boolean;
  charges: number;
  lastChargedAt: firebase.firestore.Timestamp;

  constructor(newSubscriptionInfo: ISubscriptionEntity) {
    this.id = newSubscriptionInfo.id;
    this.createdAt = newSubscriptionInfo.createdAt;
    this.updatedAt = newSubscriptionInfo.updatedAt;
    this.cardId = newSubscriptionInfo.cardId;
    this.userId = newSubscriptionInfo.userId;
    this.contributionSourceType = newSubscriptionInfo.contributionSourceType;
    this.proposalId = newSubscriptionInfo.proposalId;
    this.dueDate = newSubscriptionInfo.dueDate;
    this.status = newSubscriptionInfo.status;
    this.amount = newSubscriptionInfo.amount;
    this.metadata = newSubscriptionInfo.metadata;
    this.paymentFailures = newSubscriptionInfo.paymentFailures;
    this.revoked = newSubscriptionInfo.revoked;
    this.charges = newSubscriptionInfo.charges;
    this.lastChargedAt = newSubscriptionInfo.lastChargedAt;
    makeAutoObservable(this);
  }
}
