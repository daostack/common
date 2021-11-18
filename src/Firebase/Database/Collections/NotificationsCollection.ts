import {DB_COLLECTIONS} from '../index';
import {db} from '../../index';

export const NotificationsCollection = db.collection(
  DB_COLLECTIONS.notification,
);
