import {db} from '../Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';

export const getPaymentById = async (paymentId: string) =>
  (await db.collection(DB_COLLECTIONS.payments).doc(paymentId).get()).data();
