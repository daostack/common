import {DB_COLLECTIONS} from '../index';
import {db} from '../../index';

export const SubscriptionsCollection = db.collection(
  DB_COLLECTIONS.subscriptions,
);
