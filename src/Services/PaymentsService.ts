import axios, {AxiosInstance} from 'axios';
import {db} from '../Firebase';
import {auth} from '~/Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {
  IPaymentEntity,
  ISaleEntity,
} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';
import {payMeUrl} from '~/Config';

class PaymentService {
  private axiosClient: AxiosInstance;
  private endpoints: {createToken: string};

  constructor() {
    this.axiosClient = axios.create({
      baseURL: payMeUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      createToken: '/payme/payin/create-buyer-token-page',
    };
  }

  async createBuyerTokenPage(cardId: string): Promise<ISaleEntity> {
    try {
      return await this.axiosClient.post(
        this.endpoints.createToken,
        {
          cardId,
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

  getPaymentById = async (paymentId: string): Promise<IPaymentEntity> =>
    (await db.collection(DB_COLLECTIONS.payments).doc(paymentId).get()).data();
}

export default new PaymentService();
