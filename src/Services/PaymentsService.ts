import {db} from '../Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {IPaymentEntity} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';

class PaymentService {
  getPaymentById = async (paymentId: string): Promise<IPaymentEntity> =>
    (await db.collection(DB_COLLECTIONS.payments).doc(paymentId).get()).data();
}

export default new PaymentService();
