import {firestore} from 'firebase-admin';

export interface IBillingDetails {
  createdAt?: firestore.Timestamp;

  updatedAt?: firestore.Timestamp;
}

export type IOnlyBillingDetails = Omit<
  IBillingDetails,
  'updatedAt' | 'createdAt'
>;
