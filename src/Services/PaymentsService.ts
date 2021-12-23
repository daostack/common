import {db} from '../Firebase';
import {DB_COLLECTIONS} from '~/Firebase/Databasee';
import {IPaymentEntity} from '~/Firebase/Databasee/EntityTypes/IPaymentEntity';

class PaymentService {
  private axiosClient: AxiosInstance;
  private endpoints: {createToken: string};

  constructor() {
    console.log('---payMeUrl()', payMeUrl());
    this.axiosClient = axios.create({
      baseURL: payMeUrl(),
      timeout: 1000000,
    });

    this.endpoints = {
      createToken: '/payme/payin/create-buyer-token-page',
      //update: '/update',
    };
  }

  async createBuyerTokenPage(userId: string): Promise<void> {
    console.log('---token', await auth().currentUser.getIdToken(true));
    try {
      return await this.axiosClient.post(
        this.endpoints.createToken,
        {
          cardId: userId,
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
